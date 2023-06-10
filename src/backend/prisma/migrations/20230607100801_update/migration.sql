/*
  Warnings:

  - You are about to drop the column `blockedUsernames` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "blockedUsernames",
ADD COLUMN     "blockedIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
