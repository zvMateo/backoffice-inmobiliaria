"use client";

import { useState, useRef } from "react";
import { PropertyMap } from "@/app/mapa-inmobiliaria/_components/property-map";
import { PropertyFilterComponent } from "@/app/mapa-inmobiliaria/_components/property-filters";
import { MobileFilters } from "@/app/mapa-inmobiliaria/_components/mobile-filters";
import { AddressSearch } from "@/app/mapa-inmobiliaria/_components/address-search";
import { MapSkeleton } from "@/app/mapa-inmobiliaria/_components/map-skeleton";
import { ApiError } from "@/app/mapa-inmobiliaria/_components/api-error";
import { useMapProperties } from "@/app/mapa-inmobiliaria/_hooks/useMapProperties";
import { ClientOnly } from "@/app/mapa-inmobiliaria/_components/client-only";
import { DebugInfo } from "@/app/mapa-inmobiliaria/_components/debug-info";

interface MapaInmobiliarioProps {
  // Props para personalización
  className?: string;
  height?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  onPropertySelect?: (property: any) => void;
  // Props para datos externos
  properties?: any[];
  filters?: any;
  onFiltersChange?: (filters: any) => void;
}

export function MapaInmobiliario({
  className = "",
  height = "100%",
  showFilters = true,
  showSearch = false,
  onPropertySelect,
  properties: externalProperties,
  filters: externalFilters,
  onFiltersChange: externalOnFiltersChange,
}: MapaInmobiliarioProps) {
  // Usar datos externos o internos
  const internalProperties = useMapProperties();

  const {
    properties,
    allProperties,
    filters,
    loading,
    error,
    updateFilters,
    clearFilters,
    selectedProperty,
    setSelectedProperty,
  } = externalProperties
    ? {
        properties: externalProperties,
        allProperties: externalProperties,
        filters: externalFilters || {},
        loading: false,
        error: null,
        updateFilters: externalOnFiltersChange || (() => {}),
        clearFilters: () => externalOnFiltersChange?.({}),
        selectedProperty: null,
        setSelectedProperty: onPropertySelect || (() => {}),
      }
    : internalProperties;

  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const handleAddressSearch = (place: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => {
    setSearchLocation({
      lat: place.lat,
      lng: place.lng,
      address: place.address,
    });
  };

  // viewport persisted in URL
  const [viewport, setViewport] = useState<{
    center?: { lat: number; lng: number };
    zoom?: number;
  }>({});
  const resetBoundsRef = useRef<() => void | null>(null as any);

  // Control de visibilidad de barra superior durante interacción
  const [isInteracting, setIsInteracting] = useState(false);

  // Manejo de errores
  if (error) {
    return (
      <div
        className={`flex flex-col lg:flex-row bg-background overflow-hidden ${className}`}
        style={{ height }}
      >
        <ApiError error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col lg:flex-row bg-background overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Sidebar de Filtros */}
      {showFilters && (
        <div className="hidden lg:flex lg:flex-shrink-0 lg:w-80 p-4 overflow-y-auto">
          <PropertyFilterComponent
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
            totalProperties={allProperties.length}
            filteredCount={properties.length}
            onAddressSearch={handleAddressSearch}
          />
        </div>
      )}

      {/* Contenedor del Mapa */}
      <div className="flex-1 relative">
        {/* Barra de Búsqueda y Filtros (responsive) */}
        <div
          className={`absolute top-3 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-2xl lg:left-auto lg:right-4 lg:translate-x-0 lg:w-[28rem] z-40 transition-opacity duration-200 ${
            isInteracting ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex gap-2 lg:flex-col">
            {/* Búsqueda */}
            {showSearch && (
              <div
                className={`bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg border p-1.5 sm:p-2 transition-all duration-300 flex-1 ${
                  searchLocation
                    ? "border-primary shadow-primary/20 ring-2 ring-primary/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <AddressSearch
                  onLocationSelect={(location) => {
                    setSearchLocation(location);
                  }}
                  onClear={() => setSearchLocation(null)}
                />
                {searchLocation && (
                  <div className="mt-2 px-2 py-1 bg-primary/10 rounded text-xs text-primary font-medium">
                    📍 {searchLocation.address}
                  </div>
                )}
              </div>
            )}

            {/* Filtros Móviles - a la derecha de la búsqueda en móvil */}
            <div className="lg:hidden flex-shrink-0">
              <MobileFilters
                filters={filters}
                onFiltersChange={updateFilters}
                onClearFilters={clearFilters}
                totalProperties={allProperties.length}
                filteredCount={properties.length}
              />
            </div>
          </div>
        </div>

        {/* Mapa */}
        <ClientOnly fallback={<MapSkeleton />}>
          <PropertyMap
            properties={properties}
            selectedProperty={selectedProperty}
            onPropertySelect={setSelectedProperty}
            searchLocation={searchLocation}
            onViewportChange={({ center, zoom }) => {
              setViewport({ center, zoom });
              const params = new URLSearchParams(window.location.search);
              params.set("lat", String(center.lat));
              params.set("lng", String(center.lng));
              params.set("zoom", String(zoom));
              const url = `${window.location.pathname}?${params.toString()}`;
              window.history.replaceState(null, "", url);
            }}
            onResetBoundsRef={(fn) => {
              resetBoundsRef.current = fn;
            }}
            onInteractionStart={() => setIsInteracting(true)}
            onInteractionEnd={() => setIsInteracting(false)}
          />
        </ClientOnly>

        {/* Controles inferiores minimalistas */}
        <div className="absolute bottom-4 left-4 right-4 lg:right-auto z-10">
          <div className="bg-white/95 rounded-lg border px-2 py-2 flex items-center justify-between gap-2">
            <p className="text-sm text-foreground">
              {loading
                ? "Cargando..."
                : `${properties.length} propiedad${
                    properties.length !== 1 ? "es" : ""
                  } encontrada${properties.length !== 1 ? "s" : ""}`}
            </p>
            <div className="flex items-center">
              <div className="inline-flex rounded-md border overflow-hidden">
                <button
                  className="text-xs px-2 py-1 hover:bg-muted"
                  onClick={() => resetBoundsRef.current?.()}
                  aria-label="Restablecer vista"
                >
                  Reset
                </button>
                <div className="w-px bg-border" />
                <button
                  className="text-xs px-2 py-1 hover:bg-muted"
                  onClick={() => {
                    if (!navigator.geolocation) return;
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const lat = pos.coords.latitude;
                      const lng = pos.coords.longitude;
                      setSearchLocation({ lat, lng, address: "Mi ubicación" });
                    });
                  }}
                  aria-label="Ir a mi ubicación"
                >
                  Ubicación
                </button>
              </div>
            </div>
          </div>
          {/* Estado sin resultados */}
          {!loading && properties.length === 0 && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>Sin resultados con los filtros actuales</span>
              <button
                className="px-2 py-1 border rounded hover:bg-muted"
                onClick={() => clearFilters()}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
