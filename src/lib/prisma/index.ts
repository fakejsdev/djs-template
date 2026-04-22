import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/client";

const adapter = new PrismaLibSql({
	url: process.env.DATABASE_URL!,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
