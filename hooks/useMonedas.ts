"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getListaMonedas,
  getMonedaById,
  crearMoneda,
  actualizarMoneda,
  eliminarMoneda,
  MonedaDTO,
  getListaMonedasPaginated,
  type ListaMonedasResponse,
} from "@/request/Monedas";

export function useMonedas() {
  return useQuery({
    queryKey: ["monedas"],
    queryFn: () => getListaMonedas(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useMonedasPaginated(page: number) {
  return useQuery<ListaMonedasResponse>({
    queryKey: ["monedas-paginado", page],
    queryFn: () => getListaMonedasPaginated(page),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  });
}

export function useMoneda(id: number | null) {
  return useQuery({
    queryKey: ["moneda", id],
    queryFn: () => getMonedaById(id as number),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCrearMoneda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<MonedaDTO>) => crearMoneda(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["monedas"] });
    },
  });
}

export function useActualizarMoneda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<MonedaDTO> }) => actualizarMoneda(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["monedas"] });
    },
  });
}

export function useEliminarMoneda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarMoneda(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["monedas"] });
    },
  });
}


