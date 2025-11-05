"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Draft {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DraftViewModalProps {
  draft: Draft | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DraftViewModal({
  draft,
  open,
  onOpenChange,
}: DraftViewModalProps) {
  if (!draft) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{draft.title}</DialogTitle>
          <DialogDescription>
            {draft.published ? "Published" : "Draft"} • Updated{" "}
            {formatDate(draft.updatedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {draft.description}
            </p>
          </div>

          {/* Tags */}
          {draft.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {draft.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {draft.images.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">
                Images ({draft.images.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {draft.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video bg-muted rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Draft image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
            <p>Created: {formatDate(draft.createdAt)}</p>
            <p>ID: {draft.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
