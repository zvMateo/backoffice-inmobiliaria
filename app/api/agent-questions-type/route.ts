import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Received request body:", body)

    const { typeId, questions } = body

    if (!typeId || !questions) {
      console.log("[v0] Missing required fields - typeId:", typeId, "questions:", questions)
      return NextResponse.json({ error: "typeId and questions are required" }, { status: 400 })
    }

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })

    const insertData = {
      typeid: Number.parseInt(typeId),
      questions: questions,
    }
    console.log("[v0] Attempting to insert:", insertData)

    const { data, error } = await supabase.from("agentquestionstypeproperties").insert(insertData).select().single()

    if (error) {
      console.error("[v0] Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return NextResponse.json(
        {
          error: "Failed to save agent questions type",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Successfully inserted:", data)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })

    const { data, error } = await supabase
      .from("agentquestionstypeproperties")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching agent questions types:", error)
      return NextResponse.json({ error: "Failed to fetch agent questions types" }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("Error in agent questions type API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
