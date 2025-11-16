/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `EventRequest` table. All the data in the column will be lost.
  - Added the required column `images` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `EventRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "imageUrl",
ADD COLUMN     "images" JSON NOT NULL;

-- AlterTable
ALTER TABLE "EventRequest" DROP COLUMN "imageUrl",
ADD COLUMN     "images" JSON NOT NULL;
