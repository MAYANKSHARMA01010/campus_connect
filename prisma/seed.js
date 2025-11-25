const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
            password: 'changeme'
        },
    });

    const all = [
        ...techEvents.map(e => ({ ...e, category: 'tech' })),
        ...pastEvents.map(e => ({ ...e, category: 'past' })),
        ...comingEvents.map(e => ({ ...e, category: 'coming' })),
        ...sportsEvents.map(e => ({ ...e, category: 'sports' })),
    ];

    for (const e of all) {
        const exists = await prisma.eventRequest.findFirst({
            where: { title: e.title }
        });
        if (exists) {
            console.log(`Skipping (exists): ${e.title}`);
            continue;
        }

        const date = e.date ? new Date(e.date) : null;

        await prisma.eventRequest.create({
            data: {
                title: e.title,
                description: e.summary || '',
                category: e.category,
                date: date,
                createdBy: { connect: { id: admin.id } },
                images: {
                    create: (e.images || []).map(url => ({ url }))
                }
            }
        });

        console.log('Created:', e.title);
    }
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
