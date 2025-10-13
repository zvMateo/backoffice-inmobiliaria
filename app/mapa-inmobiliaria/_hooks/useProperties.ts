"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import type { Property, PropertyFilters } from "@/types/property"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useProperties() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const parseFiltersFromParams = (): PropertyFilters => {
    const getArray = (key: string) => (searchParams.get(key)?.split(",").filter(Boolean) as any) || undefined
    const num = (v: string | null) => (v ? Number(v) : undefined)
    const priceMin = num(searchParams.get("priceMin"))
    const priceMax = num(searchParams.get("priceMax"))
    const areaMin = num(searchParams.get("areaMin"))
    const areaMax = num(searchParams.get("areaMax"))
    return {
      type: getArray("type"),
      operation: getArray("operation"),
      city: getArray("city"),
      priceRange: priceMin !== undefined || priceMax !== undefined ? { min: priceMin || 0, max: priceMax || 0 } : undefined,
      areaRange: areaMin !== undefined || areaMax !== undefined ? { min: areaMin || 0, max: areaMax || 0 } : undefined,
      bedrooms: getArray("bedrooms")?.map((x: string) => Number(x)) as any,
      bathrooms: getArray("bathrooms")?.map((x: string) => Number(x)) as any,
      currency: (searchParams.get("currency") as any) || undefined,
      features: getArray("features"),
    }
  }

  const [filters, setFilters] = useState<PropertyFilters>(parseFiltersFromParams())
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/properties-map", { cache: "no-store" })
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`)
        }
        
        const json = await res.json()
        
        if (json.error) {
          throw new Error(json.error)
        }
        
        setAllProperties(json || [])
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Error desconocido al cargar propiedades"
        console.error("Error cargando propiedades del mapa:", e)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Debounce update URL when filters change
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      const setOrDelete = (key: string, value?: string | string[]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          params.delete(key)
          return
        }
        params.set(key, Array.isArray(value) ? value.join(",") : value)
      }

      setOrDelete("type", filters.type as any)
      setOrDelete("operation", filters.operation as any)
      setOrDelete("city", filters.city as any)
      if (filters.priceRange) {
        params.set("priceMin", String(filters.priceRange.min))
        params.set("priceMax", String(filters.priceRange.max))
      } else {
        params.delete("priceMin"); params.delete("priceMax")
      }
      if (filters.areaRange) {
        params.set("areaMin", String(filters.areaRange.min))
        params.set("areaMax", String(filters.areaRange.max))
      } else {
        params.delete("areaMin"); params.delete("areaMax")
      }
      setOrDelete("bedrooms", (filters.bedrooms as any)?.map(String))
      setOrDelete("bathrooms", (filters.bathrooms as any)?.map(String))
      setOrDelete("currency", filters.currency as any)
      setOrDelete("features", filters.features as any)

      router.replace(pathname + "?" + params.toString())
    }, 250)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [filters])

  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      // Filter by type
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(property.type)) return false
      }

      // Filter by operation
      if (filters.operation && filters.operation.length > 0) {
        if (!filters.operation.includes(property.operation)) return false
      }

      // Filter by city
      if (filters.city && filters.city.length > 0) {
        if (!filters.city.includes(property.city)) return false
      }

      // Filter by price range
      if (filters.priceRange && filters.currency) {
        const propertyPrice =
          property.currency === filters.currency
            ? property.price
            : property.currency === "USD"
              ? property.price * 1000 // Simple conversion for demo
              : property.price / 1000

        if (propertyPrice < filters.priceRange.min || propertyPrice > filters.priceRange.max) {
          return false
        }
      }

      // Filter by area (square meters)
      if (filters.areaRange) {
        if (property.area < filters.areaRange.min || property.area > filters.areaRange.max) {
          return false
        }
      }

      // Filter by bedrooms
      if (filters.bedrooms && filters.bedrooms.length > 0) {
        if (!filters.bedrooms.includes(property.bedrooms)) return false
      }

      // Filter by bathrooms
      if (filters.bathrooms && filters.bathrooms.length > 0) {
        if (!filters.bathrooms.includes(property.bathrooms)) return false
      }

      // Filter by features
      if (filters.features && filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature => 
          property.features.includes(feature)
        )
        if (!hasAllFeatures) return false
      }

      return true
    })
  }, [filters])

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  return {
    properties: filteredProperties,
    allProperties,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    selectedProperty,
    setSelectedProperty,
  }
}
