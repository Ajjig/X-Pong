/*
  Warnings:

  - Added the required column `fromfullname` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tofullname` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "fromfullname" TEXT NOT NULL,
ADD COLUMN     "tofullname" TEXT NOT NULL;
