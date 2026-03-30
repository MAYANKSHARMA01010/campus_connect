-- Switch EventImage -> EventRequest relation to ON DELETE CASCADE.
ALTER TABLE "EventImage" DROP CONSTRAINT IF EXISTS "EventImage_eventRequestId_fkey";

ALTER TABLE "EventImage"
ADD CONSTRAINT "EventImage_eventRequestId_fkey"
FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
