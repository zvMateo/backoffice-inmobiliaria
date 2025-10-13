import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = createServerSupabaseClient()

  // Fetch base properties with coordinates
  const { data: props, error } = await supabase
    .from("propertiesai")
    .select("id, name, detail, typeproperty, operationproperty, address, zone, lat, lng, currency, price, room, size")
    .not("lat", "is", null)
    .not("lng", "is", null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const ids = (props || []).map((p: any) => p.id)

  // Fetch images per property
  const { data: imagesData, error: imagesError } = await supabase
    .from("propertiesimagesai")
    .select("propertyid, url, active")
    .in("propertyid", ids)

  if (imagesError) {
    return NextResponse.json({ error: imagesError.message }, { status: 500 })
  }

  const propertyIdToImages: Record<number, string[]> = {}
  for (const img of imagesData || []) {
    if (img.active !== false) {
      if (!propertyIdToImages[img.propertyid]) propertyIdToImages[img.propertyid] = []
      propertyIdToImages[img.propertyid].push(img.url)
    }
  }

  const mapped = (props || [])
    .filter((p: any) => p.lat && p.lng)
    .map((p: any) => {
      const lat = parseFloat(p.lat)
      const lng = parseFloat(p.lng)
      return {
        id: String(p.id),
        title: p.name || "Propiedad",
        type: (p.typeproperty || "casa").toLowerCase(),
        operation: (p.operationproperty || "venta").toLowerCase(),
        price: Number(p.price) || 0,
        currency: (p.currency || "USD").toUpperCase(),
        coordinates: { lat: isNaN(lat) ? 0 : lat, lng: isNaN(lng) ? 0 : lng },
        address: p.address || "",
        city: p.zone || "Córdoba Capital",
        photos: propertyIdToImages[p.id] && propertyIdToImages[p.id].length > 0 ? propertyIdToImages[p.id] : ["/placeholder.jpg"],
        description: p.detail || "",
        area: Number(p.size) || 0,
        bedrooms: Number(p.room) || 0,
        bathrooms: 0,
        features: [],
      }
    })

  return NextResponse.json(mapped)
}


