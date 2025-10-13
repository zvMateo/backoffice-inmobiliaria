"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Home,
  Building2,
  Tag,
  ArrowRightLeft,
  MapPin,
  DollarSign,
  Map,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  Code,
  Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Mapa Inmobiliario",
    href: "/mapa-inmobiliaria",
    icon: MapPin,
  },
  {
    name: "Propiedades",
    icon: Building2,
    children: [
      {
        name: "Ver Propiedades",
        href: "/properties",
        icon: List,
      },
      {
        name: "Nueva Propiedad",
        href: "/properties/new",
        icon: Plus,
      },
    ],
  },
  {
    name: "Tipos de Propiedades",
    icon: Tag,
    children: [
      {
        name: "Ver Tipos",
        href: "/types-properties",
        icon: List,
      },
      {
        name: "Nuevo Tipo",
        href: "/types-properties/new",
        icon: Plus,
      },
    ],
  },
  {
    name: "Tipos de Operaciones",
    icon: ArrowRightLeft,
    children: [
      {
        name: "Ver Operaciones",
        href: "/operations-properties",
        icon: List,
      },
      {
        name: "Nueva Operación",
        href: "/operations-properties/new",
        icon: Plus,
      },
    ],
  },
  {
    name: "Provincias",
    icon: Map,
    children: [
      {
        name: "Ver Provincias",
        href: "/provinces",
        icon: List,
      },
      {
        name: "Nueva Provincia",
        href: "/provinces/new",
        icon: Plus,
      },
    ],
  },
  {
    name: "Localidades",
    icon: MapPin,
    children: [
      {
        name: "Ver Localidades",
        href: "/localities",
        icon: List,
      },
      {
        name: "Nueva Localidad",
        href: "/localities/new",
        icon: Plus,
      },
    ],
  },
  {
    name: "Zonas",
    icon: MapPin,
    children: [
      {
        name: "Ver Zonas",
        href: "/zones",
        icon: List,
      },
      {
        name: "Nueva Zona",
        href: "/zones/new",
        icon: Plus,
      },
    ],
  },
  {
    name: "Monedas",
    icon: DollarSign,
    children: [
      {
        name: "Ver Monedas",
        href: "/currencies",
        icon: List,
      },
      {
        name: "Nueva Moneda",
        href: "/currencies/new",
        icon: Plus,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemActive = (item: any) => {
    if (item.href) {
      return pathname === item.href;
    }
    if (item.children) {
      return item.children.some((child: any) => pathname === child.href);
    }
    return false;
  };

  return (
    <>
      {/* Desktop sidebar fijo */}
      <div className="hidden md:flex fixed inset-y-0 left-0 h-screen w-64 notebook:w-72 flex-col bg-sidebar border-r border-sidebar-border overflow-y-auto z-40">
        <div className="flex h-16 notebook:h-18 items-center border-b border-sidebar-border px-4 notebook:px-6">
          <div className="flex items-center gap-2 notebook:gap-3">
            <div className="w-8 h-8 notebook:w-10 notebook:h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm notebook:text-base">
                BO
              </span>
            </div>
            <h1 className="text-xl notebook:text-2xl font-bold text-sidebar-foreground">
              Back Office
            </h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = isItemActive(item);
            const isExpanded = expandedItems.includes(item.name);

            if (item.href && !item.children) {
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            }

            return (
              <div key={item.name}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => toggleExpanded(item.name)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Button>
                {isExpanded && item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.name} href={child.href}>
                        <Button
                          variant={isItemActive(child) ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "w-full justify-start gap-3",
                            isItemActive(child)
                              ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <child.icon className="h-4 w-4" />
                          {child.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Toggle de tema - Desktop */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center justify-between">
            <ModeToggle />
          </div>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <div
            className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center uppercase text-xs font-bold">
              {(() => {
                const n = (user?.name || user?.email || "?").trim();
                const initials = n
                  .split(/\s+/)
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("");
                return initials || "?";
              })()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || "Administrador"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {user?.email || "admin@example.com"}
              </div>
            </div>
            <ChevronDown
              className={cn(
                "ml-auto h-4 w-4 transition-transform",
                profileOpen ? "rotate-180" : "rotate-0"
              )}
            />
          </div>
          {profileOpen && (
            <div className="mt-2 border rounded-md overflow-hidden bg-background shadow">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-sidebar-accent"
                onClick={() => setProfileOpen(false)}
              >
                Cuenta
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-sidebar-accent"
                onClick={() => setProfileOpen(false)}
              >
                Notificaciones
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-sidebar-accent"
                onClick={() => setProfileOpen(false)}
              >
                Configuración
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-sidebar-accent"
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                  window.location.href = "/login";
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer - solo el botón del menú */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-foreground hover:text-primary-foreground hover:bg-primary transition-all duration-200 hover:scale-105 border-border"
              aria-label="Abrir menú"
            >
              <Menu className="h-4 w-4" />
              Menú
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      BO
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <SheetTitle className="text-sm font-semibold leading-tight">
                      Back Office
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground leading-tight">
                      Inmobiliario
                    </p>
                  </div>
                </div>
                {/* Toggle de tema - Mobile */}
                <ModeToggle />
              </div>
            </SheetHeader>
            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              {/* Reuso del mismo contenido del sidebar */}
              <nav className="space-y-1 p-4">
                {navigation.map((item) => {
                  const isActive = isItemActive(item);
                  const isExpanded = expandedItems.includes(item.name);
                  if (item.href && !item.children) {
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3",
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Button>
                      </Link>
                    );
                  }
                  return (
                    <div key={item.name}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        onClick={() => toggleExpanded(item.name)}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        ) : (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )}
                      </Button>
                      {isExpanded && item.children && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link key={child.name} href={child.href}>
                              <Button
                                variant={
                                  isItemActive(child) ? "default" : "ghost"
                                }
                                size="sm"
                                className={cn(
                                  "w-full justify-start gap-3",
                                  isItemActive(child)
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                              >
                                <child.icon className="h-4 w-4" />
                                {child.name}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
              <div className="border-t border-sidebar-border p-3">
                <div
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer"
                  onClick={() => setProfileOpen((v) => !v)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center uppercase text-xs font-bold">
                    {(() => {
                      const n = (user?.name || user?.email || "?").trim();
                      const initials = n
                        .split(/\s+/)
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("");
                      return initials || "?";
                    })()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.name || "Administrador"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user?.email || "admin@example.com"}
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "ml-auto h-4 w-4 transition-transform",
                      profileOpen ? "rotate-180" : "rotate-0"
                    )}
                  />
                </div>
                {profileOpen && (
                  <div className="mt-2 border rounded-md overflow-hidden bg-background shadow">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-sidebar-accent"
                      onClick={() => setProfileOpen(false)}
                    >
                      Cuenta
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-sidebar-accent"
                      onClick={() => setProfileOpen(false)}
                    >
                      Notificaciones
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-sidebar-accent"
                      onClick={() => setProfileOpen(false)}
                    >
                      Configuración
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-sidebar-accent"
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                        window.location.href = "/login";
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
