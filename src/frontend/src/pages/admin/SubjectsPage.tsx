import { createActor } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { AdminLayout } from "@/layouts/AdminLayout";
import type {
  CreateSubjectPayload,
  SubjectWithStats,
  UpdateSubjectPayload,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function SubjectsPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editSubject, setEditSubject] = useState<SubjectWithStats | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [nameError, setNameError] = useState("");
  const [editNameError, setEditNameError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "student") navigate({ to: "/student/quizzes" });
  }, [isAuthenticated, role, navigate]);

  const { data: subjects, isLoading } = useQuery<SubjectWithStats[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateSubjectPayload) => {
      if (!actor) throw new Error("Not connected");
      return actor.createSubject(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setShowCreate(false);
      setForm({ name: "", description: "" });
      toast.success("Subject created");
    },
    onError: () => toast.error("Failed to create subject"),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateSubjectPayload) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSubject(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setEditSubject(null);
      setForm({ name: "", description: "" });
      toast.success("Subject updated");
    },
    onError: () => toast.error("Failed to update subject"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSubject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setDeleteId(null);
      toast.success("Subject deleted");
    },
    onError: () => toast.error("Failed to delete subject"),
  });

  if (role === "loading" || isLoading) return <LoadingSpinner fullScreen />;

  const openEdit = (s: SubjectWithStats) => {
    setEditSubject(s);
    setForm({ name: s.name, description: s.description });
  };

  const handleCreate = () => {
    if (!form.name.trim()) {
      setNameError("Subject name is required");
      return;
    }
    createMutation.mutate(form);
  };

  const handleUpdate = () => {
    if (!editSubject) return;
    if (!form.name.trim()) {
      setEditNameError("Subject name is required");
      return;
    }
    setEditNameError("");
    updateMutation.mutate({ id: editSubject.id, ...form });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto" data-ocid="admin.subjects.page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Subjects
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage quiz topics and subjects
            </p>
          </div>
          <Button
            type="button"
            className="gap-2"
            onClick={() => {
              setForm({ name: "", description: "" });
              setShowCreate(true);
            }}
            data-ocid="admin.subjects.add_button"
          >
            <Plus className="h-4 w-4" /> Add Subject
          </Button>
        </div>

        {subjects?.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="admin.subjects.empty_state"
          >
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No subjects yet</p>
            <p className="text-sm mt-1">
              Create your first subject to get started.
            </p>
          </div>
        )}

        <div className="grid gap-4" data-ocid="admin.subjects.list">
          {subjects?.map((subject, i) => (
            <Card
              key={subject.id.toString()}
              className="zone-section"
              data-ocid={`admin.subjects.item.${i + 1}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="font-display text-base">
                      {subject.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {subject.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {subject.questionCount.toString()} Q
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(subject)}
                      aria-label="Edit subject"
                      data-ocid={`admin.subjects.edit_button.${i + 1}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(subject.id)}
                      aria-label="Delete subject"
                      data-ocid={`admin.subjects.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Create dialog */}
        <Dialog
          open={showCreate}
          onOpenChange={(v) => {
            setShowCreate(v);
            if (!v) setNameError("");
          }}
        >
          <DialogContent data-ocid="admin.subjects.create.dialog">
            <DialogHeader>
              <DialogTitle>New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-name">Name</Label>
                <Input
                  id="s-name"
                  value={form.name}
                  onChange={(e) => {
                    setNameError("");
                    setForm((f) => ({ ...f, name: e.target.value }));
                  }}
                  placeholder="e.g. Mathematics"
                  data-ocid="admin.subjects.create.name_input"
                />
                {nameError && (
                  <p className="text-sm text-destructive mt-1">{nameError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-desc">Description</Label>
                <Textarea
                  id="s-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Brief description"
                  rows={3}
                  data-ocid="admin.subjects.create.description_input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreate(false)}
                data-ocid="admin.subjects.create.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreate}
                disabled={createMutation.isPending}
                data-ocid="admin.subjects.create.submit_button"
              >
                Create Subject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit dialog */}
        <Dialog
          open={!!editSubject}
          onOpenChange={(v) => {
            if (!v) {
              setEditSubject(null);
              setEditNameError("");
            }
          }}
        >
          <DialogContent data-ocid="admin.subjects.edit.dialog">
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="es-name">Name</Label>
                <Input
                  id="es-name"
                  value={form.name}
                  onChange={(e) => {
                    setEditNameError("");
                    setForm((f) => ({ ...f, name: e.target.value }));
                  }}
                  data-ocid="admin.subjects.edit.name_input"
                />
                {editNameError && (
                  <p className="text-sm text-destructive mt-1">
                    {editNameError}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="es-desc">Description</Label>
                <Textarea
                  id="es-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  data-ocid="admin.subjects.edit.description_input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditSubject(null)}
                data-ocid="admin.subjects.edit.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                data-ocid="admin.subjects.edit.save_button"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <Dialog
          open={deleteId !== null}
          onOpenChange={(v) => !v && setDeleteId(null)}
        >
          <DialogContent data-ocid="admin.subjects.delete.dialog">
            <DialogHeader>
              <DialogTitle>Delete Subject?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This will permanently delete the subject and all its questions.
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteId(null)}
                data-ocid="admin.subjects.delete.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  deleteId !== null && deleteMutation.mutate(deleteId)
                }
                disabled={deleteMutation.isPending}
                data-ocid="admin.subjects.delete.confirm_button"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
