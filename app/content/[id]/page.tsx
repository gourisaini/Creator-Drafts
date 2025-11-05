import { notFound } from "next/navigation"
import { getDraftById } from "@/lib/db"
import { ContentView } from "@/components/content-view"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const draft = getDraftById(id)

  if (!draft || !draft.published) {
    return {
      title: "Content not found",
    }
  }

  return {
    title: draft.title + " | Creator Drafts",
    description: draft.description,
    openGraph: {
      title: draft.title,
      description: draft.description,
      images: draft.images[0] ? [{ url: draft.images[0] }] : [],
    },
  }
}

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const draft = getDraftById(id)

  if (!draft || !draft.published) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <ContentView draft={draft} />
    </main>
  )
}
