"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Property } from "@/types/property";
import { PropertyInfoCardById } from "@/app/mapa-inmobiliaria/_components/property-info-card-by-id";
import { PropertyDetailById } from "@/app/mapa-inmobiliaria/_components/property-detail-by-id";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useResponsiveInfoWindow } from "@/app/mapa-inmobiliaria/_hooks/useResponsiveInfoWindow";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

// Contenedor del mapa: ocupa todo el espacio disponible del padre
const mapContainerStyle = {
  width: "100%",
  height: "100%",
} as const;

const center = {
  lat: -31.4167,
  lng: -64.1833,
};

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;

// Base options without styles (styles conflict with mapId)
const baseOptions = {
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  backgroundColor: "#ffffff",
};

// Fallback styles for when no mapId is provided
const fallbackStyles = [
  { elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4b5563" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#e5e7eb" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#374151" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#f3f4f6" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#e5e7eb" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d1d5db" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b7280" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#eff6ff" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b7280" }],
  },
];

// Final options - use mapId if available, otherwise use styles
const options = MAP_ID
  ? { ...baseOptions, mapId: MAP_ID }
  : { ...baseOptions, styles: fallbackStyles };

// Static libraries array to prevent reloads
const LIBRARIES: (
  | "marker"
  | "places"
  | "geometry"
  | "drawing"
  | "visualization"
)[] = ["marker"];

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property | null) => void;
  searchLocation?: { lat: number; lng: number; address: string } | null;
  onViewportChange?: (state: {
    center: google.maps.LatLngLiteral;
    zoom: number;
  }) => void;
  onResetBoundsRef?: (fn: () => void) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export function PropertyMap({
  properties,
  selectedProperty,
  onPropertySelect,
  searchLocation,
  onViewportChange,
  onResetBoundsRef,
  onInteractionStart,
  onInteractionEnd,
}: PropertyMapProps) {
  // Usar nuestro hook personalizado para Google Maps
  const { isLoaded, loadError } = useGoogleMaps();

  const infoWindowMaxWidth = useResponsiveInfoWindow();
  const mapRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactOptions, setContactOptions] = useState<{
    wa?: string;
    email?: string;
    title?: string;
  } | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (onResetBoundsRef) {
      onResetBoundsRef(() => fitMapToProperties(properties));
    }
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    // Limpiar clusterer y marcadores
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }
    markersRef.current = [];
  }, []);

  // Función para crear marcadores y aplicar clustering
  const createMarkersAndCluster = useCallback(() => {
    if (!mapRef.current || !isLoaded || properties.length === 0) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Limpiar clusterer existente
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }

    // Crear marcadores
    const markers = properties.map((property) => {
      const marker = new google.maps.Marker({
        position: property.coordinates,
        icon: getMarkerIcon(property),
        title: `Propiedad ${property.id}`,
        map: mapRef.current,
      });

      // Agregar listener de click
      marker.addListener("click", () => {
        handleMarkerClick(property);
      });

      return marker;
    });

    markersRef.current = markers;

    // Crear clusterer
    clustererRef.current = new MarkerClusterer({
      map: mapRef.current,
      markers: markers,
      renderer: {
        render: ({ count, position }) => {
          const color =
            count < 10 ? "#4285f4" : count < 50 ? "#f59e0b" : "#ef4444";
          const size = count < 10 ? 40 : count < 50 ? 50 : 60;

          return new google.maps.Marker({
            position,
            icon: {
              url: `data:image/svg+xml,${encodeURIComponent(`
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="${size / 2}" cy="${size / 2}" r="${
                size / 2 - 2
              }" fill="${color}" stroke="white" stroke-width="2"/>
                  <text x="${size / 2}" y="${
                size / 2
              }" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="${
                size / 3
              }" font-weight="bold" fill="white">${count}</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(size, size),
              anchor: new google.maps.Point(size / 2, size / 2),
            },
            title: `${count} propiedades en esta área`,
            zIndex: 1000,
          });
        },
      },
    });
  }, [properties, isLoaded]);

  // Efecto para crear marcadores cuando cambian las propiedades
  useEffect(() => {
    createMarkersAndCluster();
  }, [createMarkersAndCluster]);

  const handleMarkerClick = (property: Property) => {
    onPropertySelect(property);
  };

  const handleInfoWindowClose = () => {
    onPropertySelect(null);
  };

  const handleMapClick = () => {
    onPropertySelect(null);
  };

  const handleIdle = () => {
    // Señala fin de interacción
    onInteractionEnd?.();
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    const zoom = mapRef.current.getZoom() || 10;
    if (center && onViewportChange) {
      onViewportChange({
        center: { lat: center.lat(), lng: center.lng() },
        zoom,
      });
    }
  };

  // Auto-fit bounds when properties change
  const fitMapToProperties = useCallback((properties: Property[]) => {
    if (!mapRef.current || properties.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    properties.forEach((property) => {
      bounds.extend(property.coordinates);
    });

    // Add some padding to the bounds
    mapRef.current.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    });
  }, []);

  // Effect to auto-fit when properties change
  useEffect(() => {
    if (properties.length > 0) {
      // Small delay to ensure map is ready
      const timer = setTimeout(() => {
        fitMapToProperties(properties);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [properties, fitMapToProperties]);

  // Effect to center map on search location
  useEffect(() => {
    if (searchLocation && mapRef.current) {
      const location = new google.maps.LatLng(
        searchLocation.lat,
        searchLocation.lng
      );
      mapRef.current.setCenter(location);
      mapRef.current.setZoom(15); // Zoom in on the searched location
    }
  }, [searchLocation]);

  const getMarkerIcon = (property: Property) => {
    const colors = {
      casa: "#22c55e",
      departamento: "#3b82f6",
      duplex: "#10b981",
      oficina: "#f59e0b",
      local: "#ef4444",
      terreno: "#8b5cf6",
      campo: "#06b6d4",
    } as const;

    const fill = colors[property.type as keyof typeof colors] || "#64748b"; // fallback slate
    // SVG sin cabecera XML para mayor compatibilidad
    const svg = `<svg width="40" height="56" viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <path d="M20 54c7-11 18-19 18-32C38 10.954 29.046 2 20 2S2 10.954 2 22c0 13 11 21 18 32z" fill="${fill}" stroke="#ffffff" stroke-width="2"/>
    <circle cx="20" cy="22" r="6" fill="#ffffff"/>
  </g>
  <circle cx="20" cy="22" r="3.5" fill="${fill}"/>
</svg>`;

    return {
      url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(40, 56),
      anchor: new google.maps.Point(20, 54),
      labelOrigin: new google.maps.Point(20, 22),
    } as google.maps.Icon;
  };

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="text-destructive mb-2">Error al cargar el mapa</div>
          <div className="text-sm text-muted-foreground">{loadError}</div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-muted-foreground">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        onIdle={handleIdle}
        onDragStart={() => onInteractionStart?.()}
        onZoomChanged={() => onInteractionStart?.()}
        options={options}
      >
        {/* Los marcadores se crean automáticamente en createMarkersAndCluster */}

        {selectedProperty && (
          <InfoWindow
            position={selectedProperty.coordinates}
            onCloseClick={handleInfoWindowClose}
            options={{
              pixelOffset: new google.maps.Size(0, -30),
              maxWidth: Math.min(
                infoWindowMaxWidth,
                0.9 * (typeof window !== "undefined" ? window.innerWidth : 320)
              ),
            }}
          >
            {/* InfoWindow: evitar scroll interno */}
            <div className="p-0 overflow-hidden w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] mx-auto">
              {/* Si tenemos un id, rehidratamos con detalle por ID para fotos y datos completos */}
              {selectedProperty?.id ? (
                <PropertyInfoCardById
                  id={String(selectedProperty.id)}
                  onViewDetails={() => {
                    setDrawerOpen(true);
                  }}
                  onContact={() => {
                    setContactOpen(true);
                  }}
                  onContactOptions={(opts) => {
                    setContactOptions({
                      ...opts,
                      title: selectedProperty.title,
                    });
                    setContactOpen(true);
                  }}
                />
              ) : null}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      {/* Drawer lateral para detalle */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="ml-auto mr-0 h-full w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
          <DrawerHeader>
            <DrawerTitle>Detalle de la propiedad</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
            {selectedProperty?.id && (
              <PropertyDetailById
                id={String(selectedProperty.id)}
                onContact={() => setContactOpen(true)}
                onContactOptions={(opts) => {
                  setContactOptions({ ...opts, title: selectedProperty.title });
                  setContactOpen(true);
                }}
                onPropertyDeleted={() => {
                  onPropertySelect(null);
                  setDrawerOpen(false);
                  console.log(
                    "🗑️ Propiedad eliminada, cerrando drawer y actualizando mapa"
                  );
                }}
                showAdminActions={true}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Dialog de contacto */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contactar</DialogTitle>
            <DialogDescription>
              {contactOptions?.title
                ? `Propiedad: ${contactOptions.title}`
                : "Elegí el medio de contacto"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              className="flex-1"
              disabled={!contactOptions?.wa}
              onClick={() => {
                if (!contactOptions?.wa) return;
                const digits = contactOptions.wa.replace(/\D+/g, "");
                const text = encodeURIComponent("Hola, me gustaría más info.");
                window.open(`https://wa.me/${digits}?text=${text}`, "_blank");
                setContactOpen(false);
              }}
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={!contactOptions?.email}
              onClick={() => {
                if (!contactOptions?.email) return;
                const subject = encodeURIComponent("Consulta por propiedad");
                const body = encodeURIComponent(
                  "Hola, me interesa la propiedad."
                );
                window.location.href = `mailto:${contactOptions.email}?subject=${subject}&body=${body}`;
                setContactOpen(false);
              }}
            >
              Email
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setContactOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
