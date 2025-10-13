"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocalidades } from "@/hooks/useLocalidades"
import { useCrearZona, useZona, useActualizarZona } from "@/hooks/useZonas"

interface ZoneFormData {
  name: string
  provinceid: number
  localityid: number
  active: boolean
}

interface Locality {
  id: number
  name: string
}

export function ZoneForm({ zoneId }: { zoneId?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { data: localities = [] } = useLocalidades()
  const crear = useCrearZona()
  const actualizar = useActualizarZona()
  const zonaQuery = useZona(zoneId ? Number(zoneId) : null)

  const [formData, setFormData] = useState<ZoneFormData>({
    name: "",
    provinceid: 1,
    localityid: 1,
    active: true,
  })

  useEffect(() => {
    if (zonaQuery.data) {
      const data: any = zonaQuery.data
      setFormData({
        name: data.name || "",
        provinceid: Number(data.provinceid) || 1,
        localityid: Number(data.localityid) || 1,
        active: !!data.active,
      })
    }
  }, [zonaQuery.data])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const zoneData = {
      name: formData.name,
      provinceid: Number.parseInt(formData.provinceid.toString()),
      localityid: Number.parseInt(formData.localityid.toString()),
      active: formData.active,
    }

    try {
      if (zoneId) {
        await actualizar.mutateAsync({ id: Number(zoneId), ...zoneData })
      } else {
        await crear.mutateAsync(zoneData)
      }
      router.push("/zones")
    } catch (e) {
      console.error(e)
      alert("Error al guardar la zona")
    }

    setLoading(false)
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Información de la Zona</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ej: Centro, Nueva Córdoba, Alberdi"
            />
          </div>

          <div>
            <Label htmlFor="localityid">Localidad</Label>
            <Select
              value={formData.localityid.toString()}
              onValueChange={(value) => setFormData({ ...formData, localityid: Number.parseInt(value) })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar localidad" />
              </SelectTrigger>
              <SelectContent>
                {localities.map((locality) => (
                  <SelectItem key={locality.id} value={locality.id.toString()}>
                    {locality.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="provinceid">ID de Provincia</Label>
            <Input
              id="provinceid"
              type="number"
              value={formData.provinceid.toString()}
              onChange={(e) => setFormData({ ...formData, provinceid: Number.parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: !!checked })}
            />
            <Label htmlFor="active">Activo</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : zoneId ? "Actualizar" : "Crear"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/zones")}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
