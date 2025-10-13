"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getListaLocalidades,
  getLocalidadById,
  crearLocalidad,
  actualizarLocalidad,
  eliminarLocalidad,
  LocalidadDTO,
  getListaLocalidadesPaginated,
  type ListaLocalidadesResponse,
} from "@/request/Localidades";

export function useLocalidades() {
  return useQuery({
    queryKey: ["localidades"],
    queryFn: () => getListaLocalidades(),
    staleTime: 1000 * 60 * 10, // 10 min
  });
}

export function useLocalidadesPaginated(page: number, pageSize: number = 5) {
  return useQuery<ListaLocalidadesResponse>({
    queryKey: ["localidades-paginado", page, pageSize],
    queryFn: () => getListaLocalidadesPaginated(page, pageSize),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  });
}

export function useLocalidad(id: number | null) {
  return useQuery({
    queryKey: ["localidad", id],
    queryFn: () => getLocalidadById(id as number),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCrearLocalidad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => crearLocalidad(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["localidades"] });
    },
  });
}

export function useActualizarLocalidad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LocalidadDTO) => actualizarLocalidad(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["localidades"] });
    },
  });
}

export function useEliminarLocalidad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarLocalidad(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["localidades"] });
    },
  });
}


