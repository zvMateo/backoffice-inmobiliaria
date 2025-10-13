import { Sidebar } from "@/components/sidebar";
import { ProvincesTable } from "@/components/provinces-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProvincesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar visible solo en pantallas medianas y grandes */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Contenido principal - optimizado para móvil */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {/* Header optimizado para móvil */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  Provincias
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1">
                  Gestiona las provincias del sistema
                </p>
              </div>
              <Link href="/provinces/new" className="w-full sm:w-auto">
                <Button className="gap-2 w-full sm:w-auto justify-center">
                  <Plus className="h-4 w-4" />
                  Nueva Provincia
                </Button>
              </Link>
            </div>
          </div>

          <ProvincesTable />
        </div>
      </main>
    </div>
  );
}
