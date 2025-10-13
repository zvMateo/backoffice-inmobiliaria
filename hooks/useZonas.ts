"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getListaZonas,
  getZonaById,
  crearZona,
  actualizarZona,
  eliminarZona,
  type ZonaDTO,
  getListaZonasPaginated,
  type ListaZonasResponse,
} from "@/request/Zonas";

export function useZonas() {
  return useQuery({
    queryKey: ["zonas"],
    queryFn: () => getListaZonas(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useZonasPaginated(page: number, pageSize: number = 5) {
  return useQuery<ListaZonasResponse>({
    queryKey: ["zonas-paginado", page, pageSize],
    queryFn: () => getListaZonasPaginated(page, pageSize),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  });
}

// Obtiene todas las zonas recorriendo todas las páginas del backend
export function useZonasAll() {
  return useQuery({
    queryKey: ["zonas-all"],
    queryFn: async () => {
      const first = await getListaZonasPaginated(1, 5);
      const totalPages = first.totalPaginas || 1;
      if (totalPages <= 1) return first.data;
      const restPromises = [] as Array<Promise<ListaZonasResponse>>;
      for (let p = 2; p <= totalPages; p++) {
        restPromises.push(getListaZonasPaginated(p, 5));
      }
      const rest = await Promise.all(restPromises);
      const all = [first.data, ...rest.map((r) => r.data)].flat();
      return all;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useZona(id: number | null) {
  return useQuery({
    queryKey: ["zona", id],
    queryFn: () => getZonaById(id as number),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCrearZona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ZonaDTO>) => crearZona(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["zonas"] });
    },
  });
}

export function useActualizarZona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ZonaDTO) => actualizarZona(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["zonas"] });
    },
  });
}

export function useEliminarZona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarZona(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["zonas"] });
    },
  });
}



