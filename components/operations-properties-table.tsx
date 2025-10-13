"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useTiposOperaciones, useEliminarTipoOperacion, useActualizarTipoOperacion } from "@/hooks/useTypesOperaciones"

export function OperationsPropertiesTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const opsQuery = useTiposOperaciones()
  const eliminar = useEliminarTipoOperacion()
  const actualizar = useActualizarTipoOperacion()

  const operations = opsQuery.data ?? []
  const totalCount = operations.length
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage))
  const pageItems = operations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (opsQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando tipos de operaciones...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Tipos de Operaciones ({totalCount})</CardTitle>
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
                    No hay tipos de operaciones registrados
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((operation: any) => (
                  <TableRow key={operation.id}>
                    <TableCell className="font-medium">{operation.id}</TableCell>
                    <TableCell>{operation.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={operation.active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => actualizar.mutate({ ...operation, active: !operation.active })}
                      >
                        {operation.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/operations-properties/${operation.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => eliminar.mutate(operation.id)}
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
              Página {currentPage} de {totalPages} ({totalCount} operaciones)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
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
  )
}
