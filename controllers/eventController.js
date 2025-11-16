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
            imageUrl,
            hostName,
            contact
        } = req.body;

        const eventRequest = await prisma.eventRequest.create({
            data: {
                title,
                description,
                category,
                date: new Date(date),
                time,
                location,
                imageUrl,
                hostName,
                contact,
                createdBy: req.user.id,
            },
        });

        res.status(201).json({ message: "Event request submitted", eventRequest });
    } 
    catch (error) {
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
        res.status(500).json({ ERROR: "Error fetching event requests" });
    }
};


const approveEventController = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await prisma.eventRequest.findUnique({ where: { id: Number(id) } });
        if (!request) return res.status(404).json({ ERROR: "Request not found" });

        const event = await prisma.event.create({
            data: {
                title: request.title,
                description: request.description,
                category: request.category,
                date: request.date,
                time: request.time,
                location: request.location,
                imageUrl: request.imageUrl,
                hostName: request.hostName,
                contact: request.contact,
            },
        });

        await prisma.eventRequest.delete({ where: { id: Number(id) } });

        res.json({ message: "Event approved", event });
    } 
    catch (error) {
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
        res.status(500).json({ ERROR: "Error fetching events" });
    }
};

module.exports = {
  createEventRequestController,
  getEventRequestsController,
  approveEventController,
  getAllEventsController,
};
