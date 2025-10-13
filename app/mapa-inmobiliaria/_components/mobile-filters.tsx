"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PropertyFilterComponent } from "./property-filters";
import { Filter, X } from "lucide-react";
import type { PropertyFilters } from "@/types/property";

interface MobileFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: Partial<PropertyFilters>) => void;
  onClearFilters: () => void;
  totalProperties: number;
  filteredCount: number;
}

export function MobileFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalProperties,
  filteredCount,
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type && filters.type.length > 0) count++;
    if (filters.operation && filters.operation.length > 0) count++;
    if (filters.city && filters.city.length > 0) count++;
    if (filters.priceRange) count++;
    if (filters.areaRange) count++;
    if (filters.bedrooms && filters.bedrooms.length > 0) count++;
    if (filters.bathrooms && filters.bathrooms.length > 0) count++;
    if (filters.features && filters.features.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-white/95 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="px-4 py-3 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filtros de Propiedades
            </SheetTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredCount} de {totalProperties} propiedades
              </span>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-primary hover:text-primary-foreground hover:bg-primary"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <PropertyFilterComponent
            filters={filters}
            onFiltersChange={onFiltersChange}
            onClearFilters={onClearFilters}
            totalProperties={totalProperties}
            filteredCount={filteredCount}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
