/*
  Warnings:

  - You are about to drop the column `ladder` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `onlineStatus` on the `Friends` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "ladder",
DROP COLUMN "onlineStatus";
