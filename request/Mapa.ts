import { axiosBackend } from "@/request/Properties";

export interface MapaFiltrosResponse {
  propiedades: Array<{
    id: number;
    name: string;
  }>;
  operationsType: Array<{
    id: number;
    name: string;
  }>;
  locality: Array<{
    id: number;
    name: string;
    provinceid: number;
  }>;
  provincias: Array<{
    id: number;
    name: string;
  }>;
}

export async function getFiltros() {
  const { data } = await axiosBackend.get<MapaFiltrosResponse>(
    "Mapa/GetFiltros"
  );
  return data;
}



