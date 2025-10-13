"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getListaProvincias,
  getListaProvinciasPaginated,
  getProvinciaById,
  crearProvincia,
  actualizarProvincia,
  eliminarProvincia,
} from "@/request/Provincias";

export function useProvincias() {
  return useQuery({
    queryKey: ["provincias"],
    queryFn: () => getListaProvincias(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useProvinciasPaginated(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["provincias-paginated", page, pageSize],
    queryFn: () => getListaProvinciasPaginated(page, pageSize),
    staleTime: 1000 * 60 * 10,
  });
}

export function useProvinciaById(id: number | string | null) {
  return useQuery({
    queryKey: ["provincia", id],
    queryFn: () => getProvinciaById(id as number),
    enabled: id !== null && id !== undefined,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCrearProvincia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearProvincia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provincias"] });
      queryClient.invalidateQueries({ queryKey: ["provincias-paginated"] });
    },
  });
}

export function useActualizarProvincia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarProvincia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provincias"] });
      queryClient.invalidateQueries({ queryKey: ["provincias-paginated"] });
    },
  });
}

export function useEliminarProvincia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarProvincia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provincias"] });
      queryClient.invalidateQueries({ queryKey: ["provincias-paginated"] });
    },
  });
}



