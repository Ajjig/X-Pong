/*
  Warnings:

  - You are about to drop the column `comfirmed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "comfirmed",
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;
