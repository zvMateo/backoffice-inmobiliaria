"use client";

import { Sidebar } from "@/components/sidebar";
import { PropertyForm } from "@/components/property-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetPropertyById } from "@/hooks/useProperties";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function EditPropertyPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: property, isLoading, error } = useGetPropertyById(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 w-full">
          <div className="p-4 sm:p-6 lg:p-8">
            <Card>
              <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Cargando propiedad...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 w-full">
          <div className="p-4 sm:p-6 lg:p-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-destructive text-5xl">⚠️</div>
                  <h2 className="text-xl font-semibold">
                    Error al cargar la propiedad
                  </h2>
                  <p className="text-muted-foreground">
                    {error
                      ? `Error: ${
                          (error as any)?.response?.status || "Desconocido"
                        } - ${
                          (error as any)?.message ||
                          "No se pudo cargar la propiedad"
                        }`
                      : "La propiedad no existe o fue eliminada"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ID solicitado: {id}
                  </p>
                  <Link href="/properties">
                    <Button>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver a la lista
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar visible solo en pantallas medianas y grandes */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Contenido principal con padding responsive */}
      <main className="flex-1 w-full">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header responsive: stack en mobile, flex en desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
            <Link href="/properties" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Editar Propiedad
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {property.nombre || "Modificá los datos de la propiedad"}
              </p>
            </div>
          </div>

          <PropertyForm initialData={property} propertyId={id!} />
        </div>
      </main>
    </div>
  );
}
