-- 1. Create the new Enum type (matching your Prisma schema)
CREATE TYPE "IngestionStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- 2. Add a new temporary column of type IngestionStatus
ALTER TABLE "IngestionJob" ADD COLUMN "status_new" "IngestionStatus";

-- 3. Safely cast existing String values to IngestionStatus. 
-- Adjust the 'QUEUED' fallback if you have other default/string states.
UPDATE "IngestionJob" 
SET "status_new" = CASE 
    WHEN "status" = 'QUEUED' THEN 'QUEUED'::"IngestionStatus"
    WHEN "status" = 'PROCESSING' THEN 'PROCESSING'::"IngestionStatus"
    WHEN "status" = 'COMPLETED' THEN 'COMPLETED'::"IngestionStatus"
    WHEN "status" = 'FAILED' THEN 'FAILED'::"IngestionStatus"
    ELSE 'QUEUED'::"IngestionStatus" -- Fallback for any unknown strings
END;

-- 4. Make the new column NOT NULL
ALTER TABLE "IngestionJob" ALTER COLUMN "status_new" SET NOT NULL;

-- 5. Drop the old string column
ALTER TABLE "IngestionJob" DROP COLUMN "status";

-- 6. Rename the new column to 'status'
ALTER TABLE "IngestionJob" RENAME COLUMN "status_new" TO "status";
