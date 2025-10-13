/**
 * Hooks de TanStack Query para propiedades
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosBackend } from "@/request/Properties";

// ============================================================================
// TYPES
// ============================================================================

export type PropertyPayload = {
  name: string;
  detail: string;
  typepropertyid: number;
  operationpropertyid: number;
  zoneid: number;
  currencyid: number;
  price: number;
  room: number;
  size: number;
  furnished: boolean;
  pet: boolean;
  parking: boolean;
  terrace: boolean;
  address: string;
  lat: string;
  lng: string;
  whatsapp: string;
  email: string;
  active: boolean;
  imagenes: string[];
};

// ============================================================================
// PROPIEDADES CRUD
// ============================================================================

export function useGetProperties(page: number = 1) {
  return useQuery({
    queryKey: ["properties", "list", page],
    queryFn: async () => {
      const { data } = await axiosBackend.get(`Propiedades/GetListaPropiedades`, { params: { page } });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useGetPropertyById(id: number | null) {
  return useQuery({
    queryKey: ["properties", "detail", id],
    queryFn: async () => {
      // Usar el endpoint del mapa que sí funciona
      // Según Swagger: GET /api/Mapa/GetPropiedad/{id}
      const { data } = await axiosBackend.get(`Mapa/GetPropiedad/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1, // Solo reintenta 1 vez en caso de error
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PropertyPayload) => {
      const { data } = await axiosBackend.post("Propiedades/CreatePropiedades", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["map-properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: PropertyPayload & { id: number }) => {
      const { data } = await axiosBackend.put(`Propiedades/UpdatePropiedades/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["map-properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosBackend.delete(`Propiedades/DeleteListaPropiedadesById/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["map-properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

