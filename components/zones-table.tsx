"use client";

import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  useZonasPaginated,
  useEliminarZona,
  useActualizarZona,
} from "@/hooks/useZonas";

export function ZonesTable() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const zonasQuery = useZonasPaginated(currentPage);
  const eliminar = useEliminarZona();
  const actualizar = useActualizarZona();

  const zones = zonasQuery.data?.data ?? [];
  const totalCount = zonasQuery.data?.totalRegistros ?? 0;
  const totalPages = zonasQuery.data?.totalPaginas ?? 1;
  const pageItems = zones;

  if (zonasQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando zonas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Zonas ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Localidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No hay zonas registradas
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((zone: any) => (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">{zone.id}</TableCell>
                    <TableCell>{zone.name}</TableCell>
                    <TableCell>{zone.localidad || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={zone.active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() =>
                          actualizar.mutate({ ...zone, active: !zone.active })
                        }
                      >
                        {zone.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/zones/${zone.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => eliminar.mutate(zone.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} ({totalCount} zonas)
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
