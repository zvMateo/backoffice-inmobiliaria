"use client";

import {
  TrendingUp,
  Building2,
  MapPin,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  XAxis,
  ReferenceLine,
  PieChart,
  Pie,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
} from "recharts";
import React, { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => m.motion.div),
  { ssr: false }
);
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JetBrains_Mono } from "next/font/google";
import { useMotionValueEvent, useSpring } from "framer-motion";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const CHART_MARGIN = 35;

// Mock data para los gráficos
const monthlyProps = [
  { month: "Ene", total: 18, ventas: 8, alquileres: 10 },
  { month: "Feb", total: 22, ventas: 12, alquileres: 10 },
  { month: "Mar", total: 27, ventas: 14, alquileres: 13 },
  { month: "Abr", total: 25, ventas: 11, alquileres: 14 },
  { month: "May", total: 31, ventas: 16, alquileres: 15 },
  { month: "Jun", total: 29, ventas: 13, alquileres: 16 },
];

const typesDistribution = [
  { name: "Casa", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Departamento", value: 42, color: "hsl(var(--chart-2))" },
  { name: "Local", value: 11, color: "hsl(var(--chart-3))" },
  { name: "Terreno", value: 8, color: "hsl(var(--chart-4))" },
  { name: "Oficina", value: 4, color: "hsl(var(--chart-5))" },
];

const zonesActivity = [
  { zone: "Centro", visitas: 320 },
  { zone: "Nva Cba", visitas: 420 },
  { zone: "Gral Paz", visitas: 280 },
  { zone: "Alta Cba", visitas: 180 },
  { zone: "Cofico", visitas: 160 },
];

const operationsDistribution = [
  { name: "Venta", value: 45 },
  { name: "Alquiler Mensual", value: 35 },
  { name: "Alquiler Diario", value: 15 },
  { name: "Compra", value: 5 },
];

const priceRanges = [
  { range: "0-50k", count: 15 },
  { range: "50k-100k", count: 25 },
  { range: "100k-200k", count: 30 },
  { range: "200k-500k", count: 20 },
  { range: "500k+", count: 10 },
];

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  ventas: {
    label: "Ventas",
    color: "hsl(var(--chart-2))",
  },
  alquileres: {
    label: "Alquileres",
    color: "hsl(var(--chart-3))",
  },
  visitas: {
    label: "Visitas",
    color: "hsl(var(--chart-4))",
  },
  value: {
    label: "Cantidad",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

// Componente para gráfico de barras animado con EvilChart
function AnimatedBarChart({
  data,
  dataKey,
  title,
  description,
  icon: Icon,
  colorKey = "visitas",
}: {
  data: any[];
  dataKey: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  colorKey?: string;
}) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined
  );

  const maxValueIndex = React.useMemo(() => {
    if (activeIndex !== undefined) {
      return { index: activeIndex, value: data[activeIndex][colorKey] };
    }
    return data.reduce(
      (max, item, index) => {
        return item[colorKey] > max.value
          ? { index, value: item[colorKey] }
          : max;
      },
      { index: 0, value: 0 }
    );
  }, [activeIndex, data, colorKey]);

  const maxValueIndexSpring = useSpring(maxValueIndex.value, {
    stiffness: 100,
    damping: 20,
  });

  const [springyValue, setSpringyValue] = React.useState(maxValueIndex.value);

  useMotionValueEvent(maxValueIndexSpring, "change", (latest) => {
    setSpringyValue(Number(Number(latest).toFixed(0)));
  });

  React.useEffect(() => {
    maxValueIndexSpring.set(maxValueIndex.value);
  }, [maxValueIndex.value, maxValueIndexSpring]);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="text-sm sm:text-base">{title}</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              onMouseLeave={() => setActiveIndex(undefined)}
              margin={{ left: CHART_MARGIN }}
            >
              <XAxis
                dataKey={dataKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Bar dataKey={colorKey} fill="var(--color-visitas)" radius={4}>
                {data.map((_, index) => (
                  <Cell
                    className="duration-200"
                    opacity={index === maxValueIndex.index ? 1 : 0.2}
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                  />
                ))}
              </Bar>
              <ReferenceLine
                opacity={0.4}
                y={springyValue}
                stroke="var(--secondary-foreground)"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={<CustomReferenceLabel value={maxValueIndex.value} />}
              />
            </BarChart>
          </ChartContainer>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// Componente para gráfico de área con efecto clip animado (basado en EvilChart)
function ClippedAreaChart({
  data,
  title,
  description,
  icon: Icon,
}: {
  data: any[];
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [axis, setAxis] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // motion values
  const springX = useSpring(0, {
    damping: 30,
    stiffness: 100,
  });
  const springY = useSpring(0, {
    damping: 30,
    stiffness: 100,
  });

  // Animación inicial del recorrido
  React.useEffect(() => {
    if (chartRef.current && !isInitialized) {
      const width = chartRef.current.getBoundingClientRect().width;
      const lastValue = data[data.length - 1].total;

      // Iniciar desde 0
      springX.set(0);
      springY.set(data[0].total);

      // Animar progresivamente hasta el final con un delay
      const timer = setTimeout(() => {
        springX.set(width);
        springY.set(lastValue);
        setIsInitialized(true);
      }, 500); // Delay para que se vea la animación

      return () => clearTimeout(timer);
    }
  }, [data, springX, springY, isInitialized]);

  useMotionValueEvent(springX, "change", (latest) => {
    setAxis(latest);
  });

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="text-sm sm:text-base">{title}</span>
          <Badge variant="secondary" className="ml-2">
            <TrendingUp className="h-4 w-4" />
            <span>+12.5%</span>
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          ref={chartRef}
          className="h-54 w-full"
          config={chartConfig}
        >
          <AreaChart
            className="overflow-visible"
            accessibilityLayer
            data={data}
            onMouseMove={(state) => {
              const x = state.activeCoordinate?.x;
              const dataValue = state.activePayload?.[0]?.value;
              if (x && dataValue !== undefined) {
                springX.set(x);
                springY.set(dataValue);
              }
            }}
            onMouseLeave={() => {
              springX.set(chartRef.current?.getBoundingClientRect().width || 0);
              springY.jump(data[data.length - 1].total);
            }}
            margin={{
              right: 0,
              left: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              horizontalCoordinatesGenerator={(props) => {
                const { height } = props;
                return [0, height - 30];
              }}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Area
              dataKey="total"
              type="monotone"
              fill="url(#gradient-cliped-area-total)"
              fillOpacity={0.4}
              stroke="var(--color-total)"
              clipPath={`inset(0 ${Math.max(
                0,
                Number(chartRef.current?.getBoundingClientRect().width) - axis
              )} 0 0)`}
            />
            <line
              x1={axis}
              y1={0}
              x2={axis}
              y2={"85%"}
              stroke="var(--color-total)"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeOpacity={0.2}
            />
            <rect
              x={axis - 50}
              y={0}
              width={50}
              height={18}
              fill="var(--color-total)"
            />
            <text
              x={axis - 25}
              fontWeight={600}
              y={13}
              textAnchor="middle"
              fill="var(--primary-foreground)"
            >
              {springY.get().toFixed(0)}
            </text>
            {/* this is a ghost line behind graph */}
            <Area
              dataKey="total"
              type="monotone"
              fill="none"
              stroke="var(--color-total)"
              strokeOpacity={0.1}
            />
            <defs>
              <linearGradient
                id="gradient-cliped-area-total"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0}
                />
                <mask id="mask-cliped-area-chart">
                  <rect
                    x={0}
                    y={0}
                    width={"50%"}
                    height={"100%"}
                    fill="white"
                  />
                </mask>
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Componente para gráfico de dona con EvilChart
function AnimatedPieChart({
  data,
  title,
  description,
  icon: Icon,
}: {
  data: any[];
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="text-sm sm:text-base">{title}</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Componente para etiqueta personalizada
interface CustomReferenceLabelProps {
  viewBox?: {
    x?: number;
    y?: number;
  };
  value: number;
}

const CustomReferenceLabel: React.FC<CustomReferenceLabelProps> = (props) => {
  const { viewBox, value } = props;
  const x = viewBox?.x ?? 0;
  const y = viewBox?.y ?? 0;

  const width = React.useMemo(() => {
    const characterWidth = 8;
    const padding = 10;
    return value.toString().length * characterWidth + padding;
  }, [value]);

  return (
    <>
      <rect
        x={x - CHART_MARGIN}
        y={y - 9}
        width={width}
        height={18}
        fill="var(--secondary-foreground)"
        rx={4}
      />
      <text
        fontWeight={600}
        x={x - CHART_MARGIN + 6}
        y={y + 4}
        fill="var(--primary-foreground)"
      >
        {value}
      </text>
    </>
  );
};

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {/* Gráfico de Área con Clip - Evolución Temporal */}
      <ClippedAreaChart
        data={monthlyProps}
        title="Propiedades por mes"
        description="Evolución del inventario en los últimos 6 meses"
        icon={TrendingUp}
      />

      {/* Gráfico de Dona - Distribución por Tipo */}
      <AnimatedPieChart
        data={typesDistribution}
        title="Distribución por tipo"
        description="Porcentaje de propiedades por categoría"
        icon={Building2}
      />

      {/* Gráfico de Barras - Actividad por Zona */}
      <AnimatedBarChart
        data={zonesActivity}
        dataKey="zone"
        colorKey="visitas"
        title="Actividad por zona"
        description="Número de visitas por ubicación"
        icon={MapPin}
      />

      {/* Gráfico de Barras - Distribución por Operación */}
      <AnimatedBarChart
        data={operationsDistribution}
        dataKey="name"
        colorKey="value"
        title="Distribución por operación"
        description="Cantidad de propiedades por tipo de operación"
        icon={DollarSign}
      />

      {/* Gráfico de Barras - Distribución de Precios */}
      <div className="lg:col-span-2">
        <AnimatedBarChart
          data={priceRanges}
          dataKey="range"
          colorKey="count"
          title="Distribución de precios (USD)"
          description="Cantidad de propiedades por rango de precio"
          icon={DollarSign}
        />
      </div>
    </div>
  );
}

export default DashboardCharts;
