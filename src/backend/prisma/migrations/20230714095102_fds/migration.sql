/*
  Warnings:

  - Added the required column `requestSentBy` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestSentTo` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "requestSentBy" TEXT NOT NULL,
ADD COLUMN     "requestSentTo" TEXT NOT NULL;
