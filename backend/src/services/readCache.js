const Redis = require("ioredis");

const cacheStore = new Map();
const refreshLocks = new Set();

let redisClient = null;
let lastErrorLog = 0;
const ERROR_LOG_INTERVAL = 30000; // Only log Redis errors once per 30s

function createRedisClient() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) return null;

    const client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
    });

    client.on("error", (err) => {
        const now = Date.now();
        if (now - lastErrorLog > ERROR_LOG_INTERVAL) {
            console.warn("[cache] redis unavailable, using in-memory fallback", err?.code || err?.message);
            lastErrorLog = now;
        }
    });

    return client;
}

function getRedisClient() {
    if (redisClient !== null) return redisClient;
    redisClient = createRedisClient();
    return redisClient;
}

function buildCacheKey(namespace, params = {}) {
    const ordered = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});

    return `${namespace}:${JSON.stringify(ordered)}`;
}

async function readEnvelope(key) {
    const redis = getRedisClient();

    if (redis) {
        try {
            const raw = await redis.get(key);
            if (!raw) return null;

            try {
                return JSON.parse(raw);
            } catch {
                return null;
            }
        } catch (err) {
            // Redis unavailable, fall back to in-memory silently
            const value = cacheStore.get(key);
            if (!value) return null;
            return value;
        }
    }

    const value = cacheStore.get(key);
    if (!value) return null;
    return value;
}

async function writeEnvelope(key, envelope) {
    const redis = getRedisClient();

    if (redis) {
        try {
            const secondsLeft = Math.max(
                Math.ceil((envelope.staleUntil - Date.now()) / 1000),
                1,
            );
            await redis.set(key, JSON.stringify(envelope), "EX", secondsLeft);
            return;
        } catch (err) {
            // Redis unavailable, fall back to in-memory silently
            cacheStore.set(key, envelope);
            return;
        }
    }

    cacheStore.set(key, envelope);
}

async function refreshInBackground(key, config, producer) {
    if (refreshLocks.has(key)) return;
    refreshLocks.add(key);

    try {
        const payload = await producer();
        const now = Date.now();
        const envelope = {
            payload,
            freshUntil: now + config.ttlMs,
            staleUntil: now + config.staleMs,
            cachedAt: now,
        };
        await writeEnvelope(key, envelope);
    } catch (err) {
        console.error("[cache] background refresh failed", err?.message || err);
    } finally {
        refreshLocks.delete(key);
    }
}

async function getOrSetSWR({ key, ttlMs, staleMs, producer }) {
    const now = Date.now();
    const envelope = await readEnvelope(key);

    if (envelope && envelope.freshUntil > now) {
        return {
            data: envelope.payload,
            cacheStatus: "HIT_FRESH",
            cachedAt: envelope.cachedAt,
        };
    }

    if (envelope && envelope.staleUntil > now) {
        refreshInBackground(key, { ttlMs, staleMs }, producer);
        return {
            data: envelope.payload,
            cacheStatus: "HIT_STALE",
            cachedAt: envelope.cachedAt,
        };
    }

    const payload = await producer();
    const freshEnvelope = {
        payload,
        freshUntil: now + ttlMs,
        staleUntil: now + staleMs,
        cachedAt: now,
    };
    await writeEnvelope(key, freshEnvelope);

    return {
        data: payload,
        cacheStatus: "MISS",
        cachedAt: now,
    };
}

module.exports = {
    getOrSetSWR,
    buildCacheKey,
};
