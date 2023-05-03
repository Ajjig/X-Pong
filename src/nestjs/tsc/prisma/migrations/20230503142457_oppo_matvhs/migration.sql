/*
  Warnings:

  - Added the required column `opponentUserId` to the `Matchs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Matchs" ADD COLUMN     "opponentUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Matchs" ADD CONSTRAINT "Matchs_opponentUserId_fkey" FOREIGN KEY ("opponentUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
