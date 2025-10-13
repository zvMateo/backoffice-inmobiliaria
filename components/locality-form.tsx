"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocalidad } from "@/hooks/useLocalidades"
import { useCrearLocalidad, useActualizarLocalidad } from "@/hooks/useLocalidades"
import { useProvincias } from "@/hooks/useProvincias"

interface LocalityFormProps {
  localityId?: string
}

export function LocalityForm({ localityId }: LocalityFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    provinceId: 1,
    active: true,
  })
  const router = useRouter()
  const { data: provinces = [] } = useProvincias()
  const localidadQuery = useLocalidad(localityId ? Number(localityId) : null)
  const crearMutation = useCrearLocalidad()
  const actualizarMutation = useActualizarLocalidad()

  const isEditing = !!localityId

  useEffect(() => {
    if (localidadQuery.data) {
      const data = localidadQuery.data
      setFormData({
        name: data.name || "",
        provinceId: data.provinceId || 1,
        active: data.active ?? true,
      })
    }
  }, [localidadQuery.data])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (isEditing) {
        await actualizarMutation.mutateAsync({
          id: Number(localityId),
          name: formData.name,
          provinceId: formData.provinceId,
          active: formData.active,
        })
      } else {
        await crearMutation.mutateAsync({
          name: formData.name,
        })
      }

      router.push("/localities")
    } catch (error) {
      console.error("Error saving locality:", error)
    }
  }

  if (localidadQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando localidad...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Localidad" : "Nueva Localidad"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ej: Córdoba Capital, Villa del Rosario"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provinceId">Provincia</Label>
            <Select
              value={formData.provinceId.toString()}
              onValueChange={(value) => setFormData({ ...formData, provinceId: Number(value) })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar provincia" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id.toString()}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">Activo</Label>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={crearMutation.isPending || actualizarMutation.isPending}
            >
              {crearMutation.isPending || actualizarMutation.isPending 
                ? "Guardando..." 
                : isEditing ? "Actualizar" : "Crear"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/localities")}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
