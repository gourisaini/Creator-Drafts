import { type NextRequest, NextResponse } from "next/server"
import { getAllDrafts, createDraft } from "@/lib/db"
import { validateTitle, validateDescription, validateImages, validateTags } from "@/lib/validation"

export async function GET() {
  try {
    const drafts = getAllDrafts()
    return NextResponse.json(drafts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch drafts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, tags, images } = body

    // Server-side validation
    const titleValidation = validateTitle(title)
    if (!titleValidation.valid) {
      return NextResponse.json({ error: titleValidation.error }, { status: 400 })
    }

    const descValidation = validateDescription(description)
    if (!descValidation.valid) {
      return NextResponse.json({ error: descValidation.error }, { status: 400 })
    }

    const tagsValidation = validateTags(tags || [])
    if (!tagsValidation.valid) {
      return NextResponse.json({ error: tagsValidation.error }, { status: 400 })
    }

    const imagesValidation = validateImages(images || [])
    if (!imagesValidation.valid) {
      return NextResponse.json({ error: imagesValidation.error }, { status: 400 })
    }

    const draft = createDraft({
      title: title.trim(),
      description: description.trim(),
      tags: tags || [],
      images: images || [],
      published: false,
    })

    return NextResponse.json(draft, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create draft" }, { status: 500 })
  }
}
