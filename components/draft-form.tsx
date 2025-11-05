"use client";

import { type FormEvent, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VALIDATION_RULES } from "@/lib/validation";

interface FormState {
  title: string;
  description: string;
  tags: string[];
  currentTag: string;
  images: string[];
  error: string;
  loading: boolean;
}

export function DraftForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({
    title: "",
    description: "",
    tags: [],
    currentTag: "",
    images: [],
    error: "",
    loading: false,
  });

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState((prev) => ({ ...prev, title: value }));
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setState((prev) => ({ ...prev, description: value }));
  };

  const handleAddTag = () => {
    if (state.currentTag.trim()) {
      setState((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: "",
      }));
    }
  };

  const handleRemoveTag = (index: number) => {
    setState((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const newImages = Array.from(files).map((file) => {
        const reader = new FileReader();
        return new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImages).then((base64Images) => {
        setState((prev) => ({
          ...prev,
          images: [...prev.images, ...base64Images],
        }));
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: "", loading: true }));

    try {
      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: state.title,
          description: state.description,
          tags: state.tags,
          images: state.images,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create draft");
      }

      router.push("/creator/drafts");
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "An error occurred",
        loading: false,
      }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Draft</CardTitle>
        <CardDescription>
          Fill in the details to create a new draft
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter draft title"
              value={state.title}
              onChange={handleTitleChange}
              maxLength={VALIDATION_RULES.title.maxLength}
              required
              aria-required="true"
              aria-describedby="title-info"
            />
            <p id="title-info" className="text-xs text-muted-foreground">
              {state.title.length}/{VALIDATION_RULES.title.maxLength}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description *
            </label>
            <textarea
              id="description"
              placeholder="Enter draft description"
              value={state.description}
              onChange={handleDescriptionChange}
              maxLength={VALIDATION_RULES.description.maxLength}
              required
              aria-required="true"
              aria-describedby="desc-info"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px]"
            />
            <p id="desc-info" className="text-xs text-muted-foreground">
              {state.description.length}/
              {VALIDATION_RULES.description.maxLength}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="tag-input" className="block text-sm font-medium">
              Tags (max {VALIDATION_RULES.tags.maxCount})
            </label>
            <div className="flex gap-2">
              <Input
                id="tag-input"
                type="text"
                placeholder="Enter tag and press Add"
                value={state.currentTag}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, currentTag: e.target.value }))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                maxLength={VALIDATION_RULES.tags.maxLength}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add Tag
              </Button>
            </div>
            {state.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {state.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="hover:text-destructive"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="images" className="block text-sm font-medium">
              Images (max {VALIDATION_RULES.images.maxCount})
            </label>
            <Input
              id="images"
              type="file"
              multiple
              accept={VALIDATION_RULES.images.allowedTypes.join(",")}
              onChange={handleAddImage}
              disabled={state.images.length >= VALIDATION_RULES.images.maxCount}
              aria-describedby="images-info"
            />
            <p id="images-info" className="text-xs text-muted-foreground">
              {state.images.length}/{VALIDATION_RULES.images.maxCount} images •
              Up to {VALIDATION_RULES.images.maxSizeMB}MB each
            </p>
            {state.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                {state.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={state.loading}>
              {state.loading ? "Creating..." : "Create Draft"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/creator/drafts")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
