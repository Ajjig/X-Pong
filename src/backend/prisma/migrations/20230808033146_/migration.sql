/*
  Warnings:

  - Added the required column `opponenId` to the `Matchs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Matchs" ADD COLUMN     "opponenId" INTEGER NOT NULL;
