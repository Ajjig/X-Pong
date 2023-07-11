/*
  Warnings:

  - You are about to drop the column `friendId` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `friendUsername` on the `Friends` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_friendId_fkey";

-- DropIndex
DROP INDEX "Friends_userId_friendId_key";

-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "friendId",
DROP COLUMN "friendUsername",
ALTER COLUMN "username" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friends_username_key" ON "Friends"("username");
