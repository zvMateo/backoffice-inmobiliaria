"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GooglePlacesAutocomplete } from "@/components/google-places-autocomplete";

interface AddressSearchProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  onClear: () => void;
}

export function AddressSearch({
  onLocationSelect,
  onClear,
}: AddressSearchProps) {
  const [searchValue, setSearchValue] = useState("");

  const handlePlaceSelect = (place: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => {
    onLocationSelect({
      lat: place.lat,
      lng: place.lng,
      address: place.address,
    });
    setSearchValue(place.address);
  };

  const handleClear = () => {
    setSearchValue("");
    onClear();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <GooglePlacesAutocomplete
          value={searchValue}
          onChange={setSearchValue}
          onPlaceSelect={handlePlaceSelect}
          placeholder="Buscar por dirección..."
          className="pl-10 pr-10 h-9 sm:h-10"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
