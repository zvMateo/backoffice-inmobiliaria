"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCrearMoneda,
  useMoneda,
  useActualizarMoneda,
} from "@/hooks/useMonedas";
import { MonedaDTO } from "@/request/Monedas";

export function CurrencyForm({ currencyId }: { currencyId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const crearMoneda = useCrearMoneda();
  const actualizarMoneda = useActualizarMoneda();
  const monedaQuery = useMoneda(currencyId ? Number(currencyId) : null);

  const [formData, setFormData] = useState<Pick<MonedaDTO, "name" | "code">>({
    name: "",
    code: "",
  });

  useEffect(() => {
    if (currencyId) {
      if (monedaQuery.data) {
        setFormData({
          name: monedaQuery.data.name ?? "",
          code: monedaQuery.data.code ?? "",
        });
      }
    }
  }, [currencyId, monedaQuery.data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (currencyId) {
        await actualizarMoneda.mutateAsync({
          id: Number(currencyId),
          payload: formData,
        });
      } else {
        await crearMoneda.mutateAsync(formData);
      }
      router.push("/currencies");
    } catch (err) {
      console.error("Error al guardar moneda", err);
      alert("Error al guardar la moneda");
    }

    setLoading(false);
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Información de la Moneda</CardTitle>
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
              placeholder="Ej: Pesos argentinos, Dólares americanos, Euros"
            />
          </div>

          <div>
            <Label htmlFor="code">Código (opcional)</Label>
            <Input
              id="code"
              value={formData.code ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="Ej: ARS, USD, EUR"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : currencyId ? "Actualizar" : "Crear"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/currencies")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
