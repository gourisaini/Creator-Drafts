import { type NextRequest, NextResponse } from "next/server"
import { getDraftById, updateDraft, deleteDraft } from "@/lib/db"
import { validateTitle, validateDescription, validateImages, validateTags } from "@/lib/validation"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const draft = getDraftById(id)

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    return NextResponse.json(draft)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch draft" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, tags, images, published } = body

    // Validate required fields if provided
    if (title !== undefined) {
      const titleValidation = validateTitle(title)
      if (!titleValidation.valid) {
        return NextResponse.json({ error: titleValidation.error }, { status: 400 })
      }
    }

    if (description !== undefined) {
      const descValidation = validateDescription(description)
      if (!descValidation.valid) {
        return NextResponse.json({ error: descValidation.error }, { status: 400 })
      }
    }

    if (tags !== undefined) {
      const tagsValidation = validateTags(tags)
      if (!tagsValidation.valid) {
        return NextResponse.json({ error: tagsValidation.error }, { status: 400 })
      }
    }

    if (images !== undefined) {
      const imagesValidation = validateImages(images)
      if (!imagesValidation.valid) {
        return NextResponse.json({ error: imagesValidation.error }, { status: 400 })
      }
    }

    const updates: any = {}
    if (title !== undefined) updates.title = title.trim()
    if (description !== undefined) updates.description = description.trim()
    if (tags !== undefined) updates.tags = tags
    if (images !== undefined) updates.images = images
    if (published !== undefined) updates.published = published

    const updated = updateDraft(id, updates)

    if (!updated) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update draft" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const success = deleteDraft(id)

    if (!success) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete draft" }, { status: 500 })
  }
}
