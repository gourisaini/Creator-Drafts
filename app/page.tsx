import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Creator Drafts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, edit, and publish your content with ease. Draft your ideas,
            refine them inline, and share with the world.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/creator/new">
              <Button size="lg">Create Draft</Button>
            </Link>
            <Link href="/creator/drafts">
              <Button size="lg" variant="outline">
                View Drafts
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Draft Content</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Create drafts with rich text, multiple images, and organized
                tags. Keep your content in progress organized.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Inline</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Make quick edits directly in your drafts table. Click on any
                title to edit it without leaving the page.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publish & Share</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                When ready, publish your drafts to make them public. Each
                published piece gets its own shareable URL.
              </CardDescription>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
