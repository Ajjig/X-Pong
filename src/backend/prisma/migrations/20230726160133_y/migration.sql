/*
  Warnings:

  - You are about to drop the column `fromfullname` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `tofullname` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "fromfullname",
DROP COLUMN "tofullname";
