import { Sidebar } from "@/components/sidebar";
import { TypePropertyForm } from "@/components/type-property-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewTypePropertyPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar visible solo en pantallas medianas y grandes */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Contenido principal con padding responsive */}
      <main className="flex-1 w-full">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
            <Link href="/types-properties">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Nuevo Tipo de Propiedad
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Crea una nueva categoría de propiedad
              </p>
            </div>
          </div>

          <TypePropertyForm />
        </div>
      </main>
    </div>
  );
}
