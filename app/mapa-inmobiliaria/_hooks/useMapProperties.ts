"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { PropertyFilters, GetPropiertiesMap } from "@/types/property";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPropiedadesByFilter } from "@/request/Properties";
import { useFilterOptions } from "@/app/mapa-inmobiliaria/_hooks/useFilterOptions";

export function useMapProperties() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const parseFiltersFromParams = (): PropertyFilters => {
    const getArray = (key: string) =>
      (searchParams.get(key)?.split(",").filter(Boolean) as any) || undefined;
    const num = (v: string | null) => (v ? Number(v) : undefined);
    const priceMin = num(searchParams.get("priceMin"));
    const priceMax = num(searchParams.get("priceMax"));
    const areaMin = num(searchParams.get("areaMin"));
    const areaMax = num(searchParams.get("areaMax"));

    return {
      type: getArray("type"),
      operation: getArray("operation"),
      city: getArray("city"),
      priceRange:
        priceMin !== undefined || priceMax !== undefined
          ? { min: priceMin || 0, max: priceMax || 0 }
          : undefined,
      areaRange:
        areaMin !== undefined || areaMax !== undefined
          ? { min: areaMin || 0, max: areaMax || 0 }
          : undefined,
      bedrooms: getArray("bedrooms")?.map((x: string) => Number(x)) as any,
      bathrooms: getArray("bathrooms")?.map((x: string) => Number(x)) as any,
      currency: (searchParams.get("currency") as any) || undefined,
      features: getArray("features"),
    };
  };

  const [filters, setFilters] = useState<PropertyFilters>(() => {
    // 1) Inicial: URL -> luego localStorage si existe
    const fromUrl = parseFiltersFromParams();
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem("mapFilters")
          : null;
      if (raw) {
        const stored = JSON.parse(raw) as PropertyFilters;
        return { ...fromUrl, ...stored };
      }
    } catch {}
    return fromUrl;
  });
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const { types, operations, cities } = useFilterOptions();

  // Normalizadores de valores UI -> Backend
  const mapTypeToBackend = (t: string) => {
    const n = t.trim().toLowerCase();
    const dict: Record<string, string> = {
      casa: "Casa",
      duplex: "Duplex",
      departamento: "Departamento",
      oficina: "Oficina",
      local: "Local Comercial",
      "local comercial": "Local Comercial",
      terreno: "Terreno",
      campo: "Campo",
    };
    return dict[n] ?? t;
  };

  const mapOperationToBackend = (o: string) => {
    const n = o.trim().toLowerCase();
    const dict: Record<string, string> = {
      venta: "Venta",
      compra: "Compra",
      "alquiler mensual": "Alquiler mensual",
      "alquiler diario/temporal": "Alquiler diario/temporal",
      "alquiler temporal": "Alquiler diario/temporal",
    };
    return dict[n] ?? o;
  };

  const mapCityToBackend = (c: string) => {
    const n = c.trim().toLowerCase();
    const dict: Record<string, string> = {
      "córdoba capital": "Cordoba Capital",
      "cordoba capital": "Cordoba Capital",
      "villa del rosario": "Villa del Rosario",
    };
    return dict[n] ?? c;
  };

  // Helper para encontrar ID por label (normalizado)
  const findIdByLabel = (
    arr: { id: number; label: string }[],
    label: string
  ) => {
    const norm = (s: string) => s.trim().toLowerCase();
    const found = arr.find((o) => norm(o.label) === norm(label));
    return found?.id;
  };

  // Convertir filtros UI a formato del backend (ahora acepta arrays de IDs)
  const convertFiltersToBackend = (filters: PropertyFilters) => {
    const backendFilters: any = {};

    // Tipos de propiedad: array de IDs
    if (filters.type && filters.type.length > 0 && types.length > 0) {
      const typeIds: number[] = [];
      filters.type.forEach((t) => {
        const mappedLabel = mapTypeToBackend(t);
        const id = findIdByLabel(types, mappedLabel);
        if (typeof id === "number") typeIds.push(id);
      });
      if (typeIds.length > 0) backendFilters.tipoPropiedadId = typeIds;
    }

    // Tipos de operación: array de IDs
    if (
      filters.operation &&
      filters.operation.length > 0 &&
      operations.length > 0
    ) {
      const operationIds: number[] = [];
      filters.operation.forEach((o) => {
        const mappedLabel = mapOperationToBackend(o);
        const id = findIdByLabel(operations, mappedLabel);
        if (typeof id === "number") operationIds.push(id);
      });
      if (operationIds.length > 0)
        backendFilters.tipoOperacionId = operationIds;
    }

    // Localidades: array de IDs
    if (filters.city && filters.city.length > 0 && cities.length > 0) {
      const cityIds: number[] = [];
      filters.city.forEach((c) => {
        const mappedLabel = mapCityToBackend(c);
        const id = findIdByLabel(cities, mappedLabel);
        if (typeof id === "number") cityIds.push(id);
      });
      if (cityIds.length > 0) backendFilters.localidadId = cityIds;
    }

    // Precio: precioMin, precioMax (numbers)
    if (filters.priceRange) {
      if (filters.priceRange.min > 0)
        backendFilters.precioMin = filters.priceRange.min;
      if (filters.priceRange.max > 0)
        backendFilters.precioMax = filters.priceRange.max;
    }

    // Superficie: superficieMin, superficieMax (integers)
    if (filters.areaRange) {
      if (filters.areaRange.min > 0)
        backendFilters.superficieMin = Math.floor(filters.areaRange.min);
      if (filters.areaRange.max > 0)
        backendFilters.superficieMax = Math.floor(filters.areaRange.max);
    }

    // Habitaciones: solo el primer valor (backend acepta 1 integer)
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      backendFilters.habitaciones = filters.bedrooms[0];
    }

    // Features: mapeo a booleanos específicos del backend
    if (filters.features && filters.features.length > 0) {
      const featureMap: Record<string, string> = {
        garage: "cochera",
        cochera: "cochera",
        parking: "cochera",
        terrace: "terraza",
        terraza: "terraza",
        balcon: "terraza",
        pets: "mascotas",
        mascotas: "mascotas",
        furnished: "amoblado",
        amoblado: "amoblado",
      };
      filters.features.forEach((f) => {
        const key = featureMap[f.toLowerCase()];
        if (key) backendFilters[key] = true;
      });
    }

    return backendFilters;
  };

  // Query con React Query - un único request con arrays de IDs
  const getProperties = useQuery({
    queryKey: ["map-properties", filters],
    queryFn: async () => {
      const backendFilters = convertFiltersToBackend(filters);
      console.log("🔍 [MAP] Filtros enviados al backend:", backendFilters);

      const data = await getPropiedadesByFilter(backendFilters);
      console.log("🔍 [MAP] Propiedades recibidas:", data.length);

      return data;
    },
    staleTime: 1000 * 30, // Reducido a 30 segundos para mayor reactividad
    enabled: types.length > 0 && operations.length > 0 && cities.length > 0, // Esperar a que carguen las opciones
  });

  // Convertir datos del backend al formato del mapa
  const convertedProperties = useMemo(() => {
    if (!getProperties.data) return [];

    const converted = getProperties.data.map((property: GetPropiertiesMap) => {
      // Extraer precio y moneda del string formateado (backend puede devolver 'precio' formateado o 'price' numérico)
      const priceString =
        (property as any).precio ?? String(property.price ?? "0");
      const priceMatch =
        typeof priceString === "string"
          ? priceString.match(/([A-Z$]+)\s*([\d,]+\.?\d*)/)
          : null;
      const currency = priceMatch
        ? (priceMatch[1] as any)
        : (property as any).currency ?? "USD";
      const price = priceMatch
        ? parseFloat(priceMatch[2].replace(/,/g, ""))
        : Number(property.price ?? 0);

      const rawType =
        (property as any).typeproperty ||
        (property as any).tipoPropiedad ||
        (property as any).type ||
        "casa";
      const normType = String(rawType).trim().toLowerCase();

      // Mapear operación desde el backend
      const rawOperation =
        (property as any).operationproperty ||
        (property as any).tipoOperacion ||
        (property as any).operation ||
        "venta";
      const normOperation = String(rawOperation).trim().toLowerCase();

      const mappedProperty = {
        id: String(property.id),
        title: property.name || "Propiedad",
        type: normType as any,
        operation: normOperation as any,
        price: price,
        currency: currency as any,
        coordinates: {
          lat: Number(property.lat) || -31.4201, // Córdoba por defecto si no hay coordenadas
          lng: Number(property.lng) || -64.1888,
        },
        address: property.zone || "",
        city: (property.zone || "Córdoba Capital") as any,
        photos: ["/placeholder.jpg"], // Placeholder
        description: "",
        area: Number(property.size) || 0,
        bedrooms: Number(property.room) || 0,
        bathrooms: 0, // No disponible en GetPropiertiesMap
        features: [
          ...(property.parking ? ["garage"] : []),
          ...(property.furnished ? ["furnished"] : []),
          ...(property.pet ? ["pet-friendly"] : []),
          ...(property.terrace ? ["terrace"] : []),
        ],
      };

      return mappedProperty;
    });

    return converted;
  }, [getProperties.data]);

  // Debounce update URL when filters change
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Guardar en localStorage
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("mapFilters", JSON.stringify(filters));
        }
      } catch {}

      const params = new URLSearchParams(searchParams.toString());

      const setOrDelete = (key: string, value?: string | string[]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
          return;
        }
        params.set(key, Array.isArray(value) ? value.join(",") : value);
      };

      setOrDelete("type", filters.type as any);
      setOrDelete("operation", filters.operation as any);
      setOrDelete("city", filters.city as any);
      if (filters.priceRange) {
        params.set("priceMin", String(filters.priceRange.min));
        params.set("priceMax", String(filters.priceRange.max));
      } else {
        params.delete("priceMin");
        params.delete("priceMax");
      }
      if (filters.areaRange) {
        params.set("areaMin", String(filters.areaRange.min));
        params.set("areaMax", String(filters.areaRange.max));
      } else {
        params.delete("areaMin");
        params.delete("areaMax");
      }
      setOrDelete("bedrooms", (filters.bedrooms as any)?.map(String));
      setOrDelete("bathrooms", (filters.bathrooms as any)?.map(String));
      setOrDelete("currency", filters.currency as any);
      setOrDelete("features", filters.features as any);

      router.replace(pathname + "?" + params.toString());
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, searchParams, router, pathname]);

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    properties: convertedProperties,
    allProperties: convertedProperties,
    totalCount: convertedProperties.length,
    loading: getProperties.isLoading,
    error: getProperties.error?.message || null,
    filters,
    updateFilters,
    clearFilters,
    selectedProperty,
    setSelectedProperty,
    // Debug info (solo desarrollo)
    _debug: {
      backendFilters: convertFiltersToBackend(filters),
      rawResponse: getProperties.data,
      optionsData: { types, operations, cities },
    },
  };
}
