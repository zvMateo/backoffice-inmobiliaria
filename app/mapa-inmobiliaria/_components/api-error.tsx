"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ApiErrorProps {
  error: string;
  onRetry?: () => void;
  isOnline?: boolean;
}

export function ApiError({ error, onRetry, isOnline = true }: ApiErrorProps) {
  const getErrorMessage = (error: string) => {
    if (error.includes("Failed to fetch") || error.includes("NetworkError")) {
      return {
        title: "Error de Conexión",
        message:
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
        icon: <WifiOff className="h-8 w-8 text-orange-600" />,
        color: "orange",
      };
    }

    if (error.includes("404")) {
      return {
        title: "Datos No Encontrados",
        message: "No se encontraron propiedades en la base de datos.",
        icon: <AlertTriangle className="h-8 w-8 text-blue-600" />,
        color: "blue",
      };
    }

    if (error.includes("500")) {
      return {
        title: "Error del Servidor",
        message:
          "El servidor está experimentando problemas. Intenta más tarde.",
        icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
        color: "red",
      };
    }

    return {
      title: "Error Desconocido",
      message: "Ocurrió un error inesperado al cargar las propiedades.",
      icon: <AlertTriangle className="h-8 w-8 text-gray-600" />,
      color: "gray",
    };
  };

  const errorInfo = getErrorMessage(error);
  const bgColor =
    errorInfo.color === "orange"
      ? "from-orange-50 to-yellow-100"
      : errorInfo.color === "blue"
      ? "from-blue-50 to-indigo-100"
      : errorInfo.color === "red"
      ? "from-red-50 to-pink-100"
      : "from-gray-50 to-gray-100";

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${bgColor} dark:from-gray-900 dark:to-gray-800 p-4`}
    >
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div
            className={`w-16 h-16 bg-${errorInfo.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            {errorInfo.icon}
          </div>
          <CardTitle className={`text-xl text-${errorInfo.color}-900`}>
            {errorInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{errorInfo.message}</p>

          {!isOnline && (
            <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 rounded-lg p-3">
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">
                Sin conexión a internet
              </span>
            </div>
          )}

          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2 font-mono">
            {error}
          </div>

          {onRetry && (
            <Button
              onClick={onRetry}
              className="w-full gap-2"
              variant="default"
              disabled={!isOnline}
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
