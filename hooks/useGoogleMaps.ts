"use client";

import { useEffect, useState } from "react";
import { getGoogleMapsApiKey } from "@/lib/google-maps";

// Variable global para evitar múltiples cargas
let isLoading = false;
let isLoaded = false;
let loadError: string | null = null;
let listeners: Array<() => void> = [];

// Función para notificar a todos los listeners
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useGoogleMaps() {
  const [state, setState] = useState({
    isLoaded: false,
    loadError: null as string | null,
    apiKey: null as string | null,
  });

  useEffect(() => {
    // Función para actualizar el estado
    const updateState = () => {
      setState({ 
        isLoaded, 
        loadError, 
        apiKey: isLoaded ? "loaded" : null 
      });
    };

    // Registrar listener
    listeners.push(updateState);

    // Si ya está cargado, actualizar inmediatamente
    if (isLoaded) {
      updateState();
    }

    // Si hay error, actualizar inmediatamente
    if (loadError) {
      updateState();
    }

    // Si ya está cargando, no hacer nada
    if (isLoading) {
      return;
    }

    const loadGoogleMaps = async () => {
      try {
        isLoading = true;
        const key = await getGoogleMapsApiKey();
        
        if (!key) {
          loadError = "Google Maps API key no configurada";
          setState({ isLoaded: false, loadError, apiKey: null });
          return;
        }

        if (!window.google) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry,marker&loading=async`;
          script.async = true;
          script.defer = true;

          script.onload = () => {
            // Verificar que las librerías estén disponibles
            const checkLibraries = () => {
              if (
                window.google &&
                window.google.maps &&
                window.google.maps.places &&
                window.google.maps.Geocoder
              ) {
                isLoaded = true;
                loadError = null;
                console.log("Google Maps API cargada correctamente");
                notifyListeners();
              } else {
                // Reintentar después de un breve delay
                setTimeout(checkLibraries, 200);
              }
            };
            checkLibraries();
          };

          script.onerror = () => {
            loadError = "Error al cargar Google Maps";
            notifyListeners();
          };

          document.head.appendChild(script);
        } else {
          isLoaded = true;
          notifyListeners();
        }
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        loadError = "Error al obtener configuración de Google Maps";
        notifyListeners();
      } finally {
        isLoading = false;
      }
    };

    loadGoogleMaps();

    // Cleanup: remover listener cuando el componente se desmonta
    return () => {
      listeners = listeners.filter(listener => listener !== updateState);
    };
  }, []);

  return state;
}
