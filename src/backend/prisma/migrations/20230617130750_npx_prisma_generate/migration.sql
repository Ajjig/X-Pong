/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "isPublic",
ADD COLUMN     "type" TEXT;
