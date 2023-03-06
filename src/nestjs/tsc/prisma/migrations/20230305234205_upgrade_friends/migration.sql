-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "friendshipStatus" TEXT NOT NULL DEFAULT 'Pending',
ADD COLUMN     "onlineStatus" TEXT NOT NULL DEFAULT 'Offline';
