"use client";

import { useState } from "react";
import type { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Eye,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";

interface PropertyInfoCardProps {
  property: Property;
  onViewDetails: () => void;
  onContact: () => void;
}

export function PropertyInfoCard({
  property,
  onViewDetails,
  onContact,
}: PropertyInfoCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === property.photos.length - 1 ? 0 : prev + 1
    );
    setImageLoading(true);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? property.photos.length - 1 : prev - 1
    );
    setImageLoading(true);
  };

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency === "USD" ? "USD" : "ARS",
      minimumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case "venta":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "alquiler mensual":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "alquiler temporal":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "casa":
        return "bg-emerald-100 text-emerald-800";
      case "departamento":
        return "bg-blue-100 text-blue-800";
      case "oficina":
        return "bg-amber-100 text-amber-800";
      case "local":
        return "bg-red-100 text-red-800";
      case "terreno":
        return "bg-violet-100 text-violet-800";
      case "campo":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full max-w-full overflow-hidden shadow-lg border-0 animate-in zoom-in-95 duration-300">
      <div className="relative">
        {/* Photo Carousel */}
        <div className="relative h-32 xs:h-36 sm:h-40 notebook:h-44 lg:h-48 overflow-hidden bg-muted">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <div className="text-muted-foreground text-sm">Cargando...</div>
            </div>
          )}
          <Image
            src={property.photos[currentPhotoIndex] || "/placeholder.svg"}
            alt={`${property.title} - Foto ${currentPhotoIndex + 1}`}
            fill
            className={`object-cover transition-all duration-500 hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />

          {property.photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-1 xs:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 transition-all duration-200 hover:scale-110"
                onClick={prevPhoto}
              >
                <ChevronLeft className="h-3 w-3 xs:h-4 xs:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 xs:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 transition-all duration-200 hover:scale-110"
                onClick={nextPhoto}
              >
                <ChevronRight className="h-3 w-3 xs:h-4 xs:w-4" />
              </Button>

              {/* Photo indicators */}
              <div className="absolute bottom-1 xs:bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {property.photos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full transition-all duration-300 ${
                      index === currentPhotoIndex
                        ? "bg-white scale-110"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute top-2 xs:top-3 left-2 xs:left-3 animate-in slide-in-from-top-2 duration-300">
          <Badge
            variant="secondary"
            className="bg-white/95 backdrop-blur-sm text-foreground font-semibold shadow-sm text-xs xs:text-sm"
          >
            {formatPrice(property.price, property.currency)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3 xs:p-4 space-y-2 xs:space-y-3">
        {/* Title and Type */}
        <div className="space-y-1.5 xs:space-y-2 animate-in fade-in duration-300 delay-100">
          <h3 className="font-semibold text-sm xs:text-base notebook:text-lg leading-tight text-balance line-clamp-2">
            {property.title}
          </h3>
          <div className="flex gap-1.5 xs:gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`${getTypeColor(
                property.type
              )} transition-all duration-200 hover:scale-105 text-xs xs:text-sm`}
            >
              {property.type}
            </Badge>
            <Badge
              variant="outline"
              className={`${getOperationColor(
                property.operation
              )} transition-all duration-200 hover:scale-105 text-xs xs:text-sm`}
            >
              {property.operation}
            </Badge>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm text-muted-foreground animate-in slide-in-from-left-2 duration-300 delay-200">
          <MapPin className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
          <span className="text-pretty line-clamp-1">
            {property.address}, {property.city}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs xs:text-sm text-muted-foreground text-pretty leading-relaxed animate-in fade-in duration-300 delay-300 line-clamp-2">
          {property.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-1.5 xs:gap-2 pt-1 xs:pt-2 animate-in slide-in-from-bottom-2 duration-300 delay-400">
          <Button
            onClick={onViewDetails}
            className="flex-1 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-md min-h-[36px] xs:min-h-[40px] sm:min-h-[44px]"
            size="sm"
          >
            <Eye className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2 flex-shrink-0" />
            <span className="text-xs xs:text-sm truncate">Ver detalle</span>
          </Button>
          <Button
            onClick={onContact}
            variant="outline"
            className="flex-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 hover:shadow-md bg-transparent min-h-[36px] xs:min-h-[40px] sm:min-h-[44px]"
            size="sm"
          >
            <MessageCircle className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2 flex-shrink-0" />
            <span className="text-xs xs:text-sm truncate">Contactar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
