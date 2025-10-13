"use client";

import type { PropertyFilters } from "@/types/property";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useMapProperties } from "@/app/mapa-inmobiliaria/_hooks/useMapProperties";

interface AdvancedFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: Partial<PropertyFilters>) => void;
  onClear: () => void;
}

const FEATURES: { key: string; label: string }[] = [
  { key: "parking", label: "Cochera" },
  { key: "terrace", label: "Terraza" },
  { key: "pet", label: "Mascotas" },
  { key: "furnished", label: "Amoblado" },
];

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClear,
}: AdvancedFiltersProps) {
  const { allProperties } = useMapProperties();

  // Calcular rangos dinámicos basados en los datos reales
  const priceRange =
    allProperties.length > 0
      ? {
          min: Math.min(...allProperties.map((p) => p.price)),
          max: Math.max(...allProperties.map((p) => p.price)),
        }
      : { min: 0, max: 1000000 };

  const areaRange =
    allProperties.length > 0
      ? {
          min: Math.min(...allProperties.map((p) => p.area)),
          max: Math.max(...allProperties.map((p) => p.area)),
        }
      : { min: 0, max: 1000 };

  const price = filters.priceRange ?? priceRange;
  const area = filters.areaRange ?? areaRange;

  return (
    <div className="space-y-6">
      {/* Rango de precio */}
      <div className="space-y-2">
        <Label>Precio</Label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            step={Math.max(
              1,
              Math.floor((priceRange.max - priceRange.min) / 100)
            )}
            value={price.min}
            onChange={(e) =>
              onFiltersChange({
                priceRange: { min: Number(e.target.value), max: price.max },
              })
            }
            className="flex-1"
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            step={Math.max(
              1,
              Math.floor((priceRange.max - priceRange.min) / 100)
            )}
            value={price.max}
            onChange={(e) =>
              onFiltersChange({
                priceRange: { min: price.min, max: Number(e.target.value) },
              })
            }
            className="flex-1"
          />
        </div>
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{price.min.toLocaleString("es-AR")}</span>
          <span>{price.max.toLocaleString("es-AR")}</span>
        </div>
      </div>

      {/* Metros cuadrados */}
      <div className="space-y-2">
        <Label>Superficie (m²)</Label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={areaRange.min}
            max={areaRange.max}
            step={Math.max(
              1,
              Math.floor((areaRange.max - areaRange.min) / 100)
            )}
            value={area.min}
            onChange={(e) =>
              onFiltersChange({
                areaRange: { min: Number(e.target.value), max: area.max },
              })
            }
            className="flex-1"
          />
          <input
            type="range"
            min={areaRange.min}
            max={areaRange.max}
            step={Math.max(
              1,
              Math.floor((areaRange.max - areaRange.min) / 100)
            )}
            value={area.max}
            onChange={(e) =>
              onFiltersChange({
                areaRange: { min: area.min, max: Number(e.target.value) },
              })
            }
            className="flex-1"
          />
        </div>
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{area.min} m²</span>
          <span>{area.max} m²</span>
        </div>
      </div>

      {/* Dormitorios y baños */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Habitaciones</Label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4].map((n) => (
              <Button
                key={n}
                variant={filters.bedrooms?.includes(n) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const current = filters.bedrooms ?? [];
                  const next = current.includes(n)
                    ? current.filter((x) => x !== n)
                    : [...current, n];
                  onFiltersChange({ bedrooms: next.length ? next : undefined });
                }}
              >
                {n}+
              </Button>
            ))}
          </div>
        </div>
        {/* <div className="space-y-2">
          <Label>Baños</Label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map((n) => (
              <Button
                key={n}
                variant={filters.bathrooms?.includes(n) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const current = filters.bathrooms ?? [];
                  const next = current.includes(n)
                    ? current.filter((x) => x !== n)
                    : [...current, n];
                  onFiltersChange({
                    bathrooms: next.length ? next : undefined,
                  });
                }}
              >
                {n}+
              </Button>
            ))}
          </div>
        </div> */}
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label>Características</Label>
        <div className="grid grid-cols-2 gap-2">
          {FEATURES.map((f) => (
            <label key={f.key} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!filters.features?.includes(f.key)}
                onCheckedChange={(checked) => {
                  const current = filters.features ?? [];
                  const next = checked
                    ? Array.from(new Set([...current, f.key]))
                    : current.filter((x) => x !== f.key);
                  onFiltersChange({ features: next.length ? next : undefined });
                }}
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Button variant="ghost" size="sm" onClick={onClear} className="w-full">
          Limpiar avanzados
        </Button>
      </div>
    </div>
  );
}
