const { prisma } = require("../config/database");
const { techEvents, pastEvents, comingEvents, sportsEvents } = require('./eventsData'); 

async function main() {
  const adminEmail = 'seed-admin@example.com';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Seed Admin',
      username: 'seedadmin',
      email: adminEmail,
      password: 'changeme',
    },
  });

  const allEvents = [
    ...techEvents,
    ...pastEvents,
    ...comingEvents,
    ...sportsEvents,
  ];

  for (const e of allEvents) {
    const exists = await prisma.eventRequest.findFirst({
      where: { title: e.title },
    });

    if (exists) {
      console.log(`Skipping (exists): ${e.title}`);
      continue;
    }

    const createData = {
      title: e.title,
      description: e.description || '',
      category: e.category || 'Other',
      date: e.date ? new Date(e.date) : new Date(),
      time: e.time || '00:00',
      location: e.location || 'TBD',
      hostName: e.hostName || 'TBD',
      contact: e.contact || 'TBD',
      createdBy: { connect: { id: admin.id } },
      images: {
        create: (e.images || []).map(url => ({ url })),
      },
    };

    if (e.subCategory) createData.subCategory = e.subCategory;
    if (e.status) createData.status = e.status;

    await prisma.eventRequest.create({ data: createData });
    console.log('Created:', e.title);
  }
}

main()
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
