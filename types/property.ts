export type PropertyType = "campo" | "terreno" | "oficina" | "local" | "departamento" | "casa" | "duplex"
export type OperationType = "venta" | "alquiler mensual" | "alquiler temporal" | "compra"
export type Currency = "ARS" | "USD"
export type City = "Córdoba Capital" | "Villa del Rosario"

export interface Property {
  id: string
  title: string
  type: PropertyType
  operation: OperationType
  price: number
  currency: Currency
  formattedPrice?: string
  coordinates: {
    lat: number
    lng: number
  }
  address: string
  city: City
  photos: string[]
  description: string
  area: number // Square meters
  bedrooms: number
  bathrooms: number
  features: string[] // e.g., ["garage", "balcony", "pool", "garden"]
}

export interface PropertyFilters {
  type?: PropertyType[]
  operation?: OperationType[]
  city?: City[]
  priceRange?: {
    min: number
    max: number
  }
  currency?: Currency
  areaRange?: {
    min: number
    max: number
  }
  bedrooms?: number[]
  bathrooms?: number[]
  features?: string[]
}


export interface GetPropierties {
  id: number
  name: string
  typeproperty: string
  zone?: string
  price?: number
  currency?: string
  precio?: string
}

export interface GetTypesFilters {
  properties: Propierties[]
  operationsType: OperationsType[]
  localities: Localities[]
}

export interface Propierties {
  id: number
  name: string
}

export interface OperationsType {
  id: number
  name: string
}

export interface Localities {
  id: number
  name: string
}


export interface GetPropiertiesMap {
  id: number
  name: string
  typeproperty: string
  zone: string
  price: number
  size: number
  room: number
  parking: boolean
  furnished: boolean
  lat: string
  lng: string
  pet: boolean
  terrace: boolean
}

export interface GetPropiertiesMapiD {
  id: number
  name: string
  detail: string
  price: number
  moneda: string
  tipo: string
  operacion: string
  zona: string
  address: string
  lat: string
  lng: string
  room: number
  size: number
  furnished: boolean
  pet: boolean
  parking: boolean
  terrace: boolean
  contacto: Contacto
  imagenes: string[]
}

export interface Contacto {
  whatsapp: any
  email: any
}


export interface GetLocalities {
  id: number
  name: string
  active: boolean
  provinceid: number
  zonesais: any[]
}