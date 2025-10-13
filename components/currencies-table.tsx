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
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMonedasPaginated, useEliminarMoneda } from "@/hooks/useMonedas";

export function CurrenciesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useMonedasPaginated(currentPage);
  const eliminarMoneda = useEliminarMoneda();

  const totalCount = data?.totalRegistros ?? 0;
  const totalPages = data?.totalPaginas ?? 1;
  const pageItems = data?.data ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando monedas...</div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Error al cargar monedas
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Monedas ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totalCount === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No hay monedas registradas
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((currency) => (
                  <TableRow key={currency.id}>
                    <TableCell className="font-medium">{currency.id}</TableCell>
                    <TableCell>{currency.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/currencies/${currency.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                "¿Estás seguro de que quieres eliminar esta moneda?"
                              )
                            ) {
                              eliminarMoneda.mutate(currency.id);
                            }
                          }}
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
              Página {currentPage} de {totalPages} ({totalCount} monedas)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
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
