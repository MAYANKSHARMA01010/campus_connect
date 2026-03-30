const { prisma } = require("../config/database");
const { getHomeSectionsSnapshot, refreshHomeSections } = require("../services/homeSectionsCache");

const EVENT_IMAGE_PREVIEW_SELECT = {
    take: 1,
    orderBy: { id: "asc" },
    select: {
        id: true,
        url: true,
    },
};

const EVENT_LIST_SELECT = {
    id: true,
    title: true,
    description: true,
    category: true,
    subCategory: true,
    date: true,
    time: true,
    location: true,
    hostName: true,
    status: true,
    createdAt: true,
    images: EVENT_IMAGE_PREVIEW_SELECT,
};

function toPositiveNumber(value, fallback) {
    const num = Number(value);
    if (Number.isNaN(num) || num <= 0) return fallback;
    return Math.floor(num);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function setPublicCache(res, maxAgeSeconds = 30) {
    res.set("Cache-Control", `public, max-age=${maxAgeSeconds}, stale-while-revalidate=60`);
}

async function createEventController(req, res) {
    try {
        const {
            title,
            description,
            category,
            date,
            time,
            location,
            hostName,
            contact,
            email,
            imageUrls,
        } = req.body;

        if (!title || !description || !category || !email) {
            return res.status(400).json({ ERROR: "Required fields missing" });
        }

        if (!email.includes("@")) {
            return res.status(400).json({ ERROR: "Invalid email" });
        }

        if (!Array.isArray(imageUrls) || imageUrls.length < 4) {
            return res.status(400).json({ ERROR: "At least 4 images are required" });
        }

        const createdEvent = await prisma.eventRequest.create({
            data: {
                title,
                description,
                category,
                date: date ? new Date(date) : null,
                time,
                location,
                hostName,
                contact,
                email,
                createdById: req.user.id,
                images: {
                    create: imageUrls.map((url) => ({ url })),
                },
            },
            include: {
                images: true,
            },
        });

        return res.status(201).json({
            message: "Event request submitted successfully",
            event: createdEvent,
        });
    } catch (err) {
        console.error("createEventController ERROR:", err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
    }
}

async function getAllEventsController(req, res) {
    try {
        setPublicCache(res, 20);

        const { category, sort, past = "false" } = req.query;
        const page = toPositiveNumber(req.query.page, 1);
        const limit = clamp(toPositiveNumber(req.query.limit, 8), 1, 20);

        const now = new Date();
        const showPast = past === "true";

        const where = {
            status: "APPROVED",

            ...(!showPast && {
                date: {
                    gte: now,
                },
            }),
        };

        if (category && category !== "all") {
            where.category = category;
        }

        let orderBy = { createdAt: "desc" };
        if (sort === "recent") orderBy = { createdAt: "desc" };
        if (sort === "location") orderBy = { location: "asc" };
        if (sort === "date") orderBy = { date: "asc" };

        const [events, categories, total] = await Promise.all([
            prisma.eventRequest.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy,
                select: EVENT_LIST_SELECT,
            }),
            prisma.eventRequest.findMany({
                where: { status: "APPROVED" },
                select: { category: true },
                distinct: ["category"],
            }),
            prisma.eventRequest.count({ where }),
        ]);

        return res.json({
            events,
            categories: categories.map((c) => c.category),
            total,
            page,
            limit,
        });
    } catch (error) {
        console.error("🔥 getAllEventsController ERROR:", error);
        return res
            .status(500)
            .json({ error: "Backend error", reason: error.message });
    }
}

async function getAllEventsForHomeSecreenController(req, res) {
    try {
        setPublicCache(res, 45);
        const limit = clamp(toPositiveNumber(req.query.limit, 60), 1, 120);
        let cached = getHomeSectionsSnapshot();

        if (!cached.updatedAt) {
            await refreshHomeSections(prisma, limit);
            cached = getHomeSectionsSnapshot();
        }

        return res.status(200).json({
            events: cached.events.slice(0, limit),
            sections: {
                upcoming: cached.upcoming.slice(0, limit),
                past: cached.past.slice(0, limit),
                sportsCulture: cached.sportsCulture.slice(0, limit),
                educationTech: cached.educationTech.slice(0, limit),
            },
            generatedAt: cached.updatedAt,
        });
    } catch (err) {
        console.error("getAllEventsForHomeSecreenController ERROR:", err);
        return res.status(500).json({ ERROR: "Failed to fetch events" });
    }
}

async function getEventByIdController(req, res) {
    try {
        setPublicCache(res, 30);

        const idParam = req.params.id;
        const id = parseInt(idParam, 10);

        if (Number.isNaN(id) || id <= 0) {
            return res.status(400).json({ ERROR: "Invalid event id" });
        }

        const event = await prisma.eventRequest.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { id: "asc" },
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
            },
        });

        if (!event) return res.status(404).json({ ERROR: "Event not found" });

        return res.status(200).json({ event });
    } catch (err) {
        console.error("getEventByIdController ERROR:", err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
    }
}

const searchEventsController = async (req, res) => {
    try {
        setPublicCache(res, 15);

        const {
            q = "",
            category,
            status = "APPROVED",
        } = req.query;

        const page = toPositiveNumber(req.query.page, 1);
        const limit = clamp(toPositiveNumber(req.query.limit, 10), 1, 20);

        const skip = (page - 1) * limit;

        const whereCondition = {
            AND: [
                status ? { status } : {},
                category ? { category } : {},
                q
                    ? {
                        OR: [
                            { title: { contains: q, mode: "insensitive" } },
                            { description: { contains: q, mode: "insensitive" } },
                            { hostName: { contains: q, mode: "insensitive" } },
                            { location: { contains: q, mode: "insensitive" } },
                            { category: { contains: q, mode: "insensitive" } },
                            { subCategory: { contains: q, mode: "insensitive" } },
                        ],
                    }
                    : {},
            ],
        };

        const [events, total] = await Promise.all([
            prisma.eventRequest.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    ...EVENT_LIST_SELECT,
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        },
                    },
                },
            }),
            prisma.eventRequest.count({ where: whereCondition }),
        ]);

        return res.status(200).json({
            success: true,
            page,
            limit,
            total,
            results: events,
        });
    } catch (error) {
        console.error("SEARCH EVENTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to search events",
        });
    }
};

async function getAdminEventsController(req, res) {
    try {
        const {
            search = "",
            status,
            sortBy = "recent",
        } = req.query;

        const page = toPositiveNumber(req.query.pageNumber, 1);
        const limit = clamp(toPositiveNumber(req.query.pageSize, 10), 1, 30);
        const skip = (page - 1) * limit;

        const where = {};

        const searchText = String(search).trim();
        if (searchText) {
            where.title = {
                contains: searchText,
                mode: "insensitive",
            };
        }

        if (status) where.status = status;

        let orderBy = { createdAt: "desc" };
        if (sortBy === "oldest") orderBy = { createdAt: "asc" };
        if (sortBy === "az") orderBy = { title: "asc" };
        if (sortBy === "upcoming") orderBy = { date: "asc" };
        if (sortBy === "past") orderBy = { date: "desc" };

        const [events, total] = await Promise.all([
            prisma.eventRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                select: EVENT_LIST_SELECT,
            }),

            prisma.eventRequest.count({ where }),
        ]);

        return res.json({
            events,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error("ADMIN FETCH ERROR:", err);
        return res.status(500).json({ error: "Admin fetch failed" });
    }
}

async function updateEventStatusController(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedEvent = await prisma.eventRequest.update({
            where: { id: Number(id) },
            data: { status },
        });

        return res.json({
            success: true,
            message: "Event status updated",
            event: updatedEvent,
        });
    } catch (err) {
        console.error("UPDATE STATUS ERROR:", err);
        return res.status(500).json({ error: "Failed to update event status" });
    }
}

async function deleteEventController(req, res) {
    try {
        const { id } = req.params;

        await prisma.eventRequest.delete({
            where: { id: Number(id) },
        });

        return res.json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (err) {
        console.error("DELETE EVENT ERROR:", err);
        return res.status(500).json({ error: "Failed to delete event" });
    }
}

async function getMyEventsController(req, res) {
    try {
        const userId = req.user.id;

        const events = await prisma.eventRequest.findMany({
            where: {
                createdById: userId,
            },
            select: EVENT_LIST_SELECT,
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({
            success: true,
            total: events.length,
            data: events,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user events",
        });
    }
}

async function deleteMyEventController(req, res) {
    try {
        const userId = req.user.id;
        const eventId = Number(req.params.id);

        if (!eventId || Number.isNaN(eventId)) {
            return res.status(400).json({
                ERROR: "Invalid event id",
            });
        }

        const event = await prisma.eventRequest.findFirst({
            where: {
                id: eventId,
                createdById: userId,
            },
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or unauthorized",
            });
        }

        await prisma.eventImage.deleteMany({
            where: { eventRequestId: eventId },
        });

        await prisma.eventRequest.delete({
            where: { id: eventId },
        });

        return res.json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (err) {
        console.error("DELETE MY EVENT ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Unable to delete event",
        });
    }
}

module.exports = {
    createEventController,
    getAllEventsController,
    getAllEventsForHomeSecreenController,
    getEventByIdController,
    searchEventsController,
    getAdminEventsController,
    updateEventStatusController,
    deleteEventController,
    getMyEventsController,
    deleteMyEventController,
};
