import { Sidebar } from "@/components/sidebar";
import { ZonesTable } from "@/components/zones-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ZonesPage() {
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Zonas
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Gestiona las zonas y ubicaciones disponibles
              </p>
            </div>
            <Link href="/zones/new" className="w-full sm:w-auto">
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Nueva Zona
              </Button>
            </Link>
          </div>

          <ZonesTable />
        </div>
      </main>
    </div>
  );
}
