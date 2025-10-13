"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProvinciaById } from "@/hooks/useProvincias";
import {
  useCrearProvincia,
  useActualizarProvincia,
} from "@/hooks/useProvincias";
import { toast } from "sonner";

interface ProvinceFormData {
  name: string;
}

interface ProvinceFormProps {
  id?: string;
}

export function ProvinceForm({ id }: ProvinceFormProps) {
  const router = useRouter();
  const isEditing = Boolean(id);
  
  const { data: provinceData, isLoading } = useProvinciaById(
    isEditing ? Number(id) : null
  );

  const [formData, setFormData] = useState<ProvinceFormData>({
    name: "",
  });

  const [errors, setErrors] = useState<Partial<ProvinceFormData>>({});

  const createMutation = useCrearProvincia();
  const updateMutation = useActualizarProvincia();

  useEffect(() => {
    if (isEditing && provinceData) {
      setFormData({
        name: provinceData.name || "",
      });
    }
  }, [isEditing, provinceData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProvinceFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: Number(id),
          name: formData.name.trim(),
          active: true,
        });
        toast.success("Provincia actualizada correctamente");
      } else {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
        });
        toast.success("Provincia creada correctamente");
      }

      router.push("/provinces");
    } catch (error) {
      toast.error(
        isEditing
          ? "Error al actualizar la provincia"
          : "Error al crear la provincia"
      );
      console.error("Error:", error);
    }
  };

  const handleInputChange = (field: keyof ProvinceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando provincia...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Provincia" : "Nueva Provincia"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Provincia</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ej: Córdoba"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !formData.name.trim()
              }
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Guardando..."
                : isEditing
                ? "Actualizar Provincia"
                : "Crear Provincia"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}



