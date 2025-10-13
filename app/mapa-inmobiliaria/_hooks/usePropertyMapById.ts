"use client";

import { useQuery } from "@tanstack/react-query";
import { getPropiedadMapaById } from "@/request/Properties";

export function usePropertyMapById(id: string | null) {
  return useQuery({
    queryKey: ["map-property", id],
    queryFn: () => getPropiedadMapaById(id as string),
    enabled: !!id,
    staleTime: 1000 * 30, // Reducido a 30 segundos para mayor reactividad
  });
}
