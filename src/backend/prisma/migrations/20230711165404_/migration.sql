/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `Friends` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Friends" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friends_username_key" ON "Friends"("username");
