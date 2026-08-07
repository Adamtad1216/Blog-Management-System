import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma = null;

export const getPrismaClient = () => {
  if (!prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    prisma = new PrismaClient({ adapter });
  }

  return prisma;
};

export const connectDatabase = async () => {
  const client = getPrismaClient();
  await client.$connect();
  console.log('Database connected successfully');
};

export const disconnectDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

export default getPrismaClient();
