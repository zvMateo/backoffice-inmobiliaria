import { Sidebar } from "@/components/sidebar";
import { ProvinceForm } from "@/components/province-form";

interface EditProvincePageProps {
  params: {
    id: string;
  };
}

export default function EditProvincePage({ params }: EditProvincePageProps) {
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
              Editar Provincia
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1">
              Modifica los datos de la provincia
            </p>
          </div>

          <ProvinceForm id={params.id} />
        </div>
      </main>
    </div>
  );
}



