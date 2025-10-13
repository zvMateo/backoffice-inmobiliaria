"use client";

import { GooglePlacesAutocomplete } from "@/components/google-places-autocomplete";

interface MapAddressSearchProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => void;
  placeholder?: string;
  className?: string;
}

export function MapAddressSearch({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Buscar dirección...",
  className = "",
}: MapAddressSearchProps) {
  return (
    <GooglePlacesAutocomplete
      value={value}
      onChange={onChange}
      onPlaceSelect={onPlaceSelect}
      placeholder={placeholder}
      className={className}
    />
  );
}
