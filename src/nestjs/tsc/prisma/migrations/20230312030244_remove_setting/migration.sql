/*
  Warnings:

  - You are about to drop the column `banned_until` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `isBanned` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `isKicked` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `isMuted` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `muted_until` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "banned_until",
DROP COLUMN "isBanned",
DROP COLUMN "isKicked",
DROP COLUMN "isMuted",
DROP COLUMN "muted_until";

-- CreateTable
CREATE TABLE "_Kicked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Muted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Kicked_AB_unique" ON "_Kicked"("A", "B");

-- CreateIndex
CREATE INDEX "_Kicked_B_index" ON "_Kicked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Muted_AB_unique" ON "_Muted"("A", "B");

-- CreateIndex
CREATE INDEX "_Muted_B_index" ON "_Muted"("B");

-- AddForeignKey
ALTER TABLE "_Kicked" ADD CONSTRAINT "_Kicked_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Kicked" ADD CONSTRAINT "_Kicked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Muted" ADD CONSTRAINT "_Muted_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Muted" ADD CONSTRAINT "_Muted_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
