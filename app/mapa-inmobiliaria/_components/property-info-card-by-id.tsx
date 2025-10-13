"use client";

import { PropertyInfoCard } from "./property-info-card";
import { usePropertyMapById } from "../_hooks/usePropertyMapById";
import type { Property } from "@/types/property";
import { mapOperation, mapType } from "../_utils/property-mapping";

function mapCurrency(moneda: string | undefined): "USD" | "ARS" {
  const n = (moneda || "").toLowerCase();
  if (n.includes("usd") || n.includes("dólar") || n.includes("dolar"))
    return "USD";
  return "ARS";
}

export function PropertyInfoCardById({
  id,
  onViewDetails,
  onContact,
  onContactOptions,
}: {
  id: string;
  onViewDetails: () => void;
  onContact: () => void;
  onContactOptions?: (opts: { wa?: string; email?: string }) => void;
}) {
  const { data, isLoading, isError } = usePropertyMapById(id);

  if (isLoading) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-sm text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-sm text-destructive">
        No se pudo cargar la propiedad
      </div>
    );
  }

  const photos =
    Array.isArray(data.imagenes) && data.imagenes.length > 0
      ? data.imagenes
      : ["/placeholder.svg"];

  const mapped: Property = {
    id: String(data.id),
    title: data.name || "Propiedad",
    type: mapType(
      (data as any).typeproperty ||
        (data as any).tipoPropiedad ||
        (data as any).tipo
    ),
    operation: mapOperation(
      (data as any).operationproperty ||
        (data as any).tipoOperacion ||
        (data as any).operacion
    ),
    price: Number(data.price) || 0,
    currency: mapCurrency(data.moneda),
    formattedPrice: (data as any).precioFormateado || undefined,
    coordinates: { lat: Number(data.lat) || 0, lng: Number(data.lng) || 0 },
    address: data.address || data.zona || "",
    city: (data.zona || "Córdoba Capital") as any,
    photos,
    description: (data.detail || "").trim(),
    area: Number(data.size) || 0,
    bedrooms: Number(data.room) || 0,
    bathrooms: 0,
    features: [
      ...(data.parking ? ["garage"] : []),
      ...(data.furnished ? ["furnished"] : []),
      ...(data.pet ? ["pet-friendly"] : []),
      ...(data.terrace ? ["terrace"] : []),
    ],
  };

  const handleContact = () => {
    const wa = (data.contacto as any)?.whatsapp as string | null | undefined;
    const mail = (data.contacto as any)?.email as string | null | undefined;
    if (onContactOptions) {
      onContactOptions({ wa: wa || undefined, email: mail || undefined });
      return;
    }
    if (wa && typeof wa === "string" && wa.trim()) {
      const digits = wa.replace(/\D+/g, "");
      const text = encodeURIComponent(
        `Hola, consulto por "${data.name}" (ID ${data.id}).`
      );
      window.open(`https://wa.me/${digits}?text=${text}`, "_blank");
      return;
    }
    if (mail && typeof mail === "string" && mail.trim()) {
      const subject = encodeURIComponent(`Consulta por ${data.name}`);
      const body = encodeURIComponent(
        `Hola, me interesa la propiedad "${data.name}" (ID ${data.id}).`
      );
      window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
      return;
    }
    onContact();
  };

  return (
    <PropertyInfoCard
      property={mapped}
      onViewDetails={onViewDetails}
      onContact={handleContact}
    />
  );
}
