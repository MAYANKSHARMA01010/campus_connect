const { prisma } = require("../config/database");

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
    }
    catch (err) {
        console.error("createEventController ERROR:", err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
    }
}

async function getAllEventsController(req, res) {
    try {
        const { page = 1, limit = 8, category, sort } = req.query;

        const where = {
            status: "APPROVED",
        };

        if (category && category !== "all") {
            where.category = category;
        }

        let orderBy = { id: "desc" };
        if (sort === "recent") orderBy = { id: "desc" };
        if (sort === "location") orderBy = { location: "asc" };
        if (sort === "date") orderBy = { date: "asc" };

        const events = await prisma.eventRequest.findMany({
            where,
            skip: (page - 1) * Number(limit),
            take: Number(limit),
            orderBy,
            include: {
                images: true,
            },
        });

        const categories = await prisma.eventRequest.findMany({
            where: { status: "APPROVED" },
            select: { category: true },
            distinct: ["category"],
        });

        const total = await prisma.eventRequest.count({ where });

        return res.json({
            events,
            categories: categories.map((c) => c.category),
            total,
        });
    } catch (error) {
        console.error("🔥 getAllEventsController ERROR:", error);
        return res.status(500).json({ error: "Backend error", reason: error.message });
    }
}

async function getAllEventsForHomeSecreenController(req, res) {
    try {
        const events = await prisma.eventRequest.findMany({
            where: {
                status: "APPROVED"
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                category: true,
                email: true,
                images: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
            orderBy: {
                id: "asc"
            }
        });

        return res.status(200).json({ events });
    }
    catch (err) {
        console.error("getAllEventsForHomeSecreenController ERROR:", err);
        return res.status(500).json({ ERROR: "Failed to fetch events" });
    }
}

async function getEventByIdController(req, res) {
    try {
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
                }
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
        const {
            q = "",
            category,
            status = "APPROVED",
            page = 1,
            limit = 10,
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

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
                take: Number(limit),
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    images: true,
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
            page: Number(page),
            limit: Number(limit),
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

module.exports = {
    createEventController,
    getAllEventsController,
    getAllEventsForHomeSecreenController,
    getEventByIdController,
    searchEventsController,
};
