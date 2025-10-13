"use client";

import { useState, useEffect, memo } from "react";
import type { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Eye,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";
import { LazyImage } from "./lazy-image";
import { getOperationColor, getTypeColor } from "../_utils/property-mapping";

interface PropertyInfoCardProps {
  property: Property;
  onViewDetails: () => void;
  onContact: () => void;
}

export const PropertyInfoCard = memo(function PropertyInfoCard({
  property,
  onViewDetails,
  onContact: _onContact,
}: PropertyInfoCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === property.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? property.photos.length - 1 : prev - 1
    );
  };

  // Prefetch de la siguiente imagen para mejorar la percepción de velocidad
  useEffect(() => {
    if (property.photos.length <= 1) return;
    const nextIndex = (currentPhotoIndex + 1) % property.photos.length;
    const nextUrl = property.photos[nextIndex];
    if (!nextUrl) return;
    const img = new Image();
    img.src = nextUrl;
  }, [currentPhotoIndex, property.photos]);

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency === "USD" ? "USD" : "ARS",
      minimumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const delta = touchStartX - touchEndX;
    if (Math.abs(delta) > 40) {
      // swipe left -> next, swipe right -> prev
      delta > 0 ? nextPhoto() : prevPhoto();
    }
  };

  return (
    <Card
      className="w-full overflow-hidden shadow-lg border border-border rounded-xl bg-card animate-in zoom-in-95 duration-300 mx-auto"
      style={{ 
        width: "100%", 
        maxWidth: "min(300px, calc(100vw - 1.5rem))",
        minWidth: "260px"
      }}
    >
      <div className="relative">
        {/* Photo Carousel */}
        <div
          className="relative overflow-hidden bg-muted select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-label="Galería de imágenes de la propiedad"
        >
          <div className="relative w-full aspect-[20/9] sm:aspect-[16/9]">
            {/** Determina si hay fotos reales (no placeholder) */}
            {(() => {
              const isRealPhoto = (u?: string) =>
                !!u && !u.startsWith("/placeholder");
              const realPhotos = (property.photos || []).filter(isRealPhoto);
              const hasRealPhotos = realPhotos.length > 0;

              return (
                <>
                  <img
                    src={
                      property.photos[currentPhotoIndex] || "/placeholder.svg"
                    }
                    alt={`${property.title} - Foto ${currentPhotoIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading={currentPhotoIndex === 0 ? "eager" : "lazy"}
                    crossOrigin="anonymous"
                  />

                  {!hasRealPhotos && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[11px]">
                      Sin fotos
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          {(() => {
            const isRealPhoto = (u?: string) =>
              !!u && !u.startsWith("/placeholder");
            const realPhotos = (property.photos || []).filter(isRealPhoto);
            const enableCarousel = realPhotos.length > 1;
            if (!enableCarousel) return null;
            return (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 h-8 w-8 rounded-full transition-all duration-200 hover:scale-110"
                  onClick={prevPhoto}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 h-8 w-8 rounded-full transition-all duration-200 hover:scale-110"
                  onClick={nextPhoto}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Photo indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {realPhotos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentPhotoIndex
                          ? "bg-white scale-110"
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>

                {/* Contador de fotos */}
                <div
                  className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[11px] leading-none"
                  aria-label={`Imagen ${Math.min(
                    currentPhotoIndex + 1,
                    realPhotos.length
                  )} de ${realPhotos.length}`}
                >
                  {Math.min(currentPhotoIndex + 1, realPhotos.length)}/
                  {realPhotos.length}
                </div>
              </>
            );
          })()}
        </div>

        {/* Price + currency chip */}
        <div className="absolute top-3 left-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-white/95 backdrop-blur-sm text-foreground font-semibold shadow-sm"
            >
              {property.formattedPrice ??
                formatPrice(property.price, property.currency)}
            </Badge>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/90 text-foreground border border-border">
              {property.currency}
            </span>
          </div>
        </div>

        {/* Badges de estado: Nuevo / Oferta (opcional) */}
        {(() => {
          const createdAt = (property as any)?.createdAt as string | undefined;
          const originalPrice = (property as any)?.originalPrice as
            | number
            | undefined;
          const isNew = createdAt
            ? (() => {
                const created = new Date(createdAt).getTime();
                const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
                return days <= 30;
              })()
            : false;
          const hasDiscount =
            typeof originalPrice === "number" && originalPrice > property.price;
          const discountPct = hasDiscount
            ? Math.round(
                ((originalPrice! - property.price) / originalPrice!) * 100
              )
            : 0;

          if (!isNew && !hasDiscount) return null;
          return (
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {isNew && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500 text-white shadow">
                  Nuevo
                </span>
              )}
              {hasDiscount && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white shadow">
                  -{discountPct}%
                </span>
              )}
            </div>
          );
        })()}
      </div>

      <CardContent className="p-2.5 xs:p-3 notebook:p-4 space-y-2 xs:space-y-2.5 notebook:space-y-3 no-scrollbar overflow-x-hidden overflow-y-visible break-words">
        {/* Title and Type */}
        <div className="space-y-2 animate-in fade-in duration-300 delay-100">
          <h3
            className="font-semibold text-sm xs:text-base notebook:text-lg leading-tight text-balance"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {property.title}
          </h3>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`${getTypeColor(
                property.type
              )} transition-all duration-200 hover:scale-105`}
            >
              {property.type}
            </Badge>
            <Badge
              variant="outline"
              className={`${getOperationColor(
                property.operation
              )} transition-all duration-200 hover:scale-105`}
            >
              {property.operation}
            </Badge>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in slide-in-from-left-2 duration-300 delay-200 min-w-0">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-pretty">
            {property.address}, {property.city}
          </span>
        </div>

        {/* Quick specs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" />
            <span>{property.bedrooms} dorm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" />
            <span>
              {property.bathrooms} baño{sufix(property.bathrooms)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" />
            <span>{property.area} m²</span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm text-muted-foreground leading-relaxed animate-in fade-in duration-300 delay-300"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {property.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1 animate-in slide-in-from-bottom-2 duration-300 delay-400 w-full min-w-0">
          <Button
            onClick={onViewDetails}
            className="w-full bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-md text-xs xs:text-sm notebook:text-base px-3 xs:px-4 py-2 xs:py-2.5 notebook:py-3 min-h-[36px] xs:min-h-[40px] notebook:min-h-[44px] h-auto overflow-hidden font-medium"
            size="sm"
            aria-label="Ver detalles de la propiedad"
          >
            <Eye className="h-3 w-3 xs:h-4 xs:w-4 notebook:h-5 notebook:w-5 mr-1.5 xs:mr-2 flex-shrink-0" />
            <span className="block truncate text-center flex-1 min-w-0">Ver detalle</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// Utilidad simple para pluralización de baños
function sufix(n: number) {
  return n === 1 ? "" : "s";
}
