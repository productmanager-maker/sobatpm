import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "product.manager@sekolahmu.co.id" } });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    return;
  }
  const hash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Ihsan Nugraha",
      email: "product.manager@sekolahmu.co.id",
      password: hash,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email, "/ password: admin123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
