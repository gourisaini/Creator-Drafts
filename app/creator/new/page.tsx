import { DraftForm } from "@/components/draft-form";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Create Draft | Creator Drafts",
  description: "Create a new draft for your content",
};

export default function NewDraftPage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Creator Drafts
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and publish your content
            </p>
          </div>
          <Link href="/">
            <Button size="lg" variant="outline">
              <Home /> Home
            </Button>
          </Link>
        </div>
        <DraftForm />
      </div>
    </main>
  );
}
