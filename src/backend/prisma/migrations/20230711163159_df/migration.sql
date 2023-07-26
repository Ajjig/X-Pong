/*
  Warnings:

  - Added the required column `friendUsername` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "friendUsername" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
