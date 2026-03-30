const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");
const { getRequestContext } = require("../utils/requestContext");
require("dotenv").config();

const SLOW_QUERY_THRESHOLD_MS = Math.max(Number(process.env.SLOW_QUERY_THRESHOLD_MS) || 250, 100);

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const shouldUseAccelerate =
	Boolean(process.env.DATABASE_URL) &&
	process.env.DATABASE_URL.startsWith("prisma+postgres://") &&
	!process.env.DIRECT_URL;

const prismaClient = databaseUrl
	? new PrismaClient({
		datasources: { db: { url: databaseUrl } },
		log: [{ emit: "event", level: "query" }],
	  })
	: new PrismaClient({ log: [{ emit: "event", level: "query" }] });

prismaClient.$on("query", (event) => {
	if (event.duration < SLOW_QUERY_THRESHOLD_MS) return;

	const context = getRequestContext();

	console.warn(
		"[SLOW_QUERY]",
		JSON.stringify({
			durationMs: event.duration,
			thresholdMs: SLOW_QUERY_THRESHOLD_MS,
			endpoint: context.endpoint || "unknown",
			requestParams: context.params || {},
			query: event.query,
			queryParams: event.params,
			timestamp: new Date().toISOString(),
		})
	);
});

const prisma = shouldUseAccelerate
	? prismaClient.$extends(withAccelerate())
	: prismaClient;

module.exports = { prisma };
