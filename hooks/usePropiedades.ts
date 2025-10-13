"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getListaPropiedadesPaginado,
  getPropiedadById,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
  type ListaPropiedadesResponse,
  type PropiedadesFilters,
  type CreateUpdatePropiedadPayload,
} from "@/request/Propiedades";

export function useListaPropiedadesPaginated(filters: PropiedadesFilters = {}) {
  return useQuery<ListaPropiedadesResponse>({
    queryKey: ["propiedades-paginado", filters],
    queryFn: () => getListaPropiedadesPaginado(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30, // Reducido a 30 segundos para mayor reactividad
  });
}

export function usePropiedadById(id: number | string | null) {
  return useQuery({
    queryKey: ["propiedad-detalle", id],
    queryFn: () => getPropiedadById(id!),
    enabled: !!id,
    staleTime: 1000 * 30, // Reducido a 30 segundos para mayor reactividad
  });
}

export function useCrearPropiedad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUpdatePropiedadPayload) =>
      createPropiedad(payload),
    onSuccess: () => {
      // Invalidar todos los caches relacionados con propiedades
      qc.invalidateQueries({ queryKey: ["propiedades-paginado"] });
      qc.invalidateQueries({ queryKey: ["propiedades-map"] }); // Mapa
      qc.invalidateQueries({ queryKey: ["map-properties"] }); // Mapa alternativo
      qc.invalidateQueries({ queryKey: ["inmobiliaria-detalle"] });
      console.log("✅ Cache invalidado después de crear propiedad");
    },
  });
}

export function useActualizarPropiedad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: number | string } & CreateUpdatePropiedadPayload) =>
      updatePropiedad(id, payload),
    onSuccess: (data, variables) => {
      // Invalidar todos los caches relacionados con propiedades
      qc.invalidateQueries({ queryKey: ["propiedades-paginado"] });
      qc.invalidateQueries({ queryKey: ["propiedades-map"] }); // Mapa
      qc.invalidateQueries({ queryKey: ["map-properties"] }); // Mapa alternativo
      qc.invalidateQueries({ queryKey: ["map-property"] }); // Propiedad individual del mapa
      qc.invalidateQueries({ queryKey: ["propiedad-detalle"] }); // Propiedad individual
      qc.invalidateQueries({ queryKey: ["inmobiliaria-detalle"] });

      // Invalidar específicamente la propiedad editada
      qc.invalidateQueries({
        queryKey: ["map-property", variables.id.toString()],
      });
      qc.invalidateQueries({ queryKey: ["propiedad-detalle", variables.id] });

      console.log(
        `✅ Cache invalidado después de actualizar propiedad ${variables.id}`
      );
    },
  });
}

export function useEliminarPropiedad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePropiedad,
    onSuccess: (data, deletedId) => {
      // Invalidar todos los caches relacionados con propiedades
      qc.invalidateQueries({ queryKey: ["propiedades-paginado"] });
      qc.invalidateQueries({ queryKey: ["propiedades-map"] }); // Mapa
      qc.invalidateQueries({ queryKey: ["map-properties"] }); // Mapa alternativo
      qc.invalidateQueries({ queryKey: ["map-property"] }); // Propiedades individuales del mapa
      qc.invalidateQueries({ queryKey: ["propiedad-detalle"] }); // Propiedades individuales
      qc.invalidateQueries({ queryKey: ["inmobiliaria-detalle"] });

      // Remover específicamente la propiedad eliminada del cache
      qc.removeQueries({ queryKey: ["map-property", deletedId.toString()] });
      qc.removeQueries({ queryKey: ["propiedad-detalle", deletedId] });

      console.log(
        `✅ Cache invalidado después de eliminar propiedad ${deletedId}`
      );
    },
  });
}
