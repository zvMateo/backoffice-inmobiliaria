import { axiosBackend } from "@/request/Properties";

export interface ProvinciaDTO {
  id: number;
  name: string;
  active?: boolean;
  localitiesais?: LocalidadDTO[];
}

export interface LocalidadDTO {
  id: number;
  name: string;
  active?: boolean;
  provinceid: number;
  province?: any;
  zonesais?: ZonaDTO[];
}

export interface ZonaDTO {
  id: number;
  name: string;
  active?: boolean;
  localidadId?: number;
  localidad?: string;
}

export interface ListaProvinciasResponse {
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  data: ProvinciaDTO[];
}

export async function getListaProvincias() {
  const { data } = await axiosBackend.get<ProvinciaDTO[]>(
    "Provincias/GetListaProvincias"
  );
  return data;
}

export async function getListaProvinciasPaginated(page: number = 1, pageSize: number = 10) {
  const { data } = await axiosBackend.get<ListaProvinciasResponse>(
    "Provincias/GetListaProvincias",
    { params: { page, pageSize } }
  );
  return data;
}

export async function getProvinciaById(id: number) {
  const { data } = await axiosBackend.get<ProvinciaDTO>(
    `Provincias/GetProvinciaById`,
    { params: { id } }
  );
  return data;
}

export async function crearProvincia(payload: { name: string }) {
  const { data } = await axiosBackend.post(
    "Provincias/CrearProvincia",
    payload
  );
  return data;
}

export async function actualizarProvincia(payload: { id: number; name: string; active?: boolean }) {
  const { id, name, active } = payload;
  const { data } = await axiosBackend.put(
    `Provincias/ActualizarProvincia/${id}`,
    { name, active }
  );
  return data;
}

export async function eliminarProvincia(id: number) {
  const { data } = await axiosBackend.delete(
    `Provincias/EliminarProvincia/${id}`
  );
  return data;
}



