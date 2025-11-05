import { type NextRequest, NextResponse } from "next/server"
import { getDraftById } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const draft = getDraftById(id)

    if (!draft) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    // Only return published content
    if (!draft.published) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json(draft)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}
