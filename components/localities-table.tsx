"use client";

import { useState, useEffect } from "react";
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
  useLocalidadesPaginated,
  useEliminarLocalidad,
  useActualizarLocalidad,
} from "@/hooks/useLocalidades";
import type { LocalidadDTO } from "@/request/Localidades";
import { GetLocalities } from "@/types/property";

interface Locality {
  id: number;
  name: string;
  active: boolean;
}

export function LocalitiesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const getLocalities = useLocalidadesPaginated(currentPage);
  const deleteMutation = useEliminarLocalidad();
  const updateMutation = useActualizarLocalidad();

  const totalCount = getLocalities.data?.totalRegistros || 0;
  const totalPages = getLocalities.data?.totalPaginas || 1;
  const pageItems = getLocalities.data?.data || [];

  // async function fetchLocalities() {
  //   setLoading(true);
  //   const from = (currentPage - 1) * itemsPerPage;
  //   const to = from + itemsPerPage - 1;

  //   const { data, error, count } = await supabase
  //     .from("localitiesai") // Updated table name to match database schema
  //     .select("*", { count: "exact" })
  //     .range(from, to)
  //     .order("id", { ascending: false });

  //   if (error) {
  //     console.error("Error fetching localities:", error);
  //   } else {
  //     setLocalities(data || []);
  //     setTotalCount(count || 0);
  //   }
  //   setLoading(false);
  // }

  async function deleteLocality(id: number) {
    if (confirm("¿Estás seguro de que quieres eliminar esta localidad?")) {
      await deleteMutation.mutateAsync(id);
      getLocalities.refetch();
    }
  }

async function toggleActive(locality: any) {
  await updateMutation.mutateAsync({
    id: locality.id,
    name: locality.name,              // no vacío
    active: !locality.active,
    provinceid: locality.provinceid,  // incluye si tu API lo exige
  });
  getLocalities.refetch();
}

  // const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (getLocalities.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando localidades...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Localidades ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Provincia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No hay localidades registradas
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((locality: LocalidadDTO) => (
                  <TableRow key={locality.id}>
                    <TableCell className="font-medium">{locality.id}</TableCell>
                    <TableCell>{locality.name}</TableCell>
                    <TableCell>{locality.provincia || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={locality.active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() =>
                          toggleActive(locality.id, !!locality.active)
                        }
                      >
                        {locality.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/localities/${locality.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteLocality(locality.id)}
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
              Página {currentPage} de {totalPages} ({totalCount} localidades)
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
