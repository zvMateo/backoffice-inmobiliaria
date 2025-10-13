-- Migration script to create new lowercase tables and migrate data from existing tables

-- Create new lowercase tables
-- Create typesproperties table
CREATE TABLE IF NOT EXISTS "typesproperties" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "active" BOOLEAN DEFAULT true
);

-- Create operationsproperties table  
CREATE TABLE IF NOT EXISTS "operationsproperties" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "active" BOOLEAN DEFAULT true
);

-- Create currencies table
CREATE TABLE IF NOT EXISTS "currencies" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "active" BOOLEAN DEFAULT true
);

-- Create localities table
CREATE TABLE IF NOT EXISTS "localities" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "active" BOOLEAN DEFAULT true
);

-- Create zones table
CREATE TABLE IF NOT EXISTS "zones" (
  "id" SERIAL PRIMARY KEY,
  "provinceid" INTEGER,
  "localityid" INTEGER REFERENCES "localities"("id"),
  "name" VARCHAR(255),
  "active" BOOLEAN DEFAULT true
);

-- Create properties table
CREATE TABLE IF NOT EXISTS "properties" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "detail" TEXT,
  "typepropertyid" INTEGER REFERENCES "typesproperties"("id"),
  "typeproperty" VARCHAR(255),
  "operationpropertyid" INTEGER REFERENCES "operationsproperties"("id"),
  "operationproperty" VARCHAR(255),
  "zoneid" INTEGER REFERENCES "zones"("id"),
  "zone" VARCHAR(255),
  "address" VARCHAR(255),
  "lat" VARCHAR(50),
  "lng" VARCHAR(50),
  "currencyid" INTEGER REFERENCES "currencies"("id"),
  "currency" VARCHAR(255),
  "price" DECIMAL(15,2),
  "room" INTEGER,
  "size" DECIMAL(10,2),
  "furnished" BOOLEAN DEFAULT false,
  "pet" BOOLEAN DEFAULT false,
  "parking" BOOLEAN DEFAULT false,
  "terrace" BOOLEAN DEFAULT false
);

-- Create propertiesimages table
CREATE TABLE IF NOT EXISTS "propertiesimages" (
  "id" SERIAL PRIMARY KEY,
  "propertyid" INTEGER REFERENCES "properties"("id"),
  "url" VARCHAR(500),
  "active" BOOLEAN DEFAULT true
);

-- Migrate data from old tables to new tables
-- Migrate typesproperties
INSERT INTO "typesproperties" ("id", "name", "active")
SELECT "id", "name", "active" FROM "typespropertiesai"
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "active" = EXCLUDED."active";

-- Migrate operationsproperties
INSERT INTO "operationsproperties" ("id", "name", "active")
SELECT "id", "name", "active" FROM "operationspropertiesai"
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "active" = EXCLUDED."active";

-- Migrate currencies
INSERT INTO "currencies" ("id", "name", "active")
SELECT "id", "name", "active" FROM "currenciesai"
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "active" = EXCLUDED."active";

-- Migrate localities
INSERT INTO "localities" ("id", "name", "active")
SELECT "id", "name", "active" FROM "localitiesai"
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "active" = EXCLUDED."active";

-- Migrate zones
INSERT INTO "zones" ("id", "provinceid", "localityid", "name", "active")
SELECT "id", "provinceid", "localityid", "name", "active" FROM "zonesai"
ON CONFLICT ("id") DO UPDATE SET
  "provinceid" = EXCLUDED."provinceid",
  "localityid" = EXCLUDED."localityid",
  "name" = EXCLUDED."name",
  "active" = EXCLUDED."active";

-- Migrate properties
INSERT INTO "properties" ("id", "name", "detail", "typepropertyid", "typeproperty", "operationpropertyid", "operationproperty", "zoneid", "zone", "address", "lat", "lng", "currencyid", "currency", "price", "room", "size", "furnished", "pet", "parking", "terrace")
SELECT "id", "name", "detail", "typepropertyid", "typeproperty", "operationpropertyid", "operationproperty", "zoneid", "zone", "address", "lat", "lng", "currencyid", "currency", "price", "room", "size", "furnished", "pet", "parking", "terrace" FROM "propertiesai"
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "detail" = EXCLUDED."detail",
  "typepropertyid" = EXCLUDED."typepropertyid",
  "typeproperty" = EXCLUDED."typeproperty",
  "operationpropertyid" = EXCLUDED."operationpropertyid",
  "operationproperty" = EXCLUDED."operationproperty",
  "zoneid" = EXCLUDED."zoneid",
  "zone" = EXCLUDED."zone",
  "address" = EXCLUDED."address",
  "lat" = EXCLUDED."lat",
  "lng" = EXCLUDED."lng",
  "currencyid" = EXCLUDED."currencyid",
  "currency" = EXCLUDED."currency",
  "price" = EXCLUDED."price",
  "room" = EXCLUDED."room",
  "size" = EXCLUDED."size",
  "furnished" = EXCLUDED."furnished",
  "pet" = EXCLUDED."pet",
  "parking" = EXCLUDED."parking",
  "terrace" = EXCLUDED."terrace";

-- Migrate propertiesimages
INSERT INTO "propertiesimages" ("id", "propertyid", "url", "active")
SELECT "id", "propertyid", "url", "active" FROM "propertiesimagesai"
ON CONFLICT ("id") DO UPDATE SET
  "propertyid" = EXCLUDED."propertyid",
  "url" = EXCLUDED."url",
  "active" = EXCLUDED."active";

-- Update sequences to match the highest ID from migrated data
SELECT setval('typesproperties_id_seq', COALESCE((SELECT MAX(id) FROM typesproperties), 1));
SELECT setval('operationsproperties_id_seq', COALESCE((SELECT MAX(id) FROM operationsproperties), 1));
SELECT setval('currencies_id_seq', COALESCE((SELECT MAX(id) FROM currencies), 1));
SELECT setval('localities_id_seq', COALESCE((SELECT MAX(id) FROM localities), 1));
SELECT setval('zones_id_seq', COALESCE((SELECT MAX(id) FROM zones), 1));
SELECT setval('properties_id_seq', COALESCE((SELECT MAX(id) FROM properties), 1));
SELECT setval('propertiesimages_id_seq', COALESCE((SELECT MAX(id) FROM propertiesimages), 1));
