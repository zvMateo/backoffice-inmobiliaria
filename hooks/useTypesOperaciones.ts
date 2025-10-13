"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getListaTiposOperaciones,
  getTipoOperacionById,
  crearTipoOperacion,
  actualizarTipoOperacion,
  eliminarTipoOperacion,
  type TipoOperacionDTO,
} from "@/request/TypesOperaciones";

export function useTiposOperaciones() {
  return useQuery({
    queryKey: ["tipos-operaciones"],
    queryFn: getListaTiposOperaciones,
    staleTime: 1000 * 60 * 60,
  });
}

export function useTipoOperacion(id: number | null) {
  return useQuery({
    queryKey: ["tipo-operacion", id],
    queryFn: () => getTipoOperacionById(id as number),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}

export function useCrearTipoOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<TipoOperacionDTO, "id">) => crearTipoOperacion(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tipos-operaciones"] });
    },
  });
}

export function useActualizarTipoOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TipoOperacionDTO) => actualizarTipoOperacion(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tipos-operaciones"] });
    },
  });
}

export function useEliminarTipoOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTipoOperacion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tipos-operaciones"] });
    },
  });
}


