-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "ladder" TEXT NOT NULL DEFAULT 'Novice',
ADD COLUMN     "onlineStatus" TEXT NOT NULL DEFAULT 'Offline';
