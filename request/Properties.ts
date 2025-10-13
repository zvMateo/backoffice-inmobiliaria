import axios, { AxiosInstance } from 'axios';
import {GetLocalities, GetPropierties, GetTypesFilters, GetPropiertiesMap } from "@/types/property";

// Base URL del backend
// Prioriza variables públicas para el navegador; de lo contrario usa BACKEND_BASE_URL (server).
const ENV_BASE_URL = (typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || process.env.BACKEND_BASE_URL)
  : process.env.BACKEND_BASE_URL) as string | undefined;

function ensureTrailingSlash(url: string) {
  return url.endsWith('/') ? url : `${url}/`;
}

if (!ENV_BASE_URL) {
  // Sin fallback: requerimos que se configure por env
  // Nota: axios fallará sin baseURL; preferimos avisar explícitamente.
  // eslint-disable-next-line no-console
  console.warn('BACKEND BASE URL no configurada. Definí NEXT_PUBLIC_BACKEND_BASE_URL o BACKEND_BASE_URL en .env.local');
}

const BASE_URL = ENV_BASE_URL ? ensureTrailingSlash(ENV_BASE_URL) : undefined as unknown as string;

// Cliente Axios preconfigurado
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
  timeout: 20000,
  // paramsSerializer: arrays como claves repetidas (?a=1&a=2) para ASP.NET
  paramsSerializer: {
    serialize: (params: Record<string, any>) => {
      const sp = new URLSearchParams();
      Object.entries(params || {}).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => sp.append(key, String(v)));
        } else if (value !== undefined && value !== null) {
          sp.append(key, String(value));
        }
      });
      return sp.toString();
    },
  },
});

// Nota: la serialización de arrays se maneja con paramsSerializer arriba

// GET /api/propiedades/GetListaPropiedades
export async function getListaPropiedades(): Promise<GetPropierties[]> {
  const { data } = await api.get<GetPropierties[]>('propiedades/GetListaPropiedades');
  return data;
}

export { api as axiosBackend };

// GET ID /api/propiedades/GetPropiedadById
//NO ESTA EN USO
export async function getPropiedadById(id: string): Promise<GetPropierties> {
  const { data } = await api.get<GetPropierties>(`propiedades/GetListaPropiedadesById/${id}`);
  return data;
}

// GET /api/Mapa/GetPropiedadById/{id}
export async function getPropiedadMapaById(id: string) {
  const { data } = await api.get(`Mapa/GetPropiedad/${id}`);
  return data;
}

//GET /api/Localidades/GetListaLocalidades
export async function getListaLocalidades(): Promise<GetLocalities[]> {
  const { data } = await api.get<GetLocalities[]>(`localidades/GetListaLocalidades`);
  return data;
}

// GET /api/Mapa/GetPropiedadesByFilter
export async function getPropiedadesByFilter(filters?: any): Promise<GetPropiertiesMap[]> {
  const { data } = await api.get<GetPropiertiesMap[]>(`Mapa/GetPropiedadesByFilter`, { params: filters });
  return data;
}

export async function getTypesFilters(filters?: any): Promise<GetTypesFilters> {
  const { data } = await api.get<GetTypesFilters>(`Mapa/GetFiltros`, { params: filters });
  return data;
}
