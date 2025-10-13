import { Suspense } from "react";
import { MapaInmobiliario } from "./_components/mapa-inmobiliario";
import { MapSkeleton } from "./_components/map-skeleton";

export default function MapaInmobiliariaPage() {
  return (
    <div className="w-full min-h-screen">
      {/* Contenido principal del mapa - responsive */}
      <main className="w-full overflow-hidden">
        <div className="w-full h-[calc(100vh-64px)] md:h-screen overflow-hidden">
          <Suspense fallback={<MapSkeleton />}>
            <MapaInmobiliario />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
