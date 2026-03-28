import { EventEmitter } from "events";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient as StdClient } from "./generated/client";

const dbEvents = new EventEmitter();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
});

export const PrismaClient = new StdClient({ adapter });
type GlobalPrisma = {
  prisma: StdClient | undefined;
};

const globalForPrisma = globalThis as unknown as GlobalPrisma;

const prismaBase = globalForPrisma.prisma ?? PrismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaBase;
}

export const prisma = prismaBase.$extends({
  query: {
    $allModels: {
      async create({ model, args, query }) {
        const result = await query(args);
        dbEvents.emit(`${model}:create`, result);
        return result;
      },
      async update({ model, args, query }) {
        const result = await query(args);
        dbEvents.emit(`${model}:update`, result);
        return result;
      },
      async delete({ model, args, query }) {
        const result = await query(args);
        dbEvents.emit(`${model}:delete`, result);
        return result;
      },
    },
  },
});

export default prisma;
