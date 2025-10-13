/**
 * Hooks de TanStack Query para todos los endpoints de la API
 * Generados según Swagger de la API
 */

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { axiosBackend } from "@/request/Properties";

// ============================================================================
// TYPES
// ============================================================================

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type DashboardCounts = {
  propiedades: number;
  tiposPropiedades: number;
  tiposOperaciones: number;
  provincias: number;
  zonas: number;
  monedas: number;
};

export type Localidad = {
  id: number;
  name: string;
  active: boolean;
  provinceid: number;
};

export type Moneda = {
  id: number;
  name: string;
  symbol: string;
  active: boolean;
};

export type Provincia = {
  id: number;
  name: string;
  active: boolean;
};

export type TipoOperacion = {
  id: number;
  name: string;
  active: boolean;
};

export type TipoPropiedad = {
  id: number;
  name: string;
  active: boolean;
};

export type Zona = {
  id: number;
  name: string;
  active: boolean;
  localityid: number;
};

// ============================================================================
// DASHBOARD
// ============================================================================

export function useGetCountDashboard(options?: Omit<UseQueryOptions<DashboardCounts>, "queryKey" | "queryFn">) {
  return useQuery<DashboardCounts>({
    queryKey: ["dashboard", "counts"],
    queryFn: async () => {
      const { data } = await axiosBackend.get<DashboardCounts>("Inmobiliaria/GetCountDashboard");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    ...options,
  });
}

// ============================================================================
// LOCALIDADES
// ============================================================================

export function useGetLocalidades(params?: PaginationParams, options?: Omit<UseQueryOptions<Localidad[]>, "queryKey" | "queryFn">) {
  return useQuery<Localidad[]>({
    queryKey: ["localidades", "list", params],
    queryFn: async () => {
      const { data } = await axiosBackend.get<Localidad[]>("Localidades/GetListaLocalidades", { params });
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
    ...options,
  });
}

export function useGetLocalidadById(id: number | null, options?: Omit<UseQueryOptions<Localidad>, "queryKey" | "queryFn">) {
  return useQuery<Localidad>({
    queryKey: ["localidades", "detail", id],
    queryFn: async () => {
      const { data } = await axiosBackend.get<Localidad>(`Localidades/GetListaLocalidadesById/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useCreateLocalidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Localidad, "id">) => {
      const { data } = await axiosBackend.post("Localidades/CrearLocalidad", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["localidades"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useUpdateLocalidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Localidad) => {
      const { data } = await axiosBackend.put(`Localidades/ActualizarLocalidad/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["localidades"] });
      queryClient.invalidateQueries({ queryKey: ["localidades", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useDeleteLocalidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosBackend.delete(`Localidades/EliminarLocalidad/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["localidades"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

// ============================================================================
// MONEDAS
// ============================================================================

export function useGetMonedas(params?: PaginationParams, options?: Omit<UseQueryOptions<Moneda[]>, "queryKey" | "queryFn">) {
  return useQuery<Moneda[]>({
    queryKey: ["monedas", "list", params],
    queryFn: async () => {
      const { data } = await axiosBackend.get<Moneda[]>("Monedas/GetListaMonedas", { params });
      return data;
    },
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useGetMonedaById(id: number | null, options?: Omit<UseQueryOptions<Moneda>, "queryKey" | "queryFn">) {
  return useQuery<Moneda>({
    queryKey: ["monedas", "detail", id],
    queryFn: async () => {
      const { data } = await axiosBackend.get<Moneda>(`Monedas/GetListaMonedasById/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useCreateMoneda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Moneda, "id">) => {
      const { data } = await axiosBackend.post("Monedas/CrearMoneda", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monedas"] });
    },
  });
}

export function useUpdateMoneda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Moneda) => {
      const { data } = await axiosBackend.put(`Monedas/ActualizarMoneda/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["monedas"] });
      queryClient.invalidateQueries({ queryKey: ["monedas", "detail", variables.id] });
    },
  });
}

export function useDeleteMoneda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosBackend.delete(`Monedas/EliminarMoneda/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monedas"] });
    },
  });
}

// ============================================================================
// PROVINCIAS
// ============================================================================

export function useGetProvincias(params?: PaginationParams, options?: Omit<UseQueryOptions<Provincia[]>, "queryKey" | "queryFn">) {
  return useQuery<Provincia[]>({
    queryKey: ["provincias", "list", params],
    queryFn: async () => {
      const { data } = await axiosBackend.get<Provincia[]>("Provincias/GetListaProvincias", { params });
      return data;
    },
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useGetProvinciaById(id: number | null, options?: Omit<UseQueryOptions<Provincia>, "queryKey" | "queryFn">) {
  return useQuery<Provincia>({
    queryKey: ["provincias", "detail", id],
    queryFn: async () => {
      const { data } = await axiosBackend.get<Provincia>(`Provincias/GetProvinciaById/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useCreateProvincia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Provincia, "id">) => {
      const { data } = await axiosBackend.post("Provincias/CrearProvincia", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provincias"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useUpdateProvincia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Provincia) => {
      const { data } = await axiosBackend.put(`Provincias/ActualizarProvincia/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["provincias"] });
      queryClient.invalidateQueries({ queryKey: ["provincias", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useDeleteProvincia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosBackend.delete(`Provincias/EliminarProvincia/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provincias"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

// ============================================================================
// TIPOS DE OPERACIONES
// ============================================================================

export function useGetTiposOperaciones(params?: PaginationParams, options?: Omit<UseQueryOptions<TipoOperacion[]>, "queryKey" | "queryFn">) {
  return useQuery<TipoOperacion[]>({
    queryKey: ["tipos-operaciones", "list", params],
    queryFn: async () => {
      const { data } = await axiosBackend.get<TipoOperacion[]>("Typesoperaciones/GetListaTiposOperaciones", { params });
      return data;
    },
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useGetTipoOperacionById(id: number | null, options?: Omit<UseQueryOptions<TipoOperacion>, "queryKey" | "queryFn">) {
  return useQuery<TipoOperacion>({
    queryKey: ["tipos-operaciones", "detail", id],
    queryFn: async () => {
      const { data } = await axiosBackend.get<TipoOperacion>(`Typesoperaciones/GetListaTiposOperacionesById/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useCreateTipoOperacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<TipoOperacion, "id">) => {
      const { data } = await axiosBackend.post("Typesoperaciones/CrearTipoOperacion", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipos-operaciones"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useUpdateTipoOperacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TipoOperacion) => {
      const { data } = await axiosBackend.put(`Typesoperaciones/ActualizarTipoOperacion/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tipos-operaciones"] });
      queryClient.invalidateQueries({ queryKey: ["tipos-operaciones", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useDeleteTipoOperacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosBackend.delete(`Typesoperaciones/EliminarTipoOperacion/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipos-operaciones"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

// ============================================================================
// TIPOS DE PROPIEDADES
// ============================================================================

export function useGetTiposPropiedades(options?: Omit<UseQueryOptions<TipoPropiedad[]>, "queryKey" | "queryFn">) {
  return useQuery<TipoPropiedad[]>({
    queryKey: ["tipos-propiedades", "list"],
    queryFn: async () => {
      const { data } = await axiosBackend.get<TipoPropiedad[]>("Typespropiedades/GetListaTiposPropiedades");
      return data;
    },
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useGetTipoPropiedadById(id: number | null, options?: Omit<UseQueryOptions<TipoPropiedad>, "queryKey" | "queryFn">) {
  return useQuery<TipoPropiedad>({
    queryKey: ["tipos-propiedades", "detail", id],
    queryFn: async () => {
      const { data } = await axiosBackend.get<TipoPropiedad>(`Typespropiedades/GetListaTiposPropiedadesById/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useCreateTipoPropiedad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<TipoPropiedad, "id">) => {
      const { data } = await axiosBackend.post("Typespropiedades/CrearTipoPropiedad", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipos-propiedades"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useUpdateTipoPropiedad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TipoPropiedad) => {
      const { data } = await axiosBackend.put(`Typespropiedades/ActualizarTipoPropiedad/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tipos-propiedades"] });
      queryClient.invalidateQueries({ queryKey: ["tipos-propiedades", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useDeleteTipoPropiedad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosBackend.delete(`Typespropiedades/EliminarTipoPropiedad/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipos-propiedades"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

// ============================================================================
// ZONAS
// ============================================================================

export function useGetZonas(params?: PaginationParams, options?: Omit<UseQueryOptions<Zona[]>, "queryKey" | "queryFn">) {
  return useQuery<Zona[]>({
    queryKey: ["zonas", "list", params],
    queryFn: async () => {
      const { data} = await axiosBackend.get<Zona[]>("Zonas/GetListaZonas", { params });
      return data;
    },
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useGetZonaById(id: number | null, options?: Omit<UseQueryOptions<Zona>, "queryKey" | "queryFn">) {
  return useQuery<Zona>({
    queryKey: ["zonas", "detail", id],
    queryFn: async () => {
      const { data } = await axiosBackend.get<Zona>(`Zonas/GetListaZonasById/${id}`);
      return data;
    },
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useCreateZona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Zona, "id">) => {
      const { data } = await axiosBackend.post("Zonas/CrearZona", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zonas"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useUpdateZona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Zona) => {
      const { data } = await axiosBackend.put(`Zonas/ActualizarZona/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["zonas"] });
      queryClient.invalidateQueries({ queryKey: ["zonas", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}

export function useDeleteZona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosBackend.delete(`Zonas/EliminarZona/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zonas"] });
      queryClient.invalidateQueries({ queryKey: ["mapa-filtros"] });
    },
  });
}


