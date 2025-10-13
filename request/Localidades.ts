import { axiosBackend } from "@/request/Properties";

export interface LocalidadDTO {
  id: number;
  name: string;
  active?: boolean;
  provinceId?: number; // from paginated response
  provincia?: string;
  provinceid?: number; // for write operations (backend expects lowercase id)
}

export interface ListaLocalidadesResponse {
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  data: LocalidadDTO[];
}

export async function getListaLocalidades() {
  const { data } = await axiosBackend.get<LocalidadDTO[]>(
    "Localidades/GetListaLocalidades"
  );
  return data;
}

export async function getListaLocalidadesPaginated(page: number = 1, pageSize: number = 5) {
  const { data } = await axiosBackend.get<ListaLocalidadesResponse>(
    "Localidades/GetListaLocalidades",
    { params: { page, pageSize } }
  );
  return data;
}

export async function getLocalidadById(id: number) {
  const { data } = await axiosBackend.get<LocalidadDTO>(
    `Localidades/GetListaLocalidadesById/${id}`
  );
  return data;
}

export async function crearLocalidad(payload: { name: string; active?: boolean; provinceid: number }) {
  const { data } = await axiosBackend.post(
    "Localidades/CrearLocalidad",
    payload
  );
  return data;
}

export async function actualizarLocalidad(payload: { id: number; name: string; active?: boolean; provinceid: number }) {
  const { id, ...body } = payload;
  const { data } = await axiosBackend.put(
    `Localidades/ActualizarLocalidad/${id}`,
    body
  );
  return data;
}

export async function eliminarLocalidad(id: number) {
  const { data } = await axiosBackend.delete(
    `Localidades/EliminarLocalidad/${id}`
  );
  return data;
}


