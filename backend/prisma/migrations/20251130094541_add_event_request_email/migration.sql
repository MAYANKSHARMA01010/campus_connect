/*
  Warnings:

  - Added the required column `email` to the `EventRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventRequest"
ADD COLUMN "email" TEXT NOT NULL DEFAULT 'dummy@gmail.com';
