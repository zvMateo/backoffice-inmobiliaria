import { axiosBackend } from "@/request/Properties";
import type { GetPropierties } from "@/types/property";

export interface DashboardCounts {
  propiedades: number;
  tiposPropiedades: number;
  tiposOperaciones: number;
  provincias: number;
  zonas: number;
  monedas: number;
}

export async function getCountDashboard() {
  const { data } = await axiosBackend.get<DashboardCounts>(
    "Inmobiliaria/GetCountDashboard"
  );
  return data;
}

export async function getListaPropiedadesInmo() {
  const { data } = await axiosBackend.get<GetPropierties[]>(
    "Inmobiliaria/GetListaPropiedades"
  );
  return data;
}

export async function getListaPropiedadesByIdInmo(id: number | string) {
  const { data } = await axiosBackend.get<GetPropierties>(
    `Inmobiliaria/GetListaPropiedadesById/${id}`
  );
  return data;
}


