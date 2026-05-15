-- CreateEnum
CREATE TYPE "prdify"."UserRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "prdify"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "prdify"."UserRole" NOT NULL DEFAULT 'MEMBER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "prdify"."User"("email");

-- AlterTable PRD: add missing columns
ALTER TABLE "prdify"."PRD"
    ADD COLUMN IF NOT EXISTS "briefContext" TEXT,
    ADD COLUMN IF NOT EXISTS "briefExtracted" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "authorId" TEXT;

-- CreateTable
CREATE TABLE "prdify"."PRDSection" (
    "id" TEXT NOT NULL,
    "prdId" TEXT NOT NULL,
    "sectionType" TEXT NOT NULL,
    "content" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PRDSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PRDSection_prdId_sectionType_key" ON "prdify"."PRDSection"("prdId", "sectionType");

-- AddForeignKey
ALTER TABLE "prdify"."PRD" ADD CONSTRAINT "PRD_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "prdify"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prdify"."PRDSection" ADD CONSTRAINT "PRDSection_prdId_fkey" FOREIGN KEY ("prdId") REFERENCES "prdify"."PRD"("id") ON DELETE CASCADE ON UPDATE CASCADE;
