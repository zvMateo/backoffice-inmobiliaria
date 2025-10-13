import type { CreateUpdatePropiedadPayload } from "@/request/Propiedades";

export interface PropertyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validatePropertyPayload(
  payload: CreateUpdatePropiedadPayload
): PropertyValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validaciones obligatorias
  if (!payload.name?.trim()) {
    errors.push("El nombre de la propiedad es obligatorio");
  }

  if (!payload.detail?.trim()) {
    warnings.push("La descripción está vacía, considera agregar más detalles");
  }

  if (!payload.typepropertyid || payload.typepropertyid <= 0) {
    errors.push("Debe seleccionar un tipo de propiedad");
  }

  if (!payload.operationpropertyid || payload.operationpropertyid <= 0) {
    errors.push("Debe seleccionar un tipo de operación");
  }

  if (!payload.zoneid || payload.zoneid <= 0) {
    errors.push("Debe seleccionar una zona");
  }

  if (!payload.currencyid || payload.currencyid <= 0) {
    errors.push("Debe seleccionar una moneda");
  }

  if (!payload.price || payload.price <= 0) {
    errors.push("El precio debe ser mayor a 0");
  }

  if (!payload.address?.trim()) {
    warnings.push("La dirección está vacía");
  }

  if (!payload.lat || !payload.lng) {
    warnings.push("No se ha establecido una ubicación en el mapa");
  }

  // Validaciones de email y whatsapp
  if (!payload.email?.trim()) {
    errors.push("El email de contacto es obligatorio");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      errors.push("El formato del email no es válido");
    }
  }

  if (!payload.whatsapp?.trim()) {
    errors.push("El WhatsApp de contacto es obligatorio");
  } else {
    const cleanNumber = payload.whatsapp.replace(/\D/g, "");
    if (cleanNumber.length < 10) {
      errors.push("El WhatsApp debe tener al menos 10 dígitos");
    }
    if (!cleanNumber.startsWith("54")) {
      errors.push("El WhatsApp debe comenzar con +54 (Argentina)");
    }
  }

  // Validaciones de rango
  if (payload.room < 0) {
    warnings.push("El número de habitaciones no puede ser negativo");
  }

  if (payload.size < 0) {
    warnings.push("La superficie no puede ser negativa");
  }

  if (payload.room > 20) {
    warnings.push(
      "El número de habitaciones parece muy alto, verificá que sea correcto"
    );
  }

  if (payload.size > 10000) {
    warnings.push("La superficie parece muy grande, verificá que sea correcta");
  }

  // Validaciones de imágenes
  if (!payload.imagenes || payload.imagenes.length === 0) {
    warnings.push("No se han agregado imágenes de la propiedad");
  } else if (payload.imagenes.length > 10) {
    warnings.push("Se recomienda no más de 10 imágenes por propiedad");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function formatValidationMessages(
  result: PropertyValidationResult
): string {
  let message = "";

  if (result.errors.length > 0) {
    message +=
      "❌ Errores que deben corregirse:\n" +
      result.errors.map((e) => `• ${e}`).join("\n");
  }

  if (result.warnings.length > 0) {
    if (message) message += "\n\n";
    message +=
      "⚠️ Advertencias (opcional):\n" +
      result.warnings.map((w) => `• ${w}`).join("\n");
  }

  return message;
}
