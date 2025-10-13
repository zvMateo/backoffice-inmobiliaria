"use client";

import { useState, useMemo } from "react";
import type { Property, PropertyFilters } from "@/types/property";

interface UseMapaInmobiliarioProps {
  initialProperties?: Property[];
  initialFilters?: PropertyFilters;
  onPropertySelect?: (property: Property | null) => void;
}

export function useMapaInmobiliario({
  initialProperties = [],
  initialFilters = {},
  onPropertySelect,
}: UseMapaInmobiliarioProps = {}) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Filter by type
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(property.type)) return false;
      }

      // Filter by operation
      if (filters.operation && filters.operation.length > 0) {
        if (!filters.operation.includes(property.operation)) return false;
      }

      // Filter by city
      if (filters.city && filters.city.length > 0) {
        if (!filters.city.includes(property.city)) return false;
      }

      // Filter by price range
      if (filters.priceRange && filters.currency) {
        const propertyPrice =
          property.currency === filters.currency
            ? property.price
            : property.currency === "USD"
              ? property.price * 1000
              : property.price / 1000;

        if (propertyPrice < filters.priceRange.min || propertyPrice > filters.priceRange.max) {
          return false;
        }
      }

      // Filter by area
      if (filters.areaRange) {
        if (property.area < filters.areaRange.min || property.area > filters.areaRange.max) {
          return false;
        }
      }

      // Filter by bedrooms
      if (filters.bedrooms && filters.bedrooms.length > 0) {
        if (!filters.bedrooms.includes(property.bedrooms)) return false;
      }

      // Filter by bathrooms
      if (filters.bathrooms && filters.bathrooms.length > 0) {
        if (!filters.bathrooms.includes(property.bathrooms)) return false;
      }

      // Filter by features
      if (filters.features && filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature => 
          property.features.includes(feature)
        );
        if (!hasAllFeatures) return false;
      }

      return true;
    });
  }, [properties, filters]);

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handlePropertySelect = (property: Property | null) => {
    setSelectedProperty(property);
    onPropertySelect?.(property);
  };

  return {
    // Data
    properties: filteredProperties,
    allProperties: properties,
    filters,
    selectedProperty,
    
    // Actions
    setProperties,
    updateFilters,
    clearFilters,
    setSelectedProperty: handlePropertySelect,
  };
}


