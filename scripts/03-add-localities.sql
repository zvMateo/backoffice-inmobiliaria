-- Updated all table names and field names to lowercase
-- Create localities table and update zones with localityid
-- Create localities table
CREATE TABLE IF NOT EXISTS "localities" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "active" BOOLEAN DEFAULT true
);

-- Insert Cordoba Capital
INSERT INTO "localities" ("name", "active") VALUES
('Cordoba Capital', true)
ON CONFLICT DO NOTHING;

-- Add localityid column to zones table
ALTER TABLE "zones" 
ADD COLUMN IF NOT EXISTS "localityid" INTEGER REFERENCES "localities"("id");

-- Update all existing zones to reference Cordoba Capital (id = 1)
UPDATE "zones" 
SET "localityid" = 1 
WHERE "localityid" IS NULL;
