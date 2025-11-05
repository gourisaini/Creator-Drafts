import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DraftsTable } from "@/components/drafts-table";
import { Home } from "lucide-react";

export const metadata = {
  title: "My Drafts | Creator Drafts",
  description: "Manage your drafts and publish content",
};

export default function DraftsPage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Drafts</h1>
            <p className="text-muted-foreground">
              Manage and publish your content
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <Link href="/">
              <Button size="lg" variant="outline">
                <Home /> Home
              </Button>
            </Link>
            <Link href="/creator/new">
              <Button>New Draft</Button>
            </Link>
          </div>
        </div>
        <DraftsTable />
      </div>
    </main>
  );
}
