"use client";

import { useState } from "react";
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
  useTiposPropiedadesPaginated,
  useEliminarTipoPropiedad,
  useActualizarTipoPropiedad,
} from "@/hooks/useTypesPropiedades";

export function TypesPropertiesTable() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const tiposQuery = useTiposPropiedadesPaginated(currentPage);
  const eliminar = useEliminarTipoPropiedad();
  const actualizar = useActualizarTipoPropiedad();

  const totalCount = tiposQuery.data?.totalRegistros ?? 0;
  const totalPages = tiposQuery.data?.totalPaginas ?? 1;
  const pageItems = tiposQuery.data?.data ?? [];

  if (tiposQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando tipos de propiedades...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Tipos de Propiedades ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No hay tipos de propiedades registrados
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((type: any) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.id}</TableCell>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={type.active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() =>
                          actualizar.mutate({ ...type, active: !type.active })
                        }
                      >
                        {type.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/types-properties/${type.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => eliminar.mutate(type.id)}
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
              Página {currentPage} de {totalPages} ({totalCount} tipos)
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
