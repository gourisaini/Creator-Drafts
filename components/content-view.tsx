"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContentViewProps {
  draft: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    images: string[];
    updatedAt: string;
  };
}

export function ContentView({ draft }: ContentViewProps) {
  return (
    <article className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">{draft.title}</CardTitle>
          <CardDescription>
            Last updated {new Date(draft.updatedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-foreground/90 mb-6">
            {draft.description}
          </p>

          {draft.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {draft.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {draft.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {draft.images.map((image, index) => (
                <figure key={index} className="overflow-hidden rounded-lg">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Content image ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </article>
  );
}
