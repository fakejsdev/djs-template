import { PrismaLibSql } from "@prisma/adapter-libsql";
import { dbEmitter } from "@/lib/helpers/databaseEmitter";
import { PrismaClient } from "./generated/client";

const adapter = new PrismaLibSql({
	url: process.env.DATABASE_URL!,
});

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

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
