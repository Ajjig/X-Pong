/*
  Warnings:

  - Added the required column `ReceiverUsername` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SenderUsername` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DirectMessage" ADD COLUMN     "ReceiverUsername" TEXT NOT NULL,
ADD COLUMN     "SenderUsername" TEXT NOT NULL;
