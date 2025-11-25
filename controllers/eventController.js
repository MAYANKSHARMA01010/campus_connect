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
            imageUrls,
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ ERROR: "Required fields missing" });
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
        const events = await prisma.eventRequest.findMany({
            include: {
                images: true,
                createdBy: { select: { id: true, name: true, username: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ events });
    } 
    catch (err) {
        console.error("getAllEventsController ERROR:", err);
        return res.status(500).json({ ERROR: "Failed to fetch events" });
    }
}


async function getEventByIdController(req, res) {
    try {
        const id = Number(req.params.id);

        const event = await prisma.eventRequest.findUnique({
            where: { id },
            include: {
                images: true,
                createdBy: { select: { id: true, name: true, username: true } },
            },
        });

        if (!event) return res.status(404).json({ ERROR: "Event not found" });

        return res.status(200).json({ event });
    } 
    catch (err) {
        console.error("getEventByIdController ERROR:", err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
    }
}

module.exports = {
    createEventController,
    getAllEventsController,
    getEventByIdController,
};
