import "dotenv/config";

import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/password.js";

const admin = {
  fullName: process.env.ADMIN_FULL_NAME || "System Administrator",
  username: process.env.ADMIN_USERNAME || "admin",
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};
async function main() {
  const hashedPassword = await hashPassword(admin.password);

  const existingAdmin =
    (await prisma.user.findUnique({
      where: {
        email: admin.email,
      },
    })) ||
    (await prisma.user.findUnique({
      where: {
        username: admin.username,
      },
    }));

  const adminUser = existingAdmin
    ? await prisma.user.update({
        where: {
          id: existingAdmin.id,
        },
        data: {
          fullName: admin.fullName,
          username: admin.username,
          email: admin.email,
          password: hashedPassword,
          role: "ADMIN",
          isActive: true,
        },
      })
    : await prisma.user.create({
        data: {
          fullName: admin.fullName,
          username: admin.username,
          email: admin.email,
          password: hashedPassword,
          role: "ADMIN",
          isActive: true,
        },
      });

  console.log("Admin user is ready:", {
    id: adminUser.id,
    email: adminUser.email,
    username: adminUser.username,
    role: adminUser.role,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Admin seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
