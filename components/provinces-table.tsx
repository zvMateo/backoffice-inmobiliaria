"use client";

import { useState } from "react";
import {
  useProvinciasPaginated,
  useActualizarProvincia,
  useEliminarProvincia,
} from "@/hooks/useProvincias";
import type { ListaProvinciasResponse } from "@/request/Provincias";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProvincesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const query = useProvinciasPaginated(currentPage, 10);
  const updateMutation = useActualizarProvincia();
  const deleteMutation = useEliminarProvincia();

  const data = query.data as ListaProvinciasResponse | undefined;
  const totalCount = data?.totalRegistros ?? 0;
  const totalPages = data?.totalPaginas ?? 1;
  const pageItems = data?.data ?? [];

  const handleEdit = async (province: any) => {
    const newName = window.prompt(
      "Nuevo nombre de la provincia",
      province.name
    );
    if (newName === null) return;
    const trimmed = String(newName).trim();
    if (!trimmed) return;
    try {
      await updateMutation.mutateAsync({
        id: province.id,
        name: trimmed,
        active: province.active,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (province: any) => {
    const ok = window.confirm(
      `¿Eliminar la provincia "${province.name}"? Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    try {
      await deleteMutation.mutateAsync(province.id);
    } catch (e) {
      console.error(e);
    }
  };

  if (query.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando provincias...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Provincias ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Localidades</TableHead>
                <TableHead className="w-[140px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No hay provincias registradas
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((province: any) => (
                  <TableRow key={province.id}>
                    <TableCell className="font-medium">
                      {province.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          province.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {province.active ? "Activa" : "Inactiva"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {province.localitiesais?.length || 0} localidades
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(province)}
                          disabled={
                            updateMutation.isPending || deleteMutation.isPending
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(province)}
                          disabled={
                            updateMutation.isPending || deleteMutation.isPending
                          }
                        >
                          Eliminar
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
              No hay provincias registradas
            </div>
          ) : (
            pageItems.map((province: any) => (
              <div key={province.id} className="py-3 px-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{province.name}</div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      province.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {province.active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {province.localitiesais?.length || 0} localidades
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(province)}
                    disabled={
                      updateMutation.isPending || deleteMutation.isPending
                    }
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(province)}
                    disabled={
                      updateMutation.isPending || deleteMutation.isPending
                    }
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} ({totalCount} provincias)
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
  );
}
