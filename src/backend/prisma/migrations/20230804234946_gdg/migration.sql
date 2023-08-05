/*
  Warnings:

  - Changed the type of `requestSentToID` on the `Friends` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "requestSentToID",
ADD COLUMN     "requestSentToID" INTEGER NOT NULL;
