/*
  Warnings:

  - You are about to drop the column `levelId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,mapId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mapId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `steps` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Level" DROP CONSTRAINT "Level_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_levelId_fkey";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "levelId",
DROP COLUMN "value",
ADD COLUMN     "mapId" INTEGER NOT NULL,
ADD COLUMN     "steps" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Level";

-- CreateTable
CREATE TABLE "Map" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "layout" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_userId_mapId_key" ON "Score"("userId", "mapId");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
