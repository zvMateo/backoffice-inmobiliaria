"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { LogoutListener } from "@/app/(auth)/logout-listener";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <>
      {/* Sidebar fijo de desktop */}
      <Sidebar />

      <div className="min-h-screen bg-background md:pl-64 notebook:pl-72">
        {/* Header móvil - visible solo en pantallas pequeñas */}
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Título centrado - el botón de menú ya está en el Sidebar */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-foreground leading-tight">
                  Back Office
                </h1>
                <p className="text-xs text-muted-foreground leading-tight">
                  Inmobiliario
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Contenido principal */}
        <LogoutListener />
        <div className="w-full">{children}</div>
      </div>
    </>
  );
}