import "dotenv/config";
import { getPrismaClient, disconnectDatabase } from "../config/database.js";

const admin = {
  fullName: process.env.ADMIN_FULL_NAME || "System Administrator",
  username: process.env.ADMIN_USERNAME || "admin",
  email: process.env.ADMIN_EMAIL || "admin@example.com",
  password: process.env.ADMIN_PASSWORD || "Admin@12345",
};

async function main() {
  const prisma = getPrismaClient();

  console.log("🌱 Seeding database...");

  // Create or retrieve Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: admin.email },
    update: {
      fullName: admin.fullName,
      username: admin.username,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      fullName: admin.fullName,
      username: admin.username,
      email: admin.email,
      password: admin.password,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Admin user ready:", {
    id: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
  });

  console.log("🎉 Successfully seeded database!");
  await disconnectDatabase();
}

main().catch(async (error) => {
  console.error("❌ Seed failed:", error);
  await disconnectDatabase();
  process.exit(1);
});
