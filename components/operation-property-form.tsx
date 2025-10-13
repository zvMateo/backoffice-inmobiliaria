"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCrearTipoOperacion,
  useTipoOperacion,
  useActualizarTipoOperacion,
} from "@/hooks/useTypesOperaciones";

interface OperationPropertyFormData {
  name: string;
  active: boolean;
}

export function OperationPropertyForm({
  operationId,
}: {
  operationId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const crear = useCrearTipoOperacion();
  const actualizar = useActualizarTipoOperacion();
  const tipoQuery = useTipoOperacion(operationId ? Number(operationId) : null);

  const [formData, setFormData] = useState<OperationPropertyFormData>({
    name: "",
    active: true,
  });

  useEffect(() => {
    if (tipoQuery.data) {
      const d: any = tipoQuery.data;
      setFormData({ name: d.name || "", active: !!d.active });
    }
  }, [tipoQuery.data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (operationId) {
        await actualizar.mutateAsync({ id: Number(operationId), ...formData });
      } else {
        await crear.mutateAsync(formData);
      }
      router.push("/operations-properties");
    } catch (e) {
      console.error(e);
      alert("Error al guardar el tipo de operación");
    }

    setLoading(false);
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Información de la Operación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="Ej: Compra, Alquiler mensual, Alquiler temporal"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, active: !!checked })
              }
            />
            <Label htmlFor="active">Activo</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : operationId ? "Actualizar" : "Crear"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/operations-properties")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
