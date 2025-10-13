"use client";

import type React from "react";

import { useState } from "react";
import type {
  PropertyFilters,
  PropertyType,
  OperationType,
  City,
  Currency,
} from "@/types/property";
import { useFilterOptions } from "@/app/mapa-inmobiliaria/_hooks/useFilterOptions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AdvancedFilters } from "./advanced-filters";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MapAddressSearch } from "@/components/map-address-search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  X,
  Home,
  Building,
  Briefcase,
  Store,
  TreePine,
  Mountain,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: Partial<PropertyFilters>) => void;
  onClearFilters: () => void;
  totalProperties: number;
  filteredCount: number;
  onAddressSearch?: (place: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => void;
}

// Iconos para tipos de propiedades
const getPropertyIcon = (type: string): React.ReactNode => {
  const typeMap: Record<string, React.ReactNode> = {
    casa: <Home className="h-4 w-4" />,
    duplex: <Building className="h-4 w-4" />,
    departamento: <Building className="h-4 w-4" />,
    oficina: <Briefcase className="h-4 w-4" />,
    local: <Store className="h-4 w-4" />,
    terreno: <TreePine className="h-4 w-4" />,
    campo: <Mountain className="h-4 w-4" />,
  };
  return typeMap[type.toLowerCase()] || <Home className="h-4 w-4" />;
};

export function PropertyFilterComponent({
  filters,
  onFiltersChange,
  onClearFilters,
  totalProperties,
  filteredCount,
  onAddressSearch,
}: PropertyFiltersProps) {
  const [typeOpen, setTypeOpen] = useState(true);
  const [operationOpen, setOperationOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");

  // Obtener opciones dinámicas del backend
  const {
    types,
    operations,
    cities,
    provinces,
    citiesWithProvince,
    loading: optionsLoading,
    error: optionsError,
  } = useFilterOptions();

  const handleTypeChange = (type: PropertyType, checked: boolean) => {
    const currentTypes = filters.type || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter((t) => t !== type);

    onFiltersChange({ type: newTypes.length > 0 ? newTypes : undefined });
  };

  const handleOperationChange = (
    operation: OperationType,
    checked: boolean
  ) => {
    const currentOperations = filters.operation || [];
    const newOperations = checked
      ? [...currentOperations, operation]
      : currentOperations.filter((o) => o !== operation);

    onFiltersChange({
      operation: newOperations.length > 0 ? newOperations : undefined,
    });
  };

  const handleCityChange = (city: City, checked: boolean) => {
    const currentCities = filters.city || [];
    const newCities = checked
      ? [...currentCities, city]
      : currentCities.filter((c) => c !== city);

    onFiltersChange({ city: newCities.length > 0 ? newCities : undefined });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type && filters.type.length > 0) count++;
    if (filters.operation && filters.operation.length > 0) count++;
    if (filters.city && filters.city.length > 0) count++;
    return count;
  };

  const handleAddressSelect = (place: {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => {
    setAddressSearch(place.address);
    if (onAddressSearch) {
      onAddressSearch(place);
    }
  };

  return (
    <Card className="w-full max-w-sm lg:w-80 h-fit bg-sidebar border-sidebar-border animate-in slide-in-from-left-5 duration-500">
      {/* Chips de filtros activos */}
      <div className="lg:hidden px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          {(filters.type || []).map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="cursor-pointer inline-flex"
              onClick={() =>
                onFiltersChange({
                  type:
                    (filters.type || []).filter((x) => x !== t) || undefined,
                })
              }
            >
              {t} ✕
            </Badge>
          ))}
          {(filters.operation || []).map((o) => (
            <Badge
              key={o}
              variant="secondary"
              className="cursor-pointer inline-flex"
              onClick={() =>
                onFiltersChange({
                  operation:
                    (filters.operation || []).filter((x) => x !== o) ||
                    undefined,
                })
              }
            >
              {o} ✕
            </Badge>
          ))}
          {(filters.city || []).map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="cursor-pointer inline-flex"
              onClick={() =>
                onFiltersChange({
                  city:
                    (filters.city || []).filter((x) => x !== c) || undefined,
                })
              }
            >
              {c} ✕
            </Badge>
          ))}
          {filters.priceRange && (
            <Badge
              variant="secondary"
              className="cursor-pointer inline-flex"
              onClick={() => onFiltersChange({ priceRange: undefined })}
            >
              Precio: {filters.priceRange.min}-{filters.priceRange.max} ✕
            </Badge>
          )}
          {filters.areaRange && (
            <Badge
              variant="secondary"
              className="cursor-pointer inline-flex"
              onClick={() => onFiltersChange({ areaRange: undefined })}
            >
              Área: {filters.areaRange.min}-{filters.areaRange.max} ✕
            </Badge>
          )}
        </div>
      </div>
      {/* Desktop Header - Hidden on mobile */}
      <CardHeader className="pb-4 hidden lg:block">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5 text-sidebar-primary animate-pulse" />
            Filtros
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-sidebar-primary hover:text-sidebar-primary-foreground hover:bg-sidebar-primary transition-all duration-200 hover:scale-105"
            >
              <X className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-sidebar-foreground">
          <span className="animate-in fade-in duration-300">
            {filteredCount} de {totalProperties} propiedades
          </span>
          {getActiveFiltersCount() > 0 && (
            <Badge
              variant="secondary"
              className="bg-sidebar-primary text-sidebar-primary-foreground animate-in zoom-in-50 duration-200"
            >
              {getActiveFiltersCount()} filtro
              {getActiveFiltersCount() > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Mobile Results Summary - Only on mobile */}
      <div className="lg:hidden px-4 pt-4 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="animate-in fade-in duration-300">
            {filteredCount} de {totalProperties} propiedades
          </span>
          {getActiveFiltersCount() > 0 && (
            <Badge
              variant="secondary"
              className="bg-primary text-primary-foreground animate-in zoom-in-50 duration-200"
            >
              {getActiveFiltersCount()} filtro
              {getActiveFiltersCount() > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="space-y-6">
        {/* Property Type Filter */}
        <Collapsible open={typeOpen} onOpenChange={setTypeOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline group">
            <h3 className="font-medium text-sidebar-foreground group-hover:text-sidebar-primary transition-colors duration-200">
              Tipo de Propiedad
            </h3>
            <div className="transition-transform duration-200">
              {typeOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3 animate-in slide-in-from-top-2 duration-200">
            {optionsLoading ? (
              <div className="text-sm text-muted-foreground">
                Cargando tipos...
              </div>
            ) : optionsError ? (
              <div className="text-sm text-red-500">Error: {optionsError}</div>
            ) : (
              types.map((option, index) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-3 animate-in fade-in duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Checkbox
                    id={`type-${option.id}`}
                    checked={
                      filters.type?.includes(
                        option.label.toLowerCase() as PropertyType
                      ) || false
                    }
                    onCheckedChange={(checked) =>
                      handleTypeChange(
                        option.label.toLowerCase() as PropertyType,
                        checked as boolean
                      )
                    }
                    className="transition-all duration-200 hover:scale-110"
                  />
                  <Label
                    htmlFor={`type-${option.id}`}
                    className="flex items-center gap-2 cursor-pointer text-sm font-normal hover:text-sidebar-primary transition-colors duration-200"
                  >
                    <span className="transition-transform duration-200 hover:scale-110">
                      {getPropertyIcon(option.label)}
                    </span>
                    {option.label}
                  </Label>
                </div>
              ))
            )}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="animate-in fade-in duration-300" />

        {/* Operation Type Filter */}
        <Collapsible open={operationOpen} onOpenChange={setOperationOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline group">
            <h3 className="font-medium text-sidebar-foreground group-hover:text-sidebar-primary transition-colors duration-200">
              Tipo de Operación
            </h3>
            <div className="transition-transform duration-200">
              {operationOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3 animate-in slide-in-from-top-2 duration-200">
            {optionsLoading ? (
              <div className="text-sm text-muted-foreground">
                Cargando operaciones...
              </div>
            ) : optionsError ? (
              <div className="text-sm text-red-500">Error: {optionsError}</div>
            ) : (
              operations.map((option, index) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-3 animate-in fade-in duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Checkbox
                    id={`operation-${option.id}`}
                    checked={
                      filters.operation?.includes(
                        option.label.toLowerCase() as OperationType
                      ) || false
                    }
                    onCheckedChange={(checked) =>
                      handleOperationChange(
                        option.label.toLowerCase() as OperationType,
                        checked as boolean
                      )
                    }
                    className="transition-all duration-200 hover:scale-110"
                  />
                  <Label
                    htmlFor={`operation-${option.id}`}
                    className="cursor-pointer text-sm font-normal hover:text-sidebar-primary transition-colors duration-200"
                  >
                    {option.label}
                  </Label>
                </div>
              ))
            )}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="animate-in fade-in duration-300" />

        {/* Location Filter (Provincia -> Localidad) */}
        <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline group">
            <h3 className="font-medium text-sidebar-foreground group-hover:text-sidebar-primary transition-colors duration-200">
              Ubicación
            </h3>
            <div className="transition-transform duration-200">
              {locationOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3 animate-in slide-in-from-top-2 duration-200">
            {optionsLoading ? (
              <div className="text-sm text-muted-foreground">
                Cargando localidades...
              </div>
            ) : optionsError ? (
              <div className="text-sm text-red-500">Error: {optionsError}</div>
            ) : (
              <div>
                {/* Provincia selector */}
                <div className="space-y-2">
                  <Label className="text-sm">Provincia</Label>
                  <Select
                    value={(filters as any).provinceId?.toString() || ""}
                    onValueChange={(value) =>
                      onFiltersChange({
                        provinceId: value ? (Number(value) as any) : undefined,
                        // al cambiar provincia, vaciamos localidades seleccionadas
                        city: undefined,
                      } as any)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccioná provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2" />

                {/* Localidades (solo mostrar cuando hay provincia seleccionada) */}
                {!(filters as any).provinceId && (
                  <div className="text-sm text-muted-foreground pt-1">
                    Seleccioná una provincia para ver sus localidades
                  </div>
                )}
                {(filters as any).provinceId &&
                  citiesWithProvince
                    .filter(
                      (c) =>
                        c.provinceId?.toString() ===
                        (filters as any).provinceId?.toString()
                    )
                    .map((option, index) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-3 animate-in fade-in duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Checkbox
                          id={`city-${option.id}`}
                          checked={
                            filters.city?.includes(option.label as City) ||
                            false
                          }
                          onCheckedChange={(checked) =>
                            handleCityChange(
                              option.label as City,
                              checked as boolean
                            )
                          }
                          className="transition-all duration-200 hover:scale-110"
                        />
                        <Label
                          htmlFor={`city-${option.id}`}
                          className="cursor-pointer text-sm font-normal hover:text-sidebar-primary transition-colors duration-200"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Advanced Filters Toggle */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Filtros Avanzados
            </span>
            {showAdvancedFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClear={() => {
                onFiltersChange({
                  priceRange: undefined,
                  areaRange: undefined,
                  bedrooms: undefined,
                  bathrooms: undefined,
                  features: undefined,
                });
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
