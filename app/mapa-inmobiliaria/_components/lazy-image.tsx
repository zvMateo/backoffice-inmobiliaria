"use client";

import { useState, useRef, useEffect } from "react";
// Usamos <img> nativo para evitar restricciones de dominios de next/image

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  eager?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  eager = false,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority || eager);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || eager || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Error placeholder */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <div className="text-xs">Error al cargar</div>
          </div>
        </div>
      )}

      {/* Imagen real */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${
            fill ? "absolute inset-0 w-full h-full object-cover" : ""
          } ${className}`}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
}
