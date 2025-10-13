import { Sidebar } from "@/components/sidebar";
import { ZoneForm } from "@/components/zone-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditZonePage({ params }: { params: { id: string } }) {
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
            <Link href="/zones" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Editar Zona
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Modifica los datos de la zona
              </p>
            </div>
          </div>

          <ZoneForm zoneId={params.id} />
        </div>
      </main>
    </div>
  );
}
