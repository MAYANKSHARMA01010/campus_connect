const DEFAULT_LIMIT = 120;
const MIN_REFRESH_MS = 60 * 1000;
const MAX_REFRESH_MS = 5 * 60 * 1000;

const EVENT_HOME_SELECT = {
  id: true,
  title: true,
  category: true,
  subCategory: true,
  date: true,
  email: true,
  location: true,
  hostName: true,
  images: {
    take: 1,
    orderBy: { id: "asc" },
    select: {
      id: true,
      url: true,
    },
  },
};

const cache = {
  updatedAt: null,
  data: {
    upcoming: [],
    past: [],
    sportsCulture: [],
    educationTech: [],
    events: [],
  },
};

let refreshTimer = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sortByDate(arr, asc = true) {
  return [...arr].sort((a, b) => {
    const left = new Date(a.date).getTime();
    const right = new Date(b.date).getTime();
    return asc ? left - right : right - left;
  });
}

function toDateKey(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split("T")[0];
}

function buildSections(events) {
  const todayKey = new Date().toISOString().split("T")[0];

  const valid = events.filter((event) => toDateKey(event?.date));

  const upcoming = sortByDate(
    valid.filter((event) => {
      const dateKey = toDateKey(event.date);
      return dateKey && dateKey >= todayKey;
    })
  );

  const past = sortByDate(
    valid.filter((event) => {
      const dateKey = toDateKey(event.date);
      return dateKey && dateKey < todayKey;
    }),
    false
  );

  const sportsCulture = sortByDate(
    events.filter((event) => ["sports", "culture"].includes(String(event.category || "").toLowerCase()))
  );

  const educationTech = sortByDate(
    events.filter((event) =>
      ["tech", "education", "seminar", "workshop"].includes(String(event.category || "").toLowerCase())
    )
  );

  return {
    upcoming,
    past,
    sportsCulture,
    educationTech,
    events: sortByDate(events),
  };
}

async function refreshHomeSections(prisma, limit = DEFAULT_LIMIT) {
  const safeLimit = clamp(Number(limit) || DEFAULT_LIMIT, 20, DEFAULT_LIMIT);

  const events = await prisma.eventRequest.findMany({
    where: { status: "APPROVED" },
    select: EVENT_HOME_SELECT,
    orderBy: { date: "asc" },
    take: safeLimit,
  });

  cache.data = buildSections(events);
  cache.updatedAt = new Date().toISOString();
  return cache.data;
}

function getHomeSectionsSnapshot() {
  return {
    ...cache.data,
    updatedAt: cache.updatedAt,
  };
}

async function startHomeSectionsScheduler(prisma) {
  const configuredMs = Number(process.env.HOME_SECTION_REFRESH_MS) || MIN_REFRESH_MS;
  const intervalMs = clamp(configuredMs, MIN_REFRESH_MS, MAX_REFRESH_MS);
  const limit = Number(process.env.HOME_SECTION_LIMIT) || DEFAULT_LIMIT;

  await refreshHomeSections(prisma, limit);

  if (refreshTimer) clearInterval(refreshTimer);

  refreshTimer = setInterval(() => {
    refreshHomeSections(prisma, limit).catch((err) => {
      console.error("[HOME_SECTION_REFRESH_ERROR]", err?.message || err);
    });
  }, intervalMs);
}

module.exports = {
  refreshHomeSections,
  getHomeSectionsSnapshot,
  startHomeSectionsScheduler,
};