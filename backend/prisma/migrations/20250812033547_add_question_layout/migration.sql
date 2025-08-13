-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "layoutType" TEXT NOT NULL DEFAULT 'STACKED',
ADD COLUMN     "stimulusText" TEXT;
