// hooks/useFilterOptions.ts
"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTypesFilters } from "@/request/Properties";

export type UIOption = { id: number; label: string };
export type CityWithProvince = { id: number; label: string; provinceId?: number };

// helpers de mapeo no utilizados eliminados para evitar warnings de lint

// Función para mapear opciones del backend
function mapBackendOptions(items: any[]): UIOption[] {
  return items.map(item => ({
    id: item.id,
    label: typeof item.name === 'string' ? item.name.trim() : String(item.name)
  }));
}

export function useFilterOptions() {
  const query = useQuery({
    queryKey: ["mapa-filtros"],
    queryFn: async () => {
      const data = await getTypesFilters();
      console.log('🔍 [FILTROS] Datos crudos del backend:', data);
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  const mapped = useMemo(() => {
    const res: any = query.data ?? {};

    // Aceptar múltiples variantes de claves según el backend
    const props  = res.properties ?? res.tiposPropiedades ?? res.propiedades ?? [];
    const ops    = res.operationsType ?? res.tiposOperaciones ?? [];
    const locs   = res.localities ?? res.localidades ?? res.locality ?? [];
    let provs  = res.provincias ?? res.provinces ?? [];

    const citiesWithProvince: CityWithProvince[] = (locs as any[]).map((l) => ({
      id: l.id,
      label: typeof l.name === 'string' ? l.name.trim() : String(l.name),
      provinceId: l.provinceId ?? l.provinceid,
    }));

    // Si no vienen provincias, sintetizarlas desde las localidades
    if ((!Array.isArray(provs) || provs.length === 0) && Array.isArray(locs) && locs.length > 0) {
      const PROVINCE_NAMES: Record<number, string> = {
        1: "Córdoba",
      };
      const map = new Map<number, { id: number; name: string }>();
      (locs as any[]).forEach((l) => {
        const rawId = l.provinceId ?? l.provinceid;
        if (rawId === undefined || rawId === null) return;
        const id = Number(rawId);
        if (!map.has(id)) {
          map.set(id, { id, name: PROVINCE_NAMES[id] || `Provincia ${id}` });
        }
      });
      provs = Array.from(map.values());
    }

    return {
      types:      mapBackendOptions(props),
      operations: mapBackendOptions(ops),
      cities:     mapBackendOptions(locs),
      citiesWithProvince,
      provinces:  mapBackendOptions(provs),
    };
  }, [query.data]);

  return { ...mapped, loading: query.isLoading, error: query.error ? (query.error as any)?.message ?? "Error" : null };
}
