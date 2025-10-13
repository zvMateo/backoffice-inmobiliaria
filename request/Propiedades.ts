import { axiosBackend } from "@/request/Properties";

export interface PropiedadListadoItemDTO {
  id: number;
  nombre: string;
  tipo: string;
  zona: string | null;
  precio: string; // formateado
}

export interface ListaPropiedadesResponse {
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  data: PropiedadListadoItemDTO[];
}

export interface PropiedadesFilters {
  page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateUpdatePropiedadPayload {
  name: string;
  detail: string;
  typepropertyid: number;
  operationpropertyid: number;
  zoneid: number;
  currencyid: number;
  price: number;
  room: number;
  size: number;
  furnished: boolean;
  pet: boolean;
  parking: boolean;
  terrace: boolean;
  address: string;
  lat: string;
  lng: string;
  whatsapp: string;
  email: string;
  active: boolean;
  imagenes: string[];
}

export async function getListaPropiedadesPaginado(
  filters: PropiedadesFilters = {}
) {
  try {
    const { page = 1, search, sortBy, sortOrder } = filters;

    // Construir parámetros de consulta
    const params: any = { page };
    if (search && search.trim()) params.search = search.trim();
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    console.log("🔍 Iniciando petición GetListaPropiedades:", {
      params,
      baseURL: axiosBackend.defaults.baseURL,
      authHeader: axiosBackend.defaults.headers.common["Authorization"]
        ? "Presente"
        : "Ausente",
    });

    const { data } = await axiosBackend.get("Propiedades/GetListaPropiedades", {
      params,
    });

    // Debug: ver qué devuelve exactamente el endpoint
    console.log("✅ Respuesta del endpoint GetListaPropiedades:", {
      params,
      data,
      hasData: !!data,
      dataType: typeof data,
      keys: data ? Object.keys(data) : null,
      itemsLength: data?.items?.length || 0,
      totalItems: data?.totalItems || 0,
      currentPage: data?.currentPage,
      totalPages: data?.totalPages,
    });

    // El endpoint devuelve el formato: { currentPage, totalPages, pageSize, totalItems, items }
    if (data && data.items && Array.isArray(data.items)) {
      // Mapear al formato esperado por la tabla
      const mappedItems = data.items.map((prop: any) => ({
        id: prop.id,
        nombre: prop.name || prop.nombre || "Sin título",
        tipo: prop.tipo || "Sin tipo",
        zona: prop.zona || "Sin zona",
        precio: prop.precio || "Sin precio",
      }));

      return {
        totalRegistros: data.totalItems || 0,
        paginaActual: data.currentPage || 1,
        tamanoPagina: data.pageSize || 5,
        totalPaginas: data.totalPages || 1,
        data: mappedItems,
      } as ListaPropiedadesResponse;
    }

    // Fallback para formato no esperado
    console.warn("⚠️ Formato de respuesta no esperado:", data);
    return {
      totalRegistros: 0,
      paginaActual: 1,
      tamanoPagina: 5,
      totalPaginas: 1,
      data: [],
    } as ListaPropiedadesResponse;
  } catch (error: any) {
    console.error("❌ Error al obtener propiedades:", {
      params: filters,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      authHeaderPresent:
        !!axiosBackend.defaults.headers.common["Authorization"],
    });
    throw error;
  }
}

export async function getPropiedadById(id: number | string) {
  try {
    console.log("🔍 Obteniendo propiedad por ID:", {
      id,
      endpoint: `Propiedades/GetListaPropiedadesById/${id}`,
    });

    const { data } = await axiosBackend.get(
      `Propiedades/GetListaPropiedadesById/${id}`
    );

    console.log("✅ Propiedad obtenida por ID:", { id, data });
    return data;
  } catch (error: any) {
    console.error("❌ Error al obtener propiedad por ID:", {
      id,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
}

export async function createPropiedad(payload: CreateUpdatePropiedadPayload) {
  try {
    console.log("🔄 Creando nueva propiedad:", {
      payload,
      endpoint: "Propiedades/CreatePropiedades",
    });

    const { data } = await axiosBackend.post(
      "Propiedades/CreatePropiedades",
      payload
    );

    console.log("✅ Propiedad creada exitosamente:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error al crear propiedad:", {
      payload,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
}

export async function updatePropiedad(
  id: number | string,
  payload: CreateUpdatePropiedadPayload
) {
  try {
    console.log("🔄 Actualizando propiedad:", {
      id,
      payload,
      endpoint: `Propiedades/UpdatePropiedades/${id}`,
    });

    const { data } = await axiosBackend.put(
      `Propiedades/UpdatePropiedades/${id}`,
      payload
    );

    console.log("✅ Propiedad actualizada exitosamente:", { id, data });
    return data;
  } catch (error: any) {
    console.error("❌ Error al actualizar propiedad:", {
      id,
      payload,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
}

export async function deletePropiedad(id: number | string) {
  try {
    console.log("🗑️ Eliminando propiedad:", {
      id,
      endpoint: `Propiedades/DeleteListaPropiedadesById/${id}`,
    });

    const { data } = await axiosBackend.delete(
      `Propiedades/DeleteListaPropiedadesById/${id}`
    );

    console.log("✅ Propiedad eliminada exitosamente:", { id, data });
    return data;
  } catch (error: any) {
    console.error("❌ Error al eliminar propiedad:", {
      id,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
}
