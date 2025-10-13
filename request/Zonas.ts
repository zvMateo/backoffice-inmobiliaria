import { axiosBackend } from "@/request/Properties";

export interface ZonaDTO {
  id: number;
  name: string;
  active?: boolean;
  localidadId: number;
  localidad: string;
}

export interface ListaZonasResponse {
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  data: ZonaDTO[];
}

export async function getListaZonas() {
  const { data } = await axiosBackend.get<ZonaDTO[]>("Zonas/GetListaZonas");
  return data;
}

export async function getListaZonasPaginated(page: number = 1, pageSize: number = 5) {
  const { data } = await axiosBackend.get<ListaZonasResponse>(
    "Zonas/GetListaZonas",
    { params: { page, pageSize } }
  );
  return data;
}

export async function getZonaById(id: number) {
  const { data } = await axiosBackend.get<ZonaDTO>(
    "Zonas/GetListaZonasById",
    { params: { id } }
  );
  return data;
}

export async function crearZona(payload: Partial<ZonaDTO>) {
  const { data } = await axiosBackend.post("Zonas/CrearZona", payload);
  return data;
}

export async function actualizarZona(payload: ZonaDTO) {
  const { data } = await axiosBackend.put("Zonas/ActualizarZona", payload);
  return data;
}

export async function eliminarZona(id: number) {
  const { data } = await axiosBackend.delete(`Zonas/EliminarZona/${id}`);
  return data;
}



