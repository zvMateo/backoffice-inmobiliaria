"use client";

import { useEffect, useRef, useState } from "react";
import { InputWithRef } from "@/components/ui/input-with-ref";
import { Label } from "@/components/ui/label";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

export function GooglePlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Buscar dirección...",
  label,
  className = "",
  disabled = false,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      try {
        // Verificar que todas las dependencias estén disponibles
        if (
          !window.google ||
          !window.google.maps ||
          !window.google.maps.places ||
          !window.google.maps.places.Autocomplete
        ) {
          console.error("Google Maps Places Autocomplete not available");
          return;
        }

        // Crear el autocomplete usando la API clásica (funciona mejor)
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["address"],
            componentRestrictions: { country: "ar" },
            fields: ["formatted_address", "geometry", "place_id", "name"],
          }
        );

        // Listener para cuando se selecciona un lugar
        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();

          if (place.geometry && place.geometry.location) {
            const address = place.formatted_address || "";
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const placeId = place.place_id || "";

            // Actualizar el valor del input
            onChange(address);

            // Notificar al componente padre
            onPlaceSelect({
              address,
              lat,
              lng,
              placeId,
            });
          }
        });

        // Listener para cambios en el input
        const input = inputRef.current;
        const handleInputChange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          onChange(target.value);
        };

        if (input) {
          input.addEventListener("input", handleInputChange);

          return () => {
            input.removeEventListener("input", handleInputChange);
          };
        }
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }
    }
  }, [isLoaded, onChange, onPlaceSelect]);

  if (loadError) {
    return (
      <div className={className}>
        {label && <Label>{label}</Label>}
        <InputWithRef
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="border-red-300"
        />
        <p className="text-sm text-red-600 mt-1">{loadError}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={className}>
        {label && <Label>{label}</Label>}
        <InputWithRef
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="opacity-50"
        />
        <p className="text-sm text-gray-500 mt-1">Cargando autocompletado...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <InputWithRef
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="relative z-10"
      />
    </div>
  );
}
