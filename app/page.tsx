import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCards } from "@/components/dashboard-cards";
import { DashboardCharts } from "@/components/dashboard-charts";
import { DashboardCarousel } from "@/components/dashboard-carousel";
import { ClippedAreaChart } from "@/components/dashboard-chart-properties";
import { TrendingUp } from "lucide-react";

export default async function Dashboard() {
  return (
    <div className="w-full min-h-screen">
      {/* Contenido principal - responsive mejorado */}
      <main className="w-full overflow-x-hidden">
        {/* Padding responsive optimizado para todos los dispositivos */}
        <div className="px-4 py-4 sm:px-6 sm:py-6 notebook:px-8 notebook:py-8 xl:px-10 xl:py-10">
          {/* Header responsive */}
          <div className="mb-6 sm:mb-8 notebook:mb-10">
            <h1 className="text-2xl sm:text-3xl notebook:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base notebook:text-lg text-muted-foreground mt-2">
              Resumen general del sistema inmobiliario
            </p>
          </div>

          <DashboardCards />

          {/* Carrusel de últimas propiedades */}
          <div className="mt-6 sm:mt-8 notebook:mt-10">
            <DashboardCarousel />
          </div>

          <div className="mt-6 sm:mt-8 notebook:mt-10">
            <DashboardCharts />
            <ClippedAreaChart />
          </div>

          {/* Card de bienvenida responsive */}
          <div className="mt-6 sm:mt-8 notebook:mt-10">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl notebook:text-2xl">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 notebook:h-7 notebook:w-7 flex-shrink-0" />
                  <span className="leading-tight">
                    Bienvenido al Back Office Inmobiliario
                  </span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base notebook:text-lg mt-2">
                  Sistema de gestión completo para agentes inmobiliarios
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm sm:text-base notebook:text-lg text-muted-foreground leading-relaxed">
                  Utiliza el menú lateral para navegar entre las diferentes
                  secciones del sistema. Puedes gestionar propiedades,
                  configurar tipos y operaciones, administrar zonas y monedas
                  desde este panel de control.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
