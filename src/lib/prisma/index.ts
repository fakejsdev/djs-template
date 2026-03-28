import { PrismaClient as StdClient } from "./generated/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
});

export const PrismaClient = new StdClient({ adapter });
type GlobalPrisma = {
  prisma: StdClient | undefined;
};

const globalForPrisma = globalThis as unknown as GlobalPrisma;

export const prisma = globalForPrisma.prisma ?? PrismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
