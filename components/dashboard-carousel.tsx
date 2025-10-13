"use client";

import { useListaPropiedadesInmo } from "@/hooks/useInmobiliaria";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => m.motion.div),
  { ssr: false }
);

export function DashboardCarousel() {
  const { data, isLoading, isError } = useListaPropiedadesInmo();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Últimas propiedades agregadas
          </CardTitle>
          <CardDescription>Cargando propiedades...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Últimas propiedades agregadas
          </CardTitle>
          <CardDescription>
            {isError
              ? "Error al cargar propiedades"
              : "No hay propiedades disponibles"}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Tomar las últimas 6 propiedades (las más recientes)
  const latestProperties = data.slice(0, 6);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(latestProperties.length / itemsPerPage);

  const visibleProperties = latestProperties.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Últimas propiedades agregadas
            </CardTitle>
            <CardDescription>
              {latestProperties.length} propiedades recientes
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleProperties.map((property: any, index: number) => (
            <MotionDiv
              key={property.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer group h-full">
                  {/* Imagen */}
                  <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                    {property.imagenes && property.imagenes.length > 0 ? (
                      <img
                        src={property.imagenes[0]}
                        alt={property.nombre || property.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Badge de tipo */}
                    <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                      {property.tipo || property.typeproperty || "Propiedad"}
                    </div>
                  </div>

                  {/* Contenido */}
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                      {property.nombre || property.name || "Sin nombre"}
                    </h3>

                    {/* Ubicación */}
                    {(property.zona || property.zone) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">
                          {property.zona || property.zone}
                        </span>
                      </div>
                    )}

                    {/* Precio */}
                    {(property.precio || property.price) && (
                      <div className="flex items-center gap-1 text-sm font-bold text-primary">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {typeof (property.precio || property.price) ===
                          "number"
                            ? new Intl.NumberFormat("es-AR").format(
                                property.precio || property.price
                              )
                            : property.precio || property.price}
                        </span>
                      </div>
                    )}

                    {/* Detalles */}
                    <div className="flex gap-3 text-xs text-muted-foreground pt-2 border-t">
                      {property.room && <span>{property.room} hab.</span>}
                      {property.size && <span>{property.size} m²</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </MotionDiv>
          ))}
        </div>

        {/* Indicadores de página */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
