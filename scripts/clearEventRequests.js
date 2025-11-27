const { prisma } = require("../config/database");

async function clearEventRequests() {
  try {
    await prisma.eventImage.deleteMany({});
    await prisma.eventRequest.deleteMany({});

    console.log("All EventRequest + EventImage data deleted");
  } catch (err) {
    console.error("Error clearing data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

clearEventRequests();
