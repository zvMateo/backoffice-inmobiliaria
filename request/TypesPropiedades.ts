import { axiosBackend } from "@/request/Properties";

export interface TipoPropiedadDTO {
  id?: number;
  name: string;
  active: boolean;
}

export interface ListaTiposPropiedadesResponse {
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  data: TipoPropiedadDTO[];
}

export async function getListaTiposPropiedades(): Promise<TipoPropiedadDTO[]> {
  const { data } = await axiosBackend.get(
    "/Typespropiedades/GetListaTiposPropiedades"
  );
  return Array.isArray(data) ? data : data?.data ?? [];
}

export async function getListaTiposPropiedadesPaginated(page: number = 1) {
  const { data } = await axiosBackend.get<ListaTiposPropiedadesResponse>(
    "/Typespropiedades/GetListaTiposPropiedades",
    { params: { page } }
  );
  return data;
}

export async function getTipoPropiedadById(id: number): Promise<TipoPropiedadDTO> {
  const { data } = await axiosBackend.get(
    `/Typespropiedades/GetListaTiposPropiedadesById`,
    { params: { Id: id } }
  );
  return data;
}

export async function crearTipoPropiedad(payload: Omit<TipoPropiedadDTO, "id">): Promise<void> {
  await axiosBackend.post("/Typespropiedades/CrearTipoPropiedad", payload);
}

export async function actualizarTipoPropiedad(payload: TipoPropiedadDTO): Promise<void> {
  if (!payload.id) throw new Error("Falta id");
  const { id, name, active } = payload;
  await axiosBackend.put(`/Typespropiedades/ActualizarTipoPropiedad/${id}`, { name, active });
}

export async function eliminarTipoPropiedad(id: number): Promise<void> {
  await axiosBackend.delete(`/Typespropiedades/EliminarTipoPropiedad/${id}`);
}


