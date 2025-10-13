-- Updated all table names and field names to lowercase
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

-- Create zones table
CREATE TABLE IF NOT EXISTS "zones" (
  "id" SERIAL PRIMARY KEY,
  "provinceid" INTEGER,
  "name" VARCHAR(255),
  "active" BOOLEAN DEFAULT true
);

-- Create currencies table
CREATE TABLE IF NOT EXISTS "currencies" (
  "id" SERIAL PRIMARY KEY,
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
