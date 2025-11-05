"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DraftViewModal } from "./draft-view-modal";
import { Link2 } from "lucide-react";

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

interface EditingState {
  draftId: string | null;
  field: string | null;
  value: string;
}

export function DraftsTable() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<EditingState>({
    draftId: null,
    field: null,
    value: "",
  });
  const [saveError, setSaveError] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/drafts");
      if (!response.ok) throw new Error("Failed to fetch drafts");
      const data = await response.json();
      setDrafts(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (draftId: string, field: string, currentValue: string) => {
    setEditing({ draftId, field, value: currentValue });
  };

  const handleSave = async (draftId: string) => {
    try {
      setSaveError("");
      const updateData: any = {};
      updateData[editing.field!] = editing.value;

      const response = await fetch(`/api/drafts/${draftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save");
      }

      const updated = await response.json();
      setDrafts(drafts.map((d) => (d.id === draftId ? updated : d)));
      setEditing({ draftId: null, field: null, value: "" });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    }
  };

  // publish/unpublish toggle
  const handleTogglePublish = async (
    draftId: string,
    currentState: boolean
  ) => {
    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentState }),
      });

      if (!response.ok) throw new Error("Failed to update publish status");
      const updated = await response.json();
      setDrafts(drafts.map((d) => (d.id === draftId ? updated : d)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish toggle failed");
    }
  };

  const handleDelete = async (draftId: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setDrafts(drafts.filter((d) => d.id !== draftId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleView = (draft: Draft) => {
    setSelectedDraft(draft);
    setViewModalOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading drafts...</p>
        </CardContent>
      </Card>
    );
  }

  if (drafts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">No drafts yet</p>
            <Link href="/creator/new">
              <Button>Create your first draft</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Drafts</CardTitle>
          <CardDescription>
            {drafts.length} draft{drafts.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {saveError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Title</th>
                  <th className="text-left py-2 px-2">Description</th>
                  <th className="text-left py-2 px-2">Tags</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Publish</th>
                  <th className="text-left py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((draft) => (
                  <tr key={draft.id} className="border-b hover:bg-muted/50">
                    {/* Title */}
                    <td className="py-2 px-2">
                      {editing.draftId === draft.id &&
                      editing.field === "title" ? (
                        <input
                          type="text"
                          value={editing.value}
                          onChange={(e) =>
                            setEditing((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                          onBlur={() => handleSave(draft.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave(draft.id);
                            if (e.key === "Escape")
                              setEditing({
                                draftId: null,
                                field: null,
                                value: "",
                              });
                          }}
                          autoFocus
                          className="w-full px-2 py-1 border rounded bg-background"
                        />
                      ) : (
                        <button
                          onClick={() =>
                            handleEdit(draft.id, "title", draft.title)
                          }
                          className="text-left hover:text-primary cursor-pointer truncate max-w-xs"
                        >
                          {draft.title}
                        </button>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-2 px-2">
                      {editing.draftId === draft.id &&
                      editing.field === "description" ? (
                        <textarea
                          value={editing.value}
                          onChange={(e) =>
                            setEditing((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                          onBlur={() => handleSave(draft.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave(draft.id);
                            if (e.key === "Escape")
                              setEditing({
                                draftId: null,
                                field: null,
                                value: "",
                              });
                          }}
                          autoFocus
                          className="w-full px-2 py-1 border rounded bg-background"
                        />
                      ) : (
                        <button
                          onClick={() =>
                            handleEdit(
                              draft.id,
                              "description",
                              draft.description
                            )
                          }
                          className="text-left hover:text-primary cursor-pointer truncate max-w-xs"
                        >
                          {draft.description}
                        </button>
                      )}
                    </td>

                    {/* Tags */}
                    <td className="py-2 px-2">
                      <div className="flex flex-wrap gap-1">
                        {draft.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {draft.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{draft.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2 px-2">
                      <Badge
                        variant={draft.published ? "default" : "secondary"}
                      >
                        {draft.published ? "Published" : "Draft"}
                      </Badge>
                    </td>

                    {/* ✅ Publish Toggle Button */}
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={draft.published ? "secondary" : "default"}
                          onClick={() =>
                            handleTogglePublish(draft.id, draft.published)
                          }
                          title={draft.published ? "Unpublish" : "Publish"}
                        >
                          {draft.published ? "Unpublish" : "Publish"}
                        </Button>

                        {draft.published && (
                          <Link
                            href={`/content/${draft.id}`}
                            target="_blank"
                            title="View published content"
                          >
                            <Link2
                              size={18}
                              className="text-primary hover:underline"
                            />
                          </Link>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleView(draft)}
                          title="View this draft"
                        >
                          View
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(draft.id)}
                          title="Delete this draft"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <DraftViewModal
        draft={selectedDraft}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
    </>
  );
}
