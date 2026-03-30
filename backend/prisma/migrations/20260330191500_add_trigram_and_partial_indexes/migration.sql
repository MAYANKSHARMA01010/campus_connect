-- Enable trigram indexing support for contains/ILIKE-heavy search.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram indexes for text search fields used by /events/search.
CREATE INDEX "EventRequest_title_trgm_idx"
ON "EventRequest" USING GIN ("title" gin_trgm_ops);

CREATE INDEX "EventRequest_description_trgm_idx"
ON "EventRequest" USING GIN ("description" gin_trgm_ops);

CREATE INDEX "EventRequest_location_trgm_idx"
ON "EventRequest" USING GIN ("location" gin_trgm_ops);

CREATE INDEX "EventRequest_hostName_trgm_idx"
ON "EventRequest" USING GIN ("hostName" gin_trgm_ops);

CREATE INDEX "EventRequest_category_trgm_idx"
ON "EventRequest" USING GIN ("category" gin_trgm_ops);

CREATE INDEX "EventRequest_subCategory_trgm_idx"
ON "EventRequest" USING GIN ("subCategory" gin_trgm_ops);

-- Partial indexes for frequent approved-event filtering.
CREATE INDEX "EventRequest_status_approved_idx"
ON "EventRequest" ("status")
WHERE "status" = 'APPROVED';

CREATE INDEX "EventRequest_status_date_approved_idx"
ON "EventRequest" ("status", "date")
WHERE "status" = 'APPROVED';
