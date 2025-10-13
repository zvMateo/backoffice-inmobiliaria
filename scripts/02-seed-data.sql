-- Updated all table names to lowercase
-- Insert sample data for typesproperties
INSERT INTO "typesproperties" ("name", "active") VALUES
('Casa', true),
('Departamento', true),
('Local Comercial', true),
('Oficina', true),
('Terreno', true)
ON CONFLICT DO NOTHING;

-- Insert sample data for operationsproperties
INSERT INTO "operationsproperties" ("name", "active") VALUES
('Compra', true),
('Alquiler mensual', true),
('Alquiler temporal', true)
ON CONFLICT DO NOTHING;

-- Insert sample data for zones
INSERT INTO "zones" ("provinceid", "name", "active") VALUES
(1, 'Centro', true),
(1, 'Nueva Córdoba', true),
(1, 'Alberdi', true),
(1, 'Güemes', true),
(1, 'General Paz', true),
(1, 'Cofico', true),
(1, 'Alta Córdoba', true),
(1, 'Observatorio', true),
(1, 'Barrio Juniors', true),
(2, 'San Martín', true),
(1, 'Clinicas', true),
(1, 'Maipú', true),
(1, 'Barrio Müller', true),
(1, 'Alto Alberdi', true)
ON CONFLICT DO NOTHING;

-- Insert sample data for currencies
INSERT INTO "currencies" ("name", "active") VALUES
('Pesos argentinos', true),
('Dólares americanos', true),
('Euros', true)
ON CONFLICT DO NOTHING;
