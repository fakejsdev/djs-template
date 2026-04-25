import { PrismaLibSql } from "@prisma/adapter-libsql";
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
					return result;
				},
				async update({ model, args, query }) {
					const result = await query(args);
					return result;
				},
				async delete({ model, args, query }) {
					const result = await query(args);
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
