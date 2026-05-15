-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "prdify";

-- CreateEnum
CREATE TYPE "prdify"."PRDStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'GENERATED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "prdify"."PRDStep" AS ENUM ('BRIEF_COACH', 'CONTEXT_SCAN', 'DRAFT_PRD', 'PUBLISH');

-- CreateTable
CREATE TABLE "prdify"."PRD" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled PRD',
    "status" "prdify"."PRDStatus" NOT NULL DEFAULT 'DRAFT',
    "quality" INTEGER,
    "problem" TEXT,
    "targetUser" TEXT,
    "whyNow" TEXT,
    "desiredOutcome" TEXT,
    "evidence" TEXT,
    "inScope" TEXT[],
    "outOfScope" TEXT[],
    "dependencies" TEXT,
    "risks" TEXT,
    "gdriveUrl" TEXT,
    "gdriveFileId" TEXT,
    "gdriveTitle" TEXT,
    "uploadedFile" TEXT,
    "currentStep" "prdify"."PRDStep" NOT NULL DEFAULT 'BRIEF_COACH',
    "generatedPRD" TEXT,
    "author" TEXT NOT NULL DEFAULT 'Ihsan Nugraha',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PRD_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prdify"."Message" (
    "id" TEXT NOT NULL,
    "prdId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prdify"."Message" ADD CONSTRAINT "Message_prdId_fkey" FOREIGN KEY ("prdId") REFERENCES "prdify"."PRD"("id") ON DELETE CASCADE ON UPDATE CASCADE;
