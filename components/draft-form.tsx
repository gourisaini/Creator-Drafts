"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
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
import {
  validateTitle,
  validateDescription,
  validateTags,
  validateImages,
  VALIDATION_RULES,
} from "@/lib/validation";

interface FormState {
  title: string;
  description: string;
  tags: string[];
  currentTag: string;
  images: string[];
  errors: Record<string, string>;
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
    errors: {},
    loading: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setState((prev) => ({
      ...prev,
      [id]: value,
      errors: { ...prev.errors, [id]: "" },
    }));
  };

  const handleAddTag = () => {
    const newTag = state.currentTag.trim();
    if (!newTag) return;

    if (state.tags.includes(newTag)) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, tags: "Tag already added." },
      }));
      return;
    }

    const updatedTags = [...state.tags, newTag];
    const validation = validateTags(updatedTags);
    if (!validation.valid) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, tags: validation.error || "" },
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      tags: updatedTags,
      currentTag: "",
      errors: { ...prev.errors, tags: "" },
    }));
  };

  const handleRemoveTag = (index: number) =>
    setState((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newImages = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(newImages).then((base64Images) => {
      const updated = [...state.images, ...base64Images];
      const validation = validateImages(updated);
      if (!validation.valid) {
        setState((prev) => ({
          ...prev,
          errors: { ...prev.errors, images: validation.error || "" },
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        images: updated,
        errors: { ...prev.errors, images: "" },
      }));
    });
  };

  const handleRemoveImage = (index: number) =>
    setState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

  const validateAll = () => {
    const errors: Record<string, string> = {};

    const titleVal = validateTitle(state.title);
    if (!titleVal.valid) errors.title = titleVal.error || "";

    const descVal = validateDescription(state.description);
    if (!descVal.valid) errors.description = descVal.error || "";

    const tagsVal = validateTags(state.tags);
    if (!tagsVal.valid) errors.tags = tagsVal.error || "";

    const imagesVal = validateImages(state.images);
    if (!imagesVal.valid) errors.images = imagesVal.error || "";

    setState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAll()) return;

    setState((prev) => ({ ...prev, loading: true }));

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
        loading: false,
        errors: {
          ...prev.errors,
          form:
            err instanceof Error
              ? err.message
              : "An unexpected error occurred.",
        },
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
          {state.errors.form && (
            <Alert variant="destructive">
              <AlertDescription>{state.errors.form}</AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              placeholder="Enter draft title"
              value={state.title}
              onChange={handleChange}
              maxLength={VALIDATION_RULES.title.maxLength}
            />
            <p className="text-xs text-muted-foreground">
              {state.title.length}/{VALIDATION_RULES.title.maxLength}
            </p>
            {state.errors.title && (
              <p className="text-xs text-destructive">{state.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description *
            </label>
            <textarea
              id="description"
              placeholder="Enter draft description"
              value={state.description}
              onChange={handleChange}
              maxLength={VALIDATION_RULES.description.maxLength}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              {state.description.length}/
              {VALIDATION_RULES.description.maxLength}
            </p>
            {state.errors.description && (
              <p className="text-xs text-destructive">
                {state.errors.description}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tag-input" className="block text-sm font-medium">
              Tags (max {VALIDATION_RULES.tags.maxCount})
            </label>
            <div className="flex gap-2">
              <Input
                id="currentTag"
                type="text"
                placeholder="Enter tag and press Add"
                value={state.currentTag}
                onChange={handleChange}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                maxLength={VALIDATION_RULES.tags.maxLength}
                disabled={state.tags.length >= VALIDATION_RULES.tags.maxCount}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add Tag
              </Button>
            </div>
            {state.errors.tags && (
              <p className="text-xs text-destructive">{state.errors.tags}</p>
            )}
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

          {/* Images */}
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
            />
            <p className="text-xs text-muted-foreground">
              {state.images.length}/{VALIDATION_RULES.images.maxCount} images •
              Up to {VALIDATION_RULES.images.maxSizeMB}MB each
            </p>
            {state.errors.images && (
              <p className="text-xs text-destructive">{state.errors.images}</p>
            )}
            {state.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                {state.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
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

          {/* Actions */}
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
