import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("Admin2026!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "product.manager@sekolahmu.co.id" },
    update: {},
    create: {
      name: "Ihsan Nugraha",
      email: "product.manager@sekolahmu.co.id",
      password,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Admin created:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
