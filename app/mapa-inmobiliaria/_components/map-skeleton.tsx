"use client";

import { Card, CardContent } from "@/components/ui/card";

export function MapSkeleton() {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Skeleton del mapa */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse">
        {/* Líneas de calles simuladas */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-1/4 left-0 right-0 h-px bg-gray-400 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/2 left-0 right-0 h-px bg-gray-400 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-3/4 left-0 right-0 h-px bg-gray-400 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute top-0 bottom-0 left-1/4 w-px bg-gray-400 animate-pulse"
            style={{ animationDelay: "0.7s" }}
          ></div>
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400 animate-pulse"
            style={{ animationDelay: "1.2s" }}
          ></div>
          <div
            className="absolute top-0 bottom-0 left-3/4 w-px bg-gray-400 animate-pulse"
            style={{ animationDelay: "1.7s" }}
          ></div>
        </div>

        {/* Puntos simulando marcadores */}
        <div
          className="absolute top-1/3 left-1/3 w-3 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.6s" }}
        ></div>
        <div
          className="absolute top-2/3 left-2/3 w-3 h-3 bg-red-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.9s" }}
        ></div>
        <div
          className="absolute top-1/4 left-2/3 w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/4 w-3 h-3 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Skeleton de la barra de búsqueda */}
      <div className="absolute top-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="flex-1 h-4 bg-gray-300 rounded"></div>
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Skeleton de filtros móviles */}
      <div className="absolute top-16 left-4 right-4 lg:hidden z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-2 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Skeleton del contador de resultados */}
      <div className="absolute bottom-4 left-4 right-4 lg:right-auto z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            <div className="flex gap-2">
              <div className="w-16 h-6 bg-gray-300 rounded"></div>
              <div className="w-20 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton del sidebar de filtros (desktop) */}
      <div className="hidden lg:block absolute top-0 left-0 w-80 h-full bg-white/90 backdrop-blur-sm border-r border-gray-200 animate-pulse">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <div className="w-20 h-4 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mensaje de carga central */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl animate-pulse">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="w-48 h-6 bg-gray-300 rounded mx-auto"></div>
              <div className="w-32 h-4 bg-gray-300 rounded mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
