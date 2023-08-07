/*
  Warnings:

  - Added the required column `friendId` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "friendId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
