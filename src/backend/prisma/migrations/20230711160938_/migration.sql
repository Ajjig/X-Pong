/*
  Warnings:

  - You are about to drop the column `friendUsername` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Friends` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,friendId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `friendId` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Friends_friendUsername_key";

-- DropIndex
DROP INDEX "Friends_username_key";

-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "friendUsername",
DROP COLUMN "username",
ADD COLUMN     "friendId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friends_userId_friendId_key" ON "Friends"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
