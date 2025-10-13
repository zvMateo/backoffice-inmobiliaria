"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCountDashboard,
  getListaPropiedadesInmo,
  getListaPropiedadesByIdInmo,
} from "@/request/Inmobiliaria";

export function useDashboardCounts() {
  return useQuery({
    queryKey: ["dashboard-counts"],
    queryFn: () => getCountDashboard(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useListaPropiedades() {
  return useQuery({
    queryKey: ["inmo-propiedades"],
    queryFn: () => getListaPropiedadesInmo(),
    staleTime: 1000 * 60 * 10,
  });
}

// Alias para el carrusel del dashboard
export function useListaPropiedadesInmo() {
  return useListaPropiedades();
}

export function usePropiedadById(id: number | string | null) {
  return useQuery({
    queryKey: ["inmo-propiedad", id],
    queryFn: () => getListaPropiedadesByIdInmo(id as number),
    enabled: id !== null && id !== undefined,
    staleTime: 1000 * 60 * 10,
  });
}


