"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useListaPropiedadesPaginated } from "@/hooks/usePropiedades";
import { useDeleteProperty } from "@/hooks/useProperties";
import type { ListaPropiedadesResponse, PropiedadesFilters } from "@/request/Propiedades";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Search,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type SortField = "nombre" | "tipo" | "zona" | "precio";
type SortOrder = "asc" | "desc";

export function PropertiesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("nombre");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Debounce search para no hacer requests en cada keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset a primera página cuando se busca
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Construir filtros para el backend
  const filters: PropiedadesFilters = useMemo(() => ({
    page: currentPage,
    search: debouncedSearch || undefined,
    sortBy: sortField,
    sortOrder: sortOrder,
  }), [currentPage, debouncedSearch, sortField, sortOrder]);

  const query = useListaPropiedadesPaginated(filters);
  const deleteMutation = useDeleteProperty();
  const { toast } = useToast();

  const data = query.data as ListaPropiedadesResponse | undefined;
  const totalCount = data?.totalRegistros ?? 0;
  const totalPages = data?.totalPaginas ?? 1;
  const pageItems = data?.data ?? [];

  // Debug: ver qué datos está recibiendo la tabla
  console.log("🔍 PropertiesTable - Estado completo:", {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    filters,
    data,
    totalCount,
    totalPages,
    pageItemsLength: pageItems.length,
    queryStatus: query.status,
    errorMessage: query.error?.message,
    hasAuthToken: typeof window !== 'undefined' ? !!localStorage.getItem('auth') : 'unknown'
  });

  // Ya no necesitamos filtrado del lado del cliente - el backend maneja todo
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    // Reset a primera página cuando se cambia el ordenamiento
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    try {
      await deleteMutation.mutateAsync(propertyToDelete.id);
      toast({
        title: "✅ Propiedad eliminada",
        description: `La propiedad "${propertyToDelete.name}" fue eliminada correctamente.`,
      });
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message;

      toast({
        title: "❌ Error al eliminar",
        description:
          status === 500
            ? `Error 500 del servidor. Endpoint: /api/Propiedades/DeleteListaPropiedadesById/${propertyToDelete.id}. Consultá con el backend.`
            : message || "No se pudo eliminar la propiedad.",
        variant: "destructive",
      });

      console.error("Error al eliminar propiedad:", {
        id: propertyToDelete.id,
        status,
        endpoint: `/api/Propiedades/DeleteListaPropiedadesById/${propertyToDelete.id}`,
        error: error?.response?.data || error,
      });
    }
  };

  if (query.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cargando propiedades...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-destructive">
              ❌ Error al cargar propiedades
            </div>
            <div className="text-sm text-muted-foreground">
              {query.error?.message || 'Error desconocido'}
            </div>
            <Button 
              variant="outline" 
              onClick={() => query.refetch()}
              disabled={query.isLoading}
            >
              {query.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Reintentando...
                </>
              ) : (
                'Reintentar'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 inline ml-1" />
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>
              Lista de Propiedades ({pageItems.length}/{totalCount})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar propiedades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/*
          Tabla responsive:
          - En >=sm se muestra tabla clásica
          - En mobile se muestra una lista apilada con pares label:valor y acciones al final
        */}
          <div className="rounded-md border hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("nombre")}
                  >
                    Título <SortIcon field="nombre" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("tipo")}
                  >
                    Tipo <SortIcon field="tipo" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("zona")}
                  >
                    Ciudad <SortIcon field="zona" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort("precio")}
                  >
                    Precio <SortIcon field="precio" />
                  </TableHead>
                  <TableHead className="w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchQuery
                        ? "No se encontraron propiedades"
                        : "No hay propiedades registradas"}
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((property: any) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        {property.nombre}
                      </TableCell>
                      <TableCell>{property.tipo}</TableCell>
                      <TableCell>{property.zona || "N/A"}</TableCell>
                      <TableCell>{property.precio}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/properties/${property.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPropertyToDelete({
                                id: property.id,
                                name: property.nombre,
                              });
                              setDeleteDialogOpen(true);
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile stacked list */}
          <div className="sm:hidden divide-y">
            {pageItems.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {searchQuery
                  ? "No se encontraron propiedades"
                  : "No hay propiedades registradas"}
              </div>
            ) : (
              pageItems.map((property: any) => (
                <div key={property.id} className="py-3 px-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{property.nombre}</div>
                    <div className="flex items-center gap-2">
                      <Link href={`/properties/${property.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPropertyToDelete({
                            id: property.id,
                            name: property.nombre,
                          });
                          setDeleteDialogOpen(true);
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Tipo</div>
                    <div>{property.tipo}</div>
                    <div className="text-muted-foreground">Ciudad</div>
                    <div>{property.zona || "N/A"}</div>
                    <div className="text-muted-foreground">Precio</div>
                    <div>{property.precio}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} ({totalCount} propiedades)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Dialog para confirmar eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              propiedad{" "}
              <span className="font-semibold">"{propertyToDelete?.name}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
