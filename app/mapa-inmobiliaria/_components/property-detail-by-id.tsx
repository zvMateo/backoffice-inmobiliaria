"use client";

import { usePropertyMapById } from "../_hooks/usePropertyMapById";
import { useEliminarPropiedad } from "@/hooks/usePropiedades";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Navigation,
  Share2,
  BedDouble,
  Bath,
  Ruler,
  Edit,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { mapOperation, mapType, getOperationColor, getTypeColor } from "../_utils/property-mapping";

function mapCurrency(moneda?: string): "USD" | "ARS" {
  const n = (moneda || "").toLowerCase();
  if (n.includes("usd") || n.includes("dólar") || n.includes("dolar"))
    return "USD";
  return "ARS";
}

export function PropertyDetailById({
  id,
  onContact,
  onContactOptions,
  onPropertyDeleted,
  showAdminActions = true,
}: {
  id: string;
  onContact: () => void;
  onContactOptions?: (opts: {
    wa?: string;
    email?: string;
    title?: string;
  }) => void;
  onPropertyDeleted?: () => void;
  showAdminActions?: boolean;
}) {
  const { data, isLoading, isError } = usePropertyMapById(id);
  const deleteMutation = useEliminarPropiedad();
  const { toast } = useToast();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading)
    return (
      <div className="p-4 text-sm text-muted-foreground">Cargando detalle…</div>
    );
  if (isError || !data)
    return (
      <div className="p-4 text-sm text-destructive">
        No se pudo cargar la propiedad
      </div>
    );

  const photos =
    Array.isArray(data.imagenes) && data.imagenes.length > 0
      ? data.imagenes
      : [];
  const currency = mapCurrency(data.moneda);
  const priceNumber = Number(data.price) || 0;
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price);

  const wa = (data.contacto as any)?.whatsapp as string | undefined;
  const email = (data.contacto as any)?.email as string | undefined;

  // Mapear tipo y operación usando las mismas funciones que la card
  const mappedType = mapType((data as any).typeproperty || (data as any).tipoPropiedad || (data as any).tipo);
  const mappedOperation = mapOperation((data as any).operationproperty || (data as any).tipoOperacion || (data as any).operacion);

  const onShare = () => {
    const url = `${window.location.origin}/properties/${data.id}`;
    if (navigator.share) {
      navigator.share({ title: data.name, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  const handleEdit = () => {
    router.push(`/properties/${data.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(Number(data.id));
      toast({
        title: "✅ Propiedad eliminada",
        description: `La propiedad "${data.name}" fue eliminada correctamente.`,
      });
      setDeleteDialogOpen(false);
      
      // Cerrar el drawer y actualizar el mapa
      if (onPropertyDeleted) {
        onPropertyDeleted();
      } else {
        // Fallback: navegar a la lista de propiedades
        router.push('/properties');
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message;

      toast({
        title: "❌ Error al eliminar",
        description:
          status === 500
            ? `Error 500 del servidor. Consultá con el backend.`
            : message || "No se pudo eliminar la propiedad.",
        variant: "destructive",
      });

      console.error("Error al eliminar propiedad:", {
        id: data.id,
        error,
        status,
        message,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header minimal */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-foreground truncate">
            {data.name || "Propiedad"}
          </h2>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Badge
              variant="outline"
              className={`${getOperationColor(mappedOperation)} transition-all duration-200 hover:scale-105`}
            >
              {mappedOperation}
            </Badge>
            <Badge
              variant="outline"
              className={`${getTypeColor(mappedType)} transition-all duration-200 hover:scale-105`}
            >
              {mappedType}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">
              {(data.address && data.address.trim()) || data.zona || ""}
            </span>
          </div>
        </div>
        <div className="text-right whitespace-nowrap">
          <div className="text-lg font-semibold">
            {formatPrice(priceNumber)}
          </div>
          <div className="text-xs text-muted-foreground">{currency}</div>
        </div>
      </div>

      {/* Media + Specs responsive grid (con carrusel) */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {/* Hero image */}
        <div className="sm:col-span-3">
          {photos.length === 0 ? (
            <div className="w-full aspect-video rounded-lg border bg-muted" />
          ) : (
            <div
              className="relative group"
              onTouchStart={(e) => setTouchStartX(e.changedTouches[0].clientX)}
              onTouchMove={(e) => setTouchEndX(e.changedTouches[0].clientX)}
              onTouchEnd={() => {
                if (touchStartX === null || touchEndX === null) return;
                const delta = touchStartX - touchEndX;
                if (Math.abs(delta) > 40) {
                  if (delta > 0) setCurrent((i) => (i + 1) % photos.length);
                  else
                    setCurrent((i) => (i - 1 + photos.length) % photos.length);
                }
                setTouchStartX(null);
                setTouchEndX(null);
              }}
            >
              <img
                src={photos[current]}
                alt="principal"
                className="w-full aspect-video object-cover rounded-lg border"
              />
              {photos.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full h-8 w-8 grid place-items-center sm:opacity-0 group-hover:opacity-100 transition"
                    onClick={() =>
                      setCurrent((i) => (i - 1 + photos.length) % photos.length)
                    }
                    aria-label="Anterior"
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full h-8 w-8 grid place-items-center sm:opacity-0 group-hover:opacity-100 transition"
                    onClick={() => setCurrent((i) => (i + 1) % photos.length)}
                    aria-label="Siguiente"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}
          {photos.length > 1 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {photos.slice(0, 8).map((src: string, i: number) => (
                <img
                  key={i}
                  src={src}
                  alt={`thumb-${i + 1}`}
                  className={`w-full h-16 object-cover rounded border cursor-pointer ${
                    i === current ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          )}
        </div>
        {/* Specs */}
        <div className="sm:col-span-2 grid grid-cols-3 sm:grid-cols-1 gap-2 h-fit">
          <div className="flex items-center gap-2 rounded-lg border p-2 text-sm text-foreground">
            <BedDouble className="h-4 w-4" /> {Number(data.room) || 0} dorm
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-2 text-sm text-foreground">
            <Bath className="h-4 w-4" /> {0} baños
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-2 text-sm text-foreground">
            <Ruler className="h-4 w-4" /> {Number(data.size) || 0} m²
          </div>
        </div>
      </div>

      {/* Descripción */}
      {data.detail && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium tracking-tight">Descripción</h3>
          <p
            className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words"
            style={
              expanded
                ? undefined
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 10,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
            }
          >
            {(data.detail || "").trim()}
          </p>
          {(data.detail || "").length > 600 && (
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      )}

      {/* Mapa embebido removido por preferencia del usuario */}

      {/* Acciones */}
      <div className="space-y-3">
        {/* Acciones principales */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              if (onContactOptions) {
                onContactOptions({ wa, email, title: data.name });
              } else {
                onContact();
              }
            }}
          >
            Contactar
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${data.lat},${data.lng}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-4 w-4 mr-2" /> Cómo llegar
            </a>
          </Button>
          <Button variant="ghost" onClick={onShare} className="sm:w-auto">
            <Share2 className="h-4 w-4 mr-2" /> Compartir
          </Button>
        </div>

        {/* Acciones administrativas */}
        {showAdminActions && (
          <div className="border-t pt-3">
            <div className="mb-2">
              <p className="text-xs text-muted-foreground">
                🔧 Acciones administrativas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleEdit}
                disabled={deleteMutation.isPending}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Propiedad
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Propiedad
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la
              propiedad <strong>"{data.name}"</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Lightbox fuera del return para evitar JSX extra al final (si se requiere global, mover a parent)
