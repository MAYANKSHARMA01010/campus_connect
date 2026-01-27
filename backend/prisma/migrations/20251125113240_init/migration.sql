-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropEnum
DROP TYPE "public"."EventStatus";

-- CreateTable
CREATE TABLE "EventRequest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "time" TEXT,
    "location" TEXT,
    "hostName" TEXT,
    "contact" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT,
    "eventRequestId" INTEGER NOT NULL,

    CONSTRAINT "EventImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventRequest" ADD CONSTRAINT "EventRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventImage" ADD CONSTRAINT "EventImage_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
