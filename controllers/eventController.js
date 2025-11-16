const { prisma } = require("../config/database");


const createEventRequestController = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            date,
            time,
            location,
            images,
            hostName,
            contact
        } = req.body;

        if (!images || !Array.isArray(images) || images.length < 1) {
            return res.status(400).json({ ERROR: "At least one image is required" });
        }

        const eventRequest = await prisma.eventRequest.create({
            data: {
                title,
                description,
                category,
                date: new Date(date),
                time,
                location,
                images,
                hostName,
                contact,
                createdBy: req.user.id,
            },
        });

        res.status(201).json({
            message: "Event request submitted",
            eventRequest
        });
    }
    catch (error) {
        console.error("CREATE REQUEST ERROR:", error);
        res.status(500).json({ ERROR: "Internal server error" });
    }
};


const getEventRequestsController = async (req, res) => {
    try {
        const requests = await prisma.eventRequest.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: true },
        });

        res.json(requests);
    }
    catch (error) {
        console.error("GET REQUESTS ERROR:", error);
        res.status(500).json({ ERROR: "Error fetching event requests" });
    }
};


const approveEventController = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await prisma.eventRequest.findUnique({
            where: { id: Number(id) }
        });

        if (!request)
            return res.status(404).json({ ERROR: "Request not found" });

        const event = await prisma.event.create({
            data: {
                title: request.title,
                description: request.description,
                category: request.category,
                date: request.date,
                time: request.time,
                location: request.location,
                images: request.images,
                hostName: request.hostName,
                contact: request.contact,
            },
        });

        await prisma.eventRequest.delete({
            where: { id: Number(id) }
        });

        res.json({ message: "Event approved", event });
    }
    catch (error) {
        console.error("APPROVE ERROR:", error);
        res.status(500).json({ ERROR: "Error approving event" });
    }
};


const getAllEventsController = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { createdAt: "desc" },
        });

        res.json(events);
    }
    catch (error) {
        console.error("GET EVENTS ERROR:", error);
        res.status(500).json({ ERROR: "Error fetching events" });
    }
};


module.exports = {
  createEventRequestController,
  getEventRequestsController,
  approveEventController,
  getAllEventsController,
};
