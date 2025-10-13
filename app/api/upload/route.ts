import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadPromises = files.map(async (file) => {
      const filename = `property-${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split(".").pop()}`

      const blob = await put(filename, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })

      return blob.url
    })

    const uploadedUrls = await Promise.all(uploadPromises)

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
