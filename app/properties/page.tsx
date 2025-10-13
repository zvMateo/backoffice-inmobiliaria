import { PropertiesTable } from "@/components/properties-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PropertiesPage() {
  return (
    <div className="w-full">
      {/* Contenido principal con padding responsive */}
      <main className="w-full">
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
          {/* Header responsive: stack en mobile, flex en desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Propiedades
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Gestiona todas las propiedades del sistema
              </p>
            </div>
            <Link href="/properties/new" className="w-full sm:w-auto">
              <Button className="gap-2 w-full sm:w-auto px-4 py-2 text-sm lg:text-base">
                <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                Nueva Propiedad
              </Button>
            </Link>
          </div>

          <PropertiesTable />
        </div>
      </main>
    </div>
  );
}
