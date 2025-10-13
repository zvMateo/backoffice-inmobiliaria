"use client";

import { useEffect, useRef, useState } from "react";
import { GooglePlacesAutocomplete } from "@/components/google-places-autocomplete";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface GoogleMapProps {
  address: string;
  lat: string;
  lng: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange: (lat: string, lng: string) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function GoogleMap({
  address,
  lat,
  lng,
  onAddressChange,
  onCoordinatesChange,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    console.log("GoogleMap useEffect:", {
      isLoaded,
      hasMapRef: !!mapRef.current,
      hasMap: !!map,
    });

    if (isLoaded && !map && mapRef.current) {
      console.log("Inicializando mapa...");
      initializeMap();
    }
  }, [isLoaded, map]);

  useEffect(() => {
    if (map && lat && lng) {
      const position = {
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
      };
      updateMapPosition(position);
    }
  }, [map, lat, lng]);

  useEffect(() => {
    if (address && address !== searchValue) {
      setSearchValue(address);
    }
  }, [address]);

  // Efecto que se ejecuta cuando el componente se monta
  useEffect(() => {
    console.log("Componente montado, verificando estado...");

    // Verificar periódicamente si el mapa puede inicializarse
    const checkAndInit = () => {
      if (isLoaded && mapRef.current && !map) {
        console.log("Efecto de montaje: Inicializando mapa...");
        initializeMap();
      } else if (!isLoaded) {
        // Si aún no está cargado, reintentar en 500ms
        setTimeout(checkAndInit, 500);
      }
    };

    // Iniciar verificación después de un breve delay
    setTimeout(checkAndInit, 100);
  }, []);

  // Efecto adicional para asegurar que el mapa se inicialice cuando el componente esté montado
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      console.log("Efecto adicional: Inicializando mapa...");
      initializeMap();
    }
  }, [isLoaded, map]);

  const initializeMap = () => {
    try {
      // Verificación más simple
      if (!window.google?.maps?.Map) {
        console.error("Google Maps API no está completamente cargada");
        return;
      }

      if (!mapRef.current) {
        console.error("Contenedor del mapa no disponible");
        return;
      }

      const defaultCenter = { lat: -31.4201, lng: -64.1888 }; // Córdoba
      const initialCenter =
        lat && lng
          ? { lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) }
          : defaultCenter;

      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: initialCenter,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapId: "property-map", // Agregar un ID único para el mapa
      });

      const createOrGetMarker = (pos: any) => {
        if (marker) {
          marker.position = pos;
          return marker;
        }

        // Usar AdvancedMarkerElement en lugar de Marker deprecado
        const m = new window.google.maps.marker.AdvancedMarkerElement({
          position: pos,
          map: newMap,
          gmpDraggable: true,
          zIndex: 9999,
          gmpClickable: true,
        });
        setMarker(m);
        return m;
      };

      const newMarker = createOrGetMarker(initialCenter);

      newMarker.addListener("dragend", () => {
        const position = newMarker.position;
        const newLat = position.lat.toString();
        const newLng = position.lng.toString();
        onCoordinatesChange(newLat, newLng);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: position },
          (results: any, status: any) => {
            if (status === "OK" && results[0]) {
              const newAddress = results[0].formatted_address;
              onAddressChange(newAddress);
              setSearchValue(newAddress);
            }
          }
        );
      });

      newMap.addListener("click", (event: any) => {
        const position = event.latLng;
        newMarker.position = position;
        const newLat = position.lat.toString();
        const newLng = position.lng.toString();
        onCoordinatesChange(newLat, newLng);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: position },
          (results: any, status: any) => {
            if (status === "OK" && results[0]) {
              const newAddress = results[0].formatted_address;
              onAddressChange(newAddress);
              setSearchValue(newAddress);
            }
          }
        );
      });

      setMap(newMap);
      console.log("✅ Mapa inicializado correctamente con ID: property-map");
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const updateMapPosition = (position: { lat: number; lng: number }) => {
    if (map) {
      // Centrar el mapa en la nueva posición
      map.setCenter(position);

      // Actualizar o crear el marcador
      if (marker) {
        marker.position = position;
      } else {
        const newMarker = new window.google.maps.marker.AdvancedMarkerElement({
          position: position,
          map: map,
          gmpDraggable: true,
          zIndex: 9999,
          gmpClickable: true,
        });
        setMarker(newMarker);

        // Agregar listener para drag
        newMarker.addListener("dragend", () => {
          const pos = newMarker.position;
          const newLat = pos.lat.toString();
          const newLng = pos.lng.toString();
          onCoordinatesChange(newLat, newLng);

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results: any, status: any) => {
            if (status === "OK" && results[0]) {
              const newAddress = results[0].formatted_address;
              onAddressChange(newAddress);
              setSearchValue(newAddress);
            }
          });
        });
      }
    }
  };

  const handlePlaceSelect = (place: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => {
    onAddressChange(place.address);
    onCoordinatesChange(place.lat.toString(), place.lng.toString());
    setSearchValue(place.address);
    updateMapPosition({ lat: place.lat, lng: place.lng });
  };

  if (loadError) {
    return (
      <div className="space-y-4">
        <GooglePlacesAutocomplete
          value={searchValue}
          onChange={setSearchValue}
          onPlaceSelect={handlePlaceSelect}
          placeholder="Escriba una dirección..."
        />
        <div className="flex h-64 items-center justify-center rounded-lg border bg-muted">
          <div className="text-center">
            <p className="text-muted-foreground">{loadError}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Verifique la configuración de Google Maps API
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <GooglePlacesAutocomplete
        value={searchValue}
        onChange={setSearchValue}
        onPlaceSelect={handlePlaceSelect}
        placeholder="Ej: Av. Colón 123, Córdoba"
      />

      <div className="relative">
        <div
          ref={mapRef}
          className="w-full rounded-md"
          style={{ height: "400px", minHeight: "400px" }}
        />

        {!isLoaded && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-muted/50 backdrop-blur-sm">
            <div className="text-center space-y-2">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-muted-foreground">Cargando mapa...</p>
            </div>
          </div>
        )}

        {/* Hint overlay cuando no hay coordenadas */}
        {isLoaded && !lat && !lng && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border text-sm text-center max-w-xs">
            <p className="font-medium">💡 Tip</p>
            <p className="text-xs text-muted-foreground mt-1">
              Hacé click en el mapa o buscá una dirección para establecer la
              ubicación
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
