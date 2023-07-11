/*
  Warnings:

  - You are about to drop the column `ladder` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `onlineStatus` on the `Friends` table. All the data in the column will be lost.
  - Made the column `username` on table `Friends` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Friends_username_key";

-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "ladder",
DROP COLUMN "onlineStatus",
ALTER COLUMN "username" SET NOT NULL;
