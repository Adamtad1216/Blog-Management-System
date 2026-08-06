import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDatabase = async () => {
  await prisma.$connect();
  console.log('Database connected successfully');
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

export default prisma;
