"use client";

import { useDashboardCounts } from "@/hooks/useInmobiliaria";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Tag,
  ArrowRightLeft,
  MapPin,
  DollarSign,
  Map,
} from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => m.motion.div),
  { ssr: false }
);

export function DashboardCards() {
  const { data, isLoading, isError, error } = useDashboardCounts();

  const n = (k: string) => Number((data as any)?.[k] ?? 0);
  const stats = {
    properties: n("propiedades") || n("Propiedades") || n("properties"),
    types: n("tiposPropiedades") || n("TiposPropiedades") || n("types"),
    operations:
      n("tiposOperaciones") || n("TiposOperaciones") || n("operations"),
    zones: n("zonas") || n("Zonas") || n("zones"),
    provinces: n("provincias") || n("Provincias") || n("provinces"),
    currencies: n("monedas") || n("Monedas") || n("currencies"),
  };

  const cards = [
    {
      title: "Propiedades",
      value: stats.properties,
      description: "Total de propiedades registradas",
      icon: Building2,
      href: "/properties",
    },
    {
      title: "Tipos de Propiedades",
      value: stats.types,
      description: "Categorías disponibles",
      icon: Tag,
      href: "/types-properties",
    },
    {
      title: "Tipos de Operaciones",
      value: stats.operations,
      description: "Operaciones configuradas",
      icon: ArrowRightLeft,
      href: "/operations-properties",
    },
    {
      title: "Zonas",
      value: stats.zones,
      description: "Ubicaciones disponibles",
      icon: MapPin,
      href: "/zones",
    },
    {
      title: "Provincias",
      value: stats.provinces,
      description: "Provincias configuradas",
      icon: Map,
      href: "/provinces",
    },
    {
      title: "Monedas",
      value: stats.currencies,
      description: "Monedas configuradas",
      icon: DollarSign,
      href: "/currencies",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card, index) => (
        <MotionDiv
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
        >
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground leading-tight">
                {card.title}
              </CardTitle>
              <card.icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <AnimatedNumber value={card.value} isLoading={isLoading} />
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                {card.description}
              </p>
              {isError && (
                <p
                  className="mt-2 text-[10px] text-destructive/70 truncate"
                  title={(error as any)?.message}
                >
                  {(error as any)?.message ?? "Error"}
                </p>
              )}
            </CardContent>
          </Card>
        </MotionDiv>
      ))}
    </div>
  );
}

function AnimatedNumber({
  value,
  isLoading,
}: {
  value: number;
  isLoading: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    let start = 0;
    const end = value;
    const duration = 800;
    const increment = end / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isLoading]);

  return (
    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1">
      {isLoading ? "—" : displayValue}
    </div>
  );
}
