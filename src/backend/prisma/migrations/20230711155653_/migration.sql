/*
  Warnings:

  - A unique constraint covering the columns `[friendUsername]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "friendUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Friends_friendUsername_key" ON "Friends"("friendUsername");
