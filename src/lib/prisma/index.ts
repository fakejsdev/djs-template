import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { dbEmitter } from '@/lib/helpers/databaseEmitter';
import { PrismaClient } from './generated/client';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  const basePrisma = new PrismaClient({ adapter });

  return basePrisma.$extends({
    query: {
      $allModels: {
        async create({ model, args, query }) {
          const result = await query(args);
          dbEmitter.emit(`${model}.Create`, result);
          return result;
        },
        async update({ model, args, query }) {
          const result = await query(args);
          dbEmitter.emit(`${model}.Update`, result);
          return result;
        },
        async delete({ model, args, query }) {
          const result = await query(args);
          dbEmitter.emit(`${model}.Delete`, result);
          return result;
        },
      },
    },
  });
};

type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientExtended | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
