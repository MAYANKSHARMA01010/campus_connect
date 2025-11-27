/*
  Warnings:

  - Made the column `date` on table `EventRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `time` on table `EventRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `EventRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hostName` on table `EventRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact` on table `EventRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdById` on table `EventRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EventRequest" DROP CONSTRAINT "EventRequest_createdById_fkey";

-- AlterTable
ALTER TABLE "EventRequest" ADD COLUMN     "subCategory" TEXT,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "time" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "hostName" SET NOT NULL,
ALTER COLUMN "contact" SET NOT NULL,
ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EventRequest" ADD CONSTRAINT "EventRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
