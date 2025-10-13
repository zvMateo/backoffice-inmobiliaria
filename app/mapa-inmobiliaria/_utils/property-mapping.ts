// Utilidades compartidas para mapeo de propiedades
// Evita duplicar código entre property-info-card.tsx, property-info-card-by-id.tsx y property-detail-by-id.tsx

import type { PropertyType, OperationType } from "@/types/property";

export function mapOperation(op?: string): OperationType {
  const n = (op || "").toLowerCase().trim();
  if (n.includes("venta")) return "venta";
  if (n.includes("compra")) return "compra";
  if (n.includes("diario") || n.includes("temporal"))
    return "alquiler temporal";
  if (n.includes("mensual")) return "alquiler mensual";
  return "venta"; // Default fallback
}

export function mapType(tipo?: string): PropertyType {
  const n = (tipo || "").toLowerCase().trim();
  if (n.includes("departamento")) return "departamento";
  if (n.includes("duplex")) return "duplex";
  if (n.includes("oficina")) return "oficina";
  if (n.includes("local")) return "local";
  if (n.includes("terreno") || n.includes("lote")) return "terreno";
  if (n.includes("campo")) return "campo";
  if (n.includes("casa")) return "casa";
  return "casa"; // Default fallback
}

export function getOperationColor(operation: string): string {
  const normalizedOperation = operation.toLowerCase().trim();
  switch (normalizedOperation) {
    case "venta":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "compra":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
    case "alquiler mensual":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "alquiler temporal":
    case "alquiler diario/temporal":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

export function getTypeColor(type: string): string {
  const normalizedType = type.toLowerCase().trim();
  switch (normalizedType) {
    case "casa":
    case "duplex":
      return "bg-emerald-100 text-emerald-800";
    case "departamento":
      return "bg-blue-100 text-blue-800";
    case "oficina":
      return "bg-amber-100 text-amber-800";
    case "local":
    case "local comercial":
      return "bg-red-100 text-red-800";
    case "terreno":
      return "bg-violet-100 text-violet-800";
    case "campo":
      return "bg-cyan-100 text-cyan-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
