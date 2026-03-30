import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL_DEV, API_URL_PROD, API_URL_LOCAL } from "@env";

const normalizeBaseUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\/+$/, "");
};

const unique = (arr) => [...new Set(arr.filter(Boolean))];

const DEV_URL = normalizeBaseUrl(API_URL_DEV);
const PROD_URL = normalizeBaseUrl(API_URL_PROD);
const LOCAL_URL = normalizeBaseUrl(API_URL_LOCAL);

const CANDIDATE_BASE_URLS = __DEV__
  ? unique([DEV_URL, LOCAL_URL, PROD_URL])
  : unique([PROD_URL, DEV_URL, LOCAL_URL]);

let activeBaseUrlIndex = 0;
export let BASE_URL = CANDIDATE_BASE_URLS[activeBaseUrlIndex] || "http://localhost:5001";

const setActiveBaseUrl = (index) => {
  activeBaseUrlIndex = index;
  BASE_URL = CANDIDATE_BASE_URLS[index];
  API.defaults.baseURL = `${BASE_URL}/api`;
};

const getNextBaseUrlIndex = (triedIndexes = []) => {
  for (let i = 0; i < CANDIDATE_BASE_URLS.length; i += 1) {
    if (!triedIndexes.includes(i)) return i;
  }
  return -1;
};

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 12000,
});

const responseCache = new Map();
const inflightGetRequests = new Map();
const PERSISTENT_CACHE_PREFIX = "cc_cache:";

const CACHE_TTL = {
  home: 60 * 1000,
  events: 20 * 1000,
  search: 15 * 1000,
  eventDetails: 30 * 1000,
};

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const stableStringify = (value) => {
  if (!value || typeof value !== "object") return String(value ?? "");
  const keys = Object.keys(value).sort();
  const normalized = {};
  keys.forEach((key) => {
    normalized[key] = value[key];
  });
  return JSON.stringify(normalized);
};

const createCacheKey = (url, params = {}) => `${url}?${stableStringify(params)}`;

const getCachedData = (cacheKey) => {
  const cached = responseCache.get(cacheKey);
  if (!cached) return null;
  if (Date.now() > cached.expiresAt) {
    responseCache.delete(cacheKey);
    return null;
  }
  return cached.data;
};

const setCachedData = (cacheKey, data, ttlMs) => {
  responseCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
};

const getPersistentCacheKey = (cacheKey) => `${PERSISTENT_CACHE_PREFIX}${cacheKey}`;

const getPersistentCachedData = async (cacheKey) => {
  try {
    const raw = await AsyncStorage.getItem(getPersistentCacheKey(cacheKey));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.data || !parsed?.expiresAt) return null;
    if (Date.now() > parsed.expiresAt) return null;

    return parsed.data;
  } catch (err) {
    return null;
  }
};

const setPersistentCachedData = async (cacheKey, data, ttlMs) => {
  try {
    await AsyncStorage.setItem(
      getPersistentCacheKey(cacheKey),
      JSON.stringify({
        data,
        expiresAt: Date.now() + ttlMs,
      })
    );
  } catch (_) {
    // Ignore write failures to keep API calls non-blocking.
  }
};

const isRetryableError = (err) => {
  if (!err?.response) return true;
  return RETRYABLE_STATUS.has(err.response.status);
};

const requestWithRetry = async ({
  method = "get",
  url,
  params,
  data,
  headers,
  timeout,
  signal,
  retries = 1,
  retryDelayMs = 300,
  useCache = false,
  persistentCache = false,
  cacheTtlMs = 0,
  dedupe = false,
}) => {
  const lowerMethod = method.toLowerCase();
  const isGet = lowerMethod === "get";
  const cacheKey = isGet ? createCacheKey(url, params) : null;

  if (isGet && useCache && cacheKey) {
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  if (isGet && dedupe && cacheKey && inflightGetRequests.has(cacheKey)) {
    return inflightGetRequests.get(cacheKey);
  }

  const execute = async () => {
    let attempt = 0;

    while (attempt <= retries) {
      try {
        const response = await API.request({
          method: lowerMethod,
          url,
          params,
          data,
          headers,
          timeout,
          signal,
        });

        if (isGet && useCache && cacheKey && cacheTtlMs > 0) {
          setCachedData(cacheKey, response.data, cacheTtlMs);
          if (persistentCache) {
            setPersistentCachedData(cacheKey, response.data, cacheTtlMs);
          }
        }

        return response.data;
      } catch (err) {
        const shouldRetry = attempt < retries && isRetryableError(err);
        if (!shouldRetry) {
          if (isGet && useCache && cacheKey) {
            const staleData = responseCache.get(cacheKey)?.data;
            if (staleData) return staleData;

            if (persistentCache) {
              const persisted = await getPersistentCachedData(cacheKey);
              if (persisted) return persisted;
            }
          }
          throw err;
        }

        await sleep(retryDelayMs * (attempt + 1));
        attempt += 1;
      }
    }

    throw new Error("Request failed after retries");
  };

  if (!isGet || !dedupe || !cacheKey) {
    return execute();
  }

  const promise = execute().finally(() => {
    inflightGetRequests.delete(cacheKey);
  });

  inflightGetRequests.set(cacheKey, promise);
  return promise;
};

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("API request interceptor error:", err);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err?.config || {};

    const shouldRetryWithFallback =
      !originalConfig.__baseUrlFallbackAttempt &&
      (err?.code === "ECONNABORTED" || !err?.response || err?.response?.status >= 500);

    if (shouldRetryWithFallback && CANDIDATE_BASE_URLS.length > 1) {
      const tried = originalConfig.__triedBaseUrlIndexes || [activeBaseUrlIndex];
      const nextBaseUrlIndex = getNextBaseUrlIndex(tried);

      if (nextBaseUrlIndex !== -1) {
        const retryConfig = {
          ...originalConfig,
          baseURL: `${CANDIDATE_BASE_URLS[nextBaseUrlIndex]}/api`,
          __baseUrlFallbackAttempt: true,
          __triedBaseUrlIndexes: [...tried, nextBaseUrlIndex],
        };

        try {
          const retryResponse = await API.request(retryConfig);
          setActiveBaseUrl(nextBaseUrlIndex);
          return retryResponse;
        } catch (retryErr) {
          err = retryErr;
        }
      }
    }

    if (err?.response?.status === 401) {
      try {
        await AsyncStorage.removeItem("token");
      } catch (_) { }
    }
    return Promise.reject(err);
  }
);

export default API;

export const authAPI = {
  register: async (payload) => {
    return requestWithRetry({
      method: "post",
      url: "/user/register",
      data: payload,
      retries: 0,
    });
  },
  login: async (payload) => {
    return requestWithRetry({
      method: "post",
      url: "/user/login",
      data: payload,
      retries: 0,
    });
  },
  logout: async () => {
    return requestWithRetry({
      method: "post",
      url: "/user/logout",
      retries: 0,
    });
  },
};

export const userAPI = {
  getProfile: async (token) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
    return requestWithRetry({
      method: "get",
      url: "/user/me",
      headers: config?.headers,
      retries: 1,
      dedupe: true,
    });
  },
  updateProfile: async (payload) => {
    return requestWithRetry({
      method: "put",
      url: "/user/update",
      data: payload,
      retries: 0,
    });
  },
};

export const eventAPI = {
  submitRequest: async (payload) => {
    return requestWithRetry({
      method: "post",
      url: "/events/request",
      data: payload,
      retries: 0,
    });
  },

  create: async (payload, images) => {
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      form.append(key, value);
    });

    images.forEach((uri, index) => {
      const ext = uri.split(".").pop();
      const name = `image_${Date.now()}_${index}.${ext}`;

      form.append("images", {
        uri,
        name,
        type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      });
    });

    return requestWithRetry({
      method: "post",
      url: "/events/request",
      data: form,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      retries: 0,
      timeout: 25000,
    });
  },

  getAll: async (params = { limit: 60 }) => {
    try {
      const data = await requestWithRetry({
        method: "get",
        url: "/events/home",
        params,
        retries: 2,
        dedupe: true,
        useCache: true,
        persistentCache: true,
        cacheTtlMs: CACHE_TTL.home,
      });
      return data?.events || [];
    } catch (err) {
      console.log("ERROR FETCHING EVENTS:", err.response?.data || err.message);
      return [];
    }
  },

  getList: async (params) => {
    return requestWithRetry({
      method: "get",
      url: "/events",
      params,
      retries: 2,
      dedupe: true,
      useCache: true,
      persistentCache: true,
      cacheTtlMs: CACHE_TTL.events,
    });
  },

  getById: async (id) => {
    try {
      return await requestWithRetry({
        method: "get",
        url: `/events/${id}`,
        retries: 1,
        dedupe: true,
        useCache: true,
        persistentCache: true,
        cacheTtlMs: CACHE_TTL.eventDetails,
      });
    } catch (err) {
      console.log("ERROR FETCHING EVENT:", err.response?.data || err.message);
      return null;
    }
  },

  search: async (query, options = {}) => {
    try {
      return await requestWithRetry({
        method: "get",
        url: "/events/search",
        params: {
          q: query,
          limit: 15,
        },
        signal: options.signal,
        retries: 1,
        dedupe: true,
        useCache: true,
        cacheTtlMs: CACHE_TTL.search,
      });
    } catch (err) {
      console.log("SEARCH API ERROR:", err.response?.data || err.message);
      return [];
    }
  },
  getMy: async () => {
    try {
      const data = await requestWithRetry({
        method: "get",
        url: "/events/me",
        retries: 1,
        dedupe: true,
      });
      return data?.data || [];
    } catch (err) {
      console.log("MY EVENTS ERROR:", err.response?.data || err.message);
      return [];
    }
  },

  deleteMy: async (id) => {
    try {
      const safeId = Number(id);

      if (!safeId || Number.isNaN(safeId)) {
        throw new Error("Invalid event id");
      }

      await requestWithRetry({
        method: "delete",
        url: `/events/me/${safeId}`,
        retries: 0,
      });
    } catch (err) {
      console.log("DELETE EVENT ERROR:", err.response?.data || err.message);
      throw err;
    }
  },

  getAdminEvents: async (params) => {
    return requestWithRetry({
      method: "get",
      url: "/events/admin",
      params,
      retries: 1,
      dedupe: true,
      useCache: true,
      cacheTtlMs: CACHE_TTL.events,
    });
  },

  updateStatus: async (id, status) => {
    await requestWithRetry({
      method: "patch",
      url: `/events/admin/${id}/status`,
      data: { status },
      retries: 0,
    });
  },
  
  deleteAdmin: async (id) => {
    await requestWithRetry({
      method: "delete",
      url: `/events/admin/${id}`,
      retries: 0,
    });
  }
};
