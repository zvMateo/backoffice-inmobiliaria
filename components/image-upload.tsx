"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { urls } = await response.json()
      const newImages = [...images, ...urls].slice(0, maxImages)
      onImagesChange(newImages)
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("Error al subir las imágenes")
    } finally {
      setUploading(false)
      // Reset input
      event.target.value = ""
    }
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="images">Imágenes de la Propiedad</Label>
        <div className="mt-2">
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading || images.length >= maxImages}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("images")?.click()}
            disabled={uploading || images.length >= maxImages}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Subiendo..." : `Subir Imágenes (${images.length}/${maxImages})`}
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative overflow-hidden rounded-md">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              No hay imágenes cargadas.
              <br />
              Haz clic en "Subir Imágenes" para agregar fotos de la propiedad.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
