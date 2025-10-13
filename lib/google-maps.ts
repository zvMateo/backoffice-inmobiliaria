export async function getGoogleMapsApiKey(): Promise<string | null> {
  // En cliente sólo están disponibles variables que empiezan con NEXT_PUBLIC_
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || ""

  if (!apiKey) {
    console.error("Google Maps API key not found in environment variables")
    return null
  }

  return apiKey
}
