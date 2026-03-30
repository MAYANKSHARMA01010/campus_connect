const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");
require("dotenv").config();

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const shouldUseAccelerate =
	Boolean(process.env.DATABASE_URL) &&
	process.env.DATABASE_URL.startsWith("prisma+postgres://") &&
	!process.env.DIRECT_URL;

const prismaClient = databaseUrl
	? new PrismaClient({ datasources: { db: { url: databaseUrl } } })
	: new PrismaClient();

const prisma = shouldUseAccelerate
	? prismaClient.$extends(withAccelerate())
	: prismaClient;

module.exports = { prisma };
