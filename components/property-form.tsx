"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GoogleMap } from "@/components/google-map";
import { ImageUpload } from "@/components/image-upload";
import { useTiposPropiedades } from "@/hooks/useTypesPropiedades";
import { useTiposOperaciones } from "@/hooks/useTypesOperaciones";
import { useLocalidades } from "@/hooks/useLocalidades";
import { useZonasAll } from "@/hooks/useZonas";
import { useMonedas } from "@/hooks/useMonedas";
import { usePropiedadById } from "@/hooks/useInmobiliaria";
import {
  useCrearPropiedad,
  useActualizarPropiedad,
} from "@/hooks/usePropiedades";
import { usePropiedadById as usePropiedadByIdLocal } from "@/hooks/usePropiedades";
import { usePropertyMapById } from "@/app/mapa-inmobiliaria/_hooks/usePropertyMapById";
import { useProvincias } from "@/hooks/useProvincias";
import type { CreateUpdatePropiedadPayload } from "@/request/Propiedades";
import { validatePropertyPayload, formatValidationMessages } from "@/lib/property-validation";

interface PropertyFormData {
  name: string;
  detail: string;
  typePropertyId: string;
  operationPropertyId: string;
  provinceId: string;
  localityId: string; // Added locality selection
  zoneId: string;
  address: string;
  currencyId: string;
  price: string;
  room: string;
  size: string;
  furnished: boolean;
  pet: boolean;
  parking: boolean;
  terrace: boolean;
  email: string;
  whatsapp: string;
}

interface SelectOption {
  id: number;
  name: string;
}

export function PropertyForm({
  propertyId,
  initialData,
}: {
  propertyId?: string | number;
  initialData?: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const tiposProps = useTiposPropiedades();
  const tiposOps = useTiposOperaciones();
  const localidadesQuery = useLocalidades();
  const zonasQuery = useZonasAll();
  const monedasQuery = useMonedas();
  const provinciasQuery = useProvincias();
  const detalleQuery = usePropiedadByIdLocal(propertyId ?? null);
  const detalleQueryFallback = usePropiedadById(propertyId ?? null);
  const detalleQueryMap = usePropertyMapById(propertyId ? String(propertyId) : null);
  const crearMut = useCrearPropiedad();
  const actualizarMut = useActualizarPropiedad();

  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [images, setImages] = useState<string[]>([]); // Added images state

  // Estados de validación
  const [errors, setErrors] = useState({
    email: "",
    whatsapp: "",
    price: "",
  });

  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    detail: "",
    typePropertyId: "",
    operationPropertyId: "",
    provinceId: "",
    localityId: "", // Added locality field
    zoneId: "",
    address: "",
    currencyId: "",
    price: "",
    room: "",
    size: "",
    furnished: false,
    pet: false,
    parking: false,
    terrace: false,
    email: "",
    whatsapp: "",
  });

  // Funciones de validación
  const validateEmail = (email: string): string => {
    if (!email) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
      ? ""
      : "Email inválido (ej: nombre@ejemplo.com)";
  };

  const validateWhatsApp = (whatsapp: string): string => {
    if (!whatsapp) return "";
    // Formato esperado: +54 9 11 1234-5678 o +54 9 11 12345678
    const cleanNumber = whatsapp.replace(/\D/g, "");
    if (cleanNumber.length < 10) {
      return "WhatsApp debe tener al menos 10 dígitos";
    }
    if (!cleanNumber.startsWith("54")) {
      return "WhatsApp debe comenzar con +54 (Argentina)";
    }
    return "";
  };

  const formatWhatsApp = (value: string): string => {
    // Remover todo excepto números
    const cleaned = value.replace(/\D/g, "");

    // Si empieza con 54, formatear como +54 9 11 xxxx-xxxx
    if (cleaned.startsWith("54") && cleaned.length >= 4) {
      const country = "54";
      const rest = cleaned.substring(2);

      if (rest.length === 0) return `+${country}`;
      if (rest.length <= 1) return `+${country} ${rest}`;

      const area = rest.substring(0, Math.min(2, rest.length));
      const remaining = rest.substring(2);

      if (remaining.length === 0) return `+${country} 9 ${area}`;
      if (remaining.length <= 4) return `+${country} 9 ${area} ${remaining}`;

      const first = remaining.substring(0, 4);
      const second = remaining.substring(4, 8);

      return `+${country} 9 ${area} ${first}${second ? `-${second}` : ""}`;
    }

    // Si no empieza con 54, agregar +54 9
    if (cleaned.length > 0 && !cleaned.startsWith("54")) {
      return formatWhatsApp(`54${cleaned}`);
    }

    return value;
  };

  const formatPrice = (value: string): string => {
    // Remover todo excepto números y punto decimal
    const cleaned = value.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.length > 1 ? `${intPart},${parts[1]}` : intPart;
  };

  // Preparar datos para los selects
  const toArray = (d: any): any[] =>
    Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
  const types = toArray(tiposProps.data) as unknown as SelectOption[];
  const operations = toArray(tiposOps.data) as unknown as SelectOption[];

  const localitiesRaw = toArray(localidadesQuery.data) as any[];
  const zonesRaw = toArray(zonasQuery.data) as any[];
  const provincesRaw = toArray(provinciasQuery.data) as any[];
  const provinces: SelectOption[] = provincesRaw.map((p: any) => ({
    id: p.id,
    name: p.name,
  }));
  const filteredLocalities = localitiesRaw.filter((l: any) => {
    if (!formData.provinceId) return true;
    const provId = l.provinceId ?? l.provinceid;
    return provId?.toString() === formData.provinceId;
  });
  const localities: SelectOption[] = filteredLocalities.map((l: any) => ({
    id: l.id,
    name: l.name,
  }));
  const filteredZones = zonesRaw.filter((z: any) => {
    if (!formData.localityId) return false; // mostrar solo si hay localidad
    const locId = z.localidadId ?? z.localidadid;
    return locId?.toString() === formData.localityId;
  });
  const zones: SelectOption[] = filteredZones.map((z: any) => ({
    id: z.id,
    name: z.name,
  }));
  const currencies = toArray(monedasQuery.data) as unknown as SelectOption[];

  // Cargar detalle cuando esté disponible (desde prop, query local, query fallback o query del mapa)
  useEffect(() => {
    const data = initialData || detalleQuery.data || detalleQueryFallback.data || detalleQueryMap.data;
    
    // Debug: ver qué datos estamos recibiendo
    console.log("🔍 PropertyForm - Datos recibidos:", {
      propertyId,
      hasInitialData: !!initialData,
      hasDetalleQuery: !!detalleQuery.data,
      hasDetalleQueryFallback: !!detalleQueryFallback.data,
      hasDetalleQueryMap: !!detalleQueryMap.data,
      finalData: data,
      detalleQueryStatus: detalleQuery.status,
      detalleQueryFallbackStatus: detalleQueryFallback.status,
      detalleQueryMapStatus: detalleQueryMap.status,
    });
    
    if (!data) return;

      const newFormData = {
      name: data.name || data.nombre || "",
      detail: data.detail || data.detalle || "",
      typePropertyId: (
        data.typepropertyid ??
        data.typePropertyId ??
        data.typeproperty?.id ??
        ""
      ).toString(),
      operationPropertyId: (
        data.operationpropertyid ??
        data.operationPropertyId ??
        data.operationproperty?.id ??
        ""
      ).toString(),
      provinceId: (
        data.provinceid ?? 
        data.provinceId ?? 
        data.province?.id ?? 
        ""
      ).toString(),
      localityId: (
        data.localityid ?? 
        data.localityId ?? 
        data.locality?.id ?? 
        ""
      ).toString(),
      zoneId: (
        data.zoneid ?? 
        data.zoneId ?? 
        data.zone?.id ?? 
        ""
      ).toString(),
      address: data.address || data.direccion || "",
      currencyId: (
        data.currencyid ?? 
        data.currencyId ?? 
        data.currency?.id ?? 
        ""
      ).toString(),
      price: (data.price ?? data.precio ?? "").toString(),
      room: (data.room ?? data.habitaciones ?? "").toString(),
      size: (data.size ?? "").toString(),
      furnished: !!data.furnished,
      pet: !!data.pet,
      parking: !!data.parking,
      terrace: !!data.terrace,
      email: (data.contacto as any)?.email || data.email || data.contact?.email || "",
      whatsapp: (data.contacto as any)?.whatsapp || data.whatsapp || data.contact?.whatsapp || "",
    } as PropertyFormData;
    
    console.log("📝 PropertyForm - Datos mapeados al formulario:", {
      originalData: data,
      mappedFormData: newFormData
    });
    
    setFormData(newFormData);
    if (data.lat && data.lng) {
      setCoordinates({ lat: data.lat.toString(), lng: data.lng.toString() });
    }
    if (data.imagenes || data.images) {
      setImages(data.imagenes || data.images || []);
    }
  }, [initialData, detalleQuery.data, detalleQueryFallback.data, detalleQueryMap.data]);

  useEffect(() => {
    // al cambiar provincia, resetear localidad y zona
    setFormData((prev) => ({ ...prev, localityId: "", zoneId: "" }));
  }, [formData.provinceId]);

  useEffect(() => {
    // al cambiar localidad, resetear zona
    setFormData((prev) => ({ ...prev, zoneId: "" }));
  }, [formData.localityId]);

  // filtrado ya se hace en memoria con zonesRaw/localitiesRaw

  // Eliminado fetchProperty con Supabase; usamos detalleQuery

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const selectedType = types.find(
      (t) => t.id.toString() === formData.typePropertyId
    );
    const selectedOperation = operations.find(
      (o) => o.id.toString() === formData.operationPropertyId
    );
    const selectedZone = zones.find((z) => z.id.toString() === formData.zoneId);
    const selectedCurrency = currencies.find(
      (c) => c.id.toString() === formData.currencyId
    );

    const propertyData = {
      name: formData.name,
      detail: formData.detail,
      typepropertyid: Number.parseInt(formData.typePropertyId), // using lowercase field name
      typeproperty: selectedType?.name, // using lowercase field name
      operationpropertyid: Number.parseInt(formData.operationPropertyId), // using lowercase field name
      operationproperty: selectedOperation?.name, // using lowercase field name
      zoneid: Number.parseInt(formData.zoneId), // using lowercase field name
      zone: selectedZone?.name,
      address: formData.address,
      lat: coordinates.lat,
      lng: coordinates.lng,
      currencyid: Number.parseInt(formData.currencyId), // using lowercase field name
      currency: selectedCurrency?.name,
      price: Number.parseFloat(formData.price),
      room: Number.parseInt(formData.room),
      size: Number.parseFloat(formData.size),
      furnished: formData.furnished,
      pet: formData.pet,
      parking: formData.parking,
      terrace: formData.terrace,
    };

    // Validar antes de enviar
    const emailError = validateEmail(formData.email);
    const whatsappError = validateWhatsApp(formData.whatsapp);

    if (emailError || whatsappError) {
      setErrors({
        email: emailError,
        whatsapp: whatsappError,
        price: "",
      });
      alert("Por favor corregí los errores en el formulario antes de guardar.");
      setLoading(false);
      return;
    }

    // Limpiar precio formateado (remover puntos y reemplazar coma por punto)
    const cleanPrice = formData.price.replace(/\./g, "").replace(/,/g, ".");

    // Mapear payload según API
    const payload: CreateUpdatePropiedadPayload = {
      name: formData.name,
      detail: formData.detail,
      typepropertyid: Number(formData.typePropertyId) || 0,
      operationpropertyid: Number(formData.operationPropertyId) || 0,
      zoneid: Number(formData.zoneId) || 0,
      currencyid: Number(formData.currencyId) || 0,
      price: Number(cleanPrice) || 0,
      room: Number(formData.room) || 0,
      size: Number(formData.size) || 0,
      furnished: formData.furnished,
      pet: formData.pet,
      parking: formData.parking,
      terrace: formData.terrace,
      address: formData.address,
      lat: coordinates.lat || "",
      lng: coordinates.lng || "",
      whatsapp: formData.whatsapp,
      email: formData.email,
      active: true,
      imagenes: images,
    };

    try {
      // Validar el payload antes de enviar
      const validationResult = validatePropertyPayload(payload);
      
      if (!validationResult.isValid) {
        const message = formatValidationMessages(validationResult);
        alert(message);
        setLoading(false);
        return;
      }
      
      // Mostrar advertencias si las hay
      if (validationResult.warnings.length > 0) {
        const warningMessage = "⚠️ Advertencias:\n" + validationResult.warnings.map(w => `• ${w}`).join("\n") + "\n\n¿Deseas continuar?";
        if (!confirm(warningMessage)) {
          setLoading(false);
          return;
        }
      }

      if (propertyId) {
        // Agregar el id al payload para la actualización
        await actualizarMut.mutateAsync({ id: propertyId, ...payload });
        console.log(`✅ Propiedad ${propertyId} actualizada exitosamente`);
      } else {
        await crearMut.mutateAsync(payload);
        console.log("✅ Nueva propiedad creada exitosamente");
      }
      router.push("/properties");
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar la propiedad");
    }

    setLoading(false);
  }

  const handleAddressChange = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
  };

  const handleCoordinatesChange = (lat: string, lng: string) => {
    setCoordinates({ lat, lng });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/*
        Layout responsive del formulario:
        - 1 columna en mobile, 2 columnas en ≥md
        - gaps consistentes para mejor legibilidad
      */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="detail">Descripción</Label>
              <Textarea
                id="detail"
                value={formData.detail}
                onChange={(e) =>
                  setFormData({ ...formData, detail: e.target.value })
                }
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="typeProperty">Tipo de Propiedad</Label>
              <Select
                value={formData.typePropertyId}
                onValueChange={(value) =>
                  setFormData({ ...formData, typePropertyId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="operationProperty">Tipo de Operación</Label>
              <Select
                value={formData.operationPropertyId}
                onValueChange={(value) =>
                  setFormData({ ...formData, operationPropertyId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una operación" />
                </SelectTrigger>
                <SelectContent>
                  {operations.map((operation) => (
                    <SelectItem
                      key={operation.id}
                      value={operation.id.toString()}
                    >
                      {operation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubicación y Precio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="locality">Localidad</Label>
              <Select
                value={formData.localityId}
                onValueChange={(value) =>
                  setFormData({ ...formData, localityId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una localidad" />
                </SelectTrigger>
                <SelectContent>
                  {localities.map((locality) => (
                    <SelectItem
                      key={locality.id}
                      value={locality.id.toString()}
                    >
                      {locality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="zone">Zona</Label>
              <Select
                value={formData.zoneId}
                onValueChange={(value) =>
                  setFormData({ ...formData, zoneId: value })
                }
                disabled={!formData.localityId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      formData.localityId
                        ? "Selecciona una zona"
                        : "Primero selecciona una localidad"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id.toString()}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview de Ubicación en Mapa */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  📍 Preview de Ubicación
                </Label>
                {coordinates.lat && coordinates.lng && (
                  <span className="text-xs text-muted-foreground">
                    {Number(coordinates.lat).toFixed(4)},{" "}
                    {Number(coordinates.lng).toFixed(4)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Buscá una dirección, hacé click en el mapa o arrastrá el pin
                para establecer la ubicación
              </p>
              <div className="border rounded-lg overflow-hidden shadow-sm">
            <GoogleMap
              address={formData.address}
              lat={coordinates.lat}
              lng={coordinates.lng}
              onAddressChange={handleAddressChange}
              onCoordinatesChange={handleCoordinatesChange}
            />
              </div>
              {!coordinates.lat && !coordinates.lng && (
                <p className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>Por favor seleccioná una ubicación en el mapa</span>
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={formData.currencyId}
                onValueChange={(value) =>
                  setFormData({ ...formData, currencyId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una moneda" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id.toString()}
                    >
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="text"
                value={formData.price}
                onChange={(e) => {
                  // Solo permitir números y punto decimal
                  const value = e.target.value.replace(/[^\d.]/g, "");
                  setFormData({ ...formData, price: value });
                }}
                onBlur={(e) => {
                  // Formatear con separador de miles al perder el foco
                  const value = e.target.value.replace(/[^\d.]/g, "");
                  if (value) {
                    const formatted = formatPrice(value);
                    setFormData({ ...formData, price: formatted });
                  }
                }}
                placeholder="10.000 o 10.000,50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Se formateará automáticamente (ej: 150000 → 150.000)
              </p>
            </div>

            <div>
              <Label htmlFor="email">Email de contacto</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  const newEmail = e.target.value;
                  setFormData({ ...formData, email: newEmail });
                  setErrors({ ...errors, email: validateEmail(newEmail) });
                }}
                className={
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp de contacto</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => {
                  const formatted = formatWhatsApp(e.target.value);
                  setFormData({ ...formData, whatsapp: formatted });
                  setErrors({
                    ...errors,
                    whatsapp: validateWhatsApp(formatted),
                  });
                }}
                placeholder="+54 9 11 1234-5678"
                className={
                  errors.whatsapp
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                required
              />
              {errors.whatsapp && (
                <p className="text-sm text-red-500 mt-1">{errors.whatsapp}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Propiedad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="room">Habitaciones</Label>
              <Input
                id="room"
                type="number"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="size">Superficie (m²)</Label>
              <Input
                id="size"
                type="number"
                step="0.01"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="furnished"
                checked={formData.furnished}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, furnished: !!checked })
                }
              />
              <Label htmlFor="furnished">Amoblado</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="pet"
                checked={formData.pet}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, pet: !!checked })
                }
              />
              <Label htmlFor="pet">Permite mascotas</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="parking"
                checked={formData.parking}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, parking: !!checked })
                }
              />
              <Label htmlFor="parking">Cochera</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="terrace"
                checked={formData.terrace}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, terrace: !!checked })
                }
              />
              <Label htmlFor="terrace">Terraza</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Imágenes de la Propiedad</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
            />
          </CardContent>
        </Card>
      </div>

      {/* Botonera: en mobile apila y ancho completo */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          type="submit"
          disabled={loading || crearMut.isPending || actualizarMut.isPending}
        >
          {loading
            ? "Guardando..."
            : propertyId
            ? "Actualizar Propiedad"
            : "Crear Propiedad"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/properties")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
