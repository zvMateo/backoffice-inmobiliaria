"use client";

import { useState } from "react";
import { GooglePlacesAutocomplete } from "@/components/google-places-autocomplete";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AddressSearchExample() {
  const [selectedPlace, setSelectedPlace] = useState<{
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  } | null>(null);

  const handlePlaceSelect = (place: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => {
    setSelectedPlace(place);
    console.log("Lugar seleccionado:", place);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de Búsqueda de Direcciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <GooglePlacesAutocomplete
            value={selectedPlace?.address || ""}
            onChange={(value) => {
              if (!value) setSelectedPlace(null);
            }}
            onPlaceSelect={handlePlaceSelect}
            placeholder="Buscar dirección..."
            label="Dirección"
          />

          {selectedPlace && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Lugar Seleccionado:</h3>
              <p>
                <strong>Dirección:</strong> {selectedPlace.address}
              </p>
              <p>
                <strong>Latitud:</strong> {selectedPlace.lat}
              </p>
              <p>
                <strong>Longitud:</strong> {selectedPlace.lng}
              </p>
              <p>
                <strong>Place ID:</strong> {selectedPlace.placeId}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
