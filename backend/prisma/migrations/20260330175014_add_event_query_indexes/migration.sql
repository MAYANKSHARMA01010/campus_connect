-- CreateIndex
CREATE INDEX "EventImage_eventRequestId_idx" ON "EventImage"("eventRequestId");

-- CreateIndex
CREATE INDEX "EventRequest_status_date_idx" ON "EventRequest"("status", "date");

-- CreateIndex
CREATE INDEX "EventRequest_status_category_date_idx" ON "EventRequest"("status", "category", "date");

-- CreateIndex
CREATE INDEX "EventRequest_createdById_createdAt_idx" ON "EventRequest"("createdById", "createdAt");

-- CreateIndex
CREATE INDEX "EventRequest_createdAt_idx" ON "EventRequest"("createdAt");

-- CreateIndex
CREATE INDEX "EventRequest_category_idx" ON "EventRequest"("category");
