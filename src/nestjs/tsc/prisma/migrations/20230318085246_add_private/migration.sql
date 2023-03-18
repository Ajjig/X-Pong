/*
  Warnings:

  - A unique constraint covering the columns `[privateChannelId]` on the table `DirectMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DirectMessage" ADD COLUMN     "privateChannelId" TEXT NOT NULL DEFAULT 'undefined';

-- CreateIndex
CREATE UNIQUE INDEX "DirectMessage_privateChannelId_key" ON "DirectMessage"("privateChannelId");
