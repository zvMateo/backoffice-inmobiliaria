"use client"

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import {
  getListaTiposPropiedades,
  getTipoPropiedadById,
  crearTipoPropiedad,
  actualizarTipoPropiedad,
  eliminarTipoPropiedad,
  type TipoPropiedadDTO,
  getListaTiposPropiedadesPaginated,
  type ListaTiposPropiedadesResponse,
} from "@/request/TypesPropiedades"

export function useTiposPropiedades() {
  return useQuery({
    queryKey: ["tipos-propiedades"],
    queryFn: getListaTiposPropiedades,
    staleTime: 1000 * 60 * 5,
  })
}

export function useTiposPropiedadesPaginated(page: number) {
  return useQuery<ListaTiposPropiedadesResponse>({
    queryKey: ["tipos-propiedades-paginado", page],
    queryFn: () => getListaTiposPropiedadesPaginated(page),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60,
  })
}

export function useTipoPropiedad(id: number | null) {
  return useQuery({
    queryKey: ["tipo-propiedad", id],
    queryFn: () => (id ? getTipoPropiedadById(id) : Promise.resolve(null as any)),
    enabled: !!id,
  })
}

export function useCrearTipoPropiedad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: crearTipoPropiedad,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tipos-propiedades"] })
      qc.invalidateQueries({ queryKey: ["tipos-propiedades-paginado"] })
    },
  })
}

export function useActualizarTipoPropiedad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: actualizarTipoPropiedad,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tipos-propiedades"] })
      qc.invalidateQueries({ queryKey: ["tipos-propiedades-paginado"] })
    },
  })
}

export function useEliminarTipoPropiedad() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: eliminarTipoPropiedad,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tipos-propiedades"] })
      qc.invalidateQueries({ queryKey: ["tipos-propiedades-paginado"] })
    },
  })
}


