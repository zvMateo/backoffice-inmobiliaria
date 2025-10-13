import { axiosBackend } from "@/request/Properties";

export interface TipoOperacionDTO {
  id?: number;
  name: string;
  active: boolean;
}

export async function getListaTiposOperaciones(): Promise<TipoOperacionDTO[]> {
  const { data } = await axiosBackend.get("/Typesoperaciones/GetListaTiposOperaciones");
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function getTipoOperacionById(id: number): Promise<TipoOperacionDTO> {
  const { data } = await axiosBackend.get(`/Typesoperaciones/GetListaTiposOperacionesById/${id}`);
  return data;
}

export async function crearTipoOperacion(payload: Omit<TipoOperacionDTO, "id">): Promise<void> {
  await axiosBackend.post(`/Typesoperaciones/CrearTipoOperacion`, payload);
}

export async function actualizarTipoOperacion(payload: TipoOperacionDTO): Promise<void> {
  if (!payload.id) throw new Error("Falta id");
  await axiosBackend.put(`/Typesoperaciones/ActualizarTipoOperacion`, payload);
}

export async function eliminarTipoOperacion(id: number): Promise<void> {
  await axiosBackend.delete(`/Typesoperaciones/EliminarTipoOperacion/${id}`);
}


