import { axiosBackend } from "@/request/Properties";

export interface MonedaDTO {
  id: number;
  name: string;
  code?: string; // e.g., USD, ARS
}

export interface ListaMonedasResponse {
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  data: MonedaDTO[];
}

export async function getListaMonedas() {
  const { data } = await axiosBackend.get<MonedaDTO[]>(
    "Monedas/GetListaMonedas"
  );
  return data;
}

export async function getListaMonedasPaginated(page: number = 1) {
  const { data } = await axiosBackend.get<ListaMonedasResponse>(
    "Monedas/GetListaMonedas",
    { params: { page } }
  );
  return data;
}

export async function getMonedaById(id: number) {
  const { data } = await axiosBackend.get<MonedaDTO>(
    "Monedas/GetListaMonedasById",
    { params: { id } }
  );
  return data;
}

export async function crearMoneda(payload: Partial<MonedaDTO>) {
  const { data } = await axiosBackend.post(
    "Monedas/CrearMoneda",
    payload
  );
  return data;
}

export async function actualizarMoneda(id: number, payload: Partial<MonedaDTO>) {
  const { data } = await axiosBackend.put(
    `Monedas/ActualizarMoneda/${id}`,
    payload
  );
  return data;
}

export async function eliminarMoneda(id: number) {
  const { data } = await axiosBackend.delete(
    `Monedas/EliminarMoneda/${id}`
  );
  return data;
}


