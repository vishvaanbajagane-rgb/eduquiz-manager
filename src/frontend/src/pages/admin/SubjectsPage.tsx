import { createActor } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { BookOpen, Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SUBJECT_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
];

type TimerPreset = "none" | "30" | "60" | "120" | "1440" | "custom";

const TIMER_PRESETS: {
  value: TimerPreset;
  label: string;
  minutes: number | null;
}[] = [
  { value: "none", label: "No Timer", minutes: null },
  { value: "30", label: "30 minutes", minutes: 30 },
  { value: "60", label: "1 hour", minutes: 60 },
  { value: "120", label: "2 hours", minutes: 120 },
  { value: "1440", label: "24 hours", minutes: 1440 },
  { value: "custom", label: "Custom …", minutes: null },
];

function minutesToPreset(minutes: number | null | undefined): TimerPreset {
  if (minutes == null) return "none";
  const match = TIMER_PRESETS.find((p) => p.minutes === minutes);
  return match ? match.value : "custom";
}

function formatTimerBadge(minutes: bigint | null | undefined): string | null {
  if (minutes == null) return null;
  const m = Number(minutes);
  if (m === 0) return null;
  if (m < 60) return `${m} min`;
  if (m % 60 === 0) {
    const h = m / 60;
    return h === 1 ? "1 hr" : `${h} hrs`;
  }
  return `${m} min`;
}

export default function SubjectsPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editSubject, setEditSubject] = useState<SubjectWithStats | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    timerPreset: TimerPreset;
    timerCustom: string;
  }>({
    name: "",
    description: "",
    timerPreset: "none",
    timerCustom: "",
  });
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
      setForm({
        name: "",
        description: "",
        timerPreset: "none",
        timerCustom: "",
      });
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
      setForm({
        name: "",
        description: "",
        timerPreset: "none",
        timerCustom: "",
      });
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
    const mins = s.timerMinutes != null ? Number(s.timerMinutes) : null;
    const preset = minutesToPreset(mins);
    setForm({
      name: s.name,
      description: s.description,
      timerPreset: preset,
      timerCustom: preset === "custom" && mins != null ? mins.toString() : "",
    });
  };

  const handleCreate = () => {
    if (!form.name.trim()) {
      setNameError("Subject name is required");
      return;
    }
    let timerMinutes: bigint | undefined;
    if (form.timerPreset !== "none") {
      const mins =
        form.timerPreset === "custom"
          ? Number.parseInt(form.timerCustom, 10)
          : Number(form.timerPreset);
      if (!Number.isNaN(mins) && mins > 0) timerMinutes = BigInt(mins);
    }
    createMutation.mutate({
      name: form.name,
      description: form.description,
      ...(timerMinutes != null ? { timerMinutes } : {}),
    });
  };

  const handleUpdate = () => {
    if (!editSubject) return;
    if (!form.name.trim()) {
      setEditNameError("Subject name is required");
      return;
    }
    setEditNameError("");
    let timerMinutes: bigint | undefined;
    if (form.timerPreset !== "none") {
      const mins =
        form.timerPreset === "custom"
          ? Number.parseInt(form.timerCustom, 10)
          : Number(form.timerPreset);
      if (!Number.isNaN(mins) && mins > 0) timerMinutes = BigInt(mins);
    }
    updateMutation.mutate({
      id: editSubject.id,
      name: form.name,
      description: form.description,
      ...(timerMinutes != null ? { timerMinutes } : {}),
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto" data-ocid="admin.subjects.page">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Subjects
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage quiz topics and subjects
            </p>
          </div>
          <Button
            type="button"
            className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => {
              setForm({
                name: "",
                description: "",
                timerPreset: "none",
                timerCustom: "",
              });
              setShowCreate(true);
            }}
            data-ocid="admin.subjects.add_button"
          >
            <Plus className="h-4 w-4" /> Add Subject
          </Button>
        </div>

        {subjects?.length === 0 && (
          <div
            className="text-center py-20 rounded-2xl border-2 border-dashed border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-950/10"
            data-ocid="admin.subjects.empty_state"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <p className="font-display font-bold text-xl text-foreground mb-2">
              No subjects yet
            </p>
            <p className="text-muted-foreground text-sm">
              Create your first subject to get started.
            </p>
          </div>
        )}

        <div className="grid gap-4" data-ocid="admin.subjects.list">
          {subjects?.map((subject, i) => {
            const grad = SUBJECT_GRADIENTS[i % SUBJECT_GRADIENTS.length];
            return (
              <Card
                key={subject.id.toString()}
                className="group overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card"
                data-ocid={`admin.subjects.item.${i + 1}`}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${grad}`} />
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div
                        className={`h-11 w-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-foreground text-base truncate">
                          {subject.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                          {subject.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Badge className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700 font-semibold text-xs px-2.5">
                          {subject.questionCount.toString()} Q
                        </Badge>
                        {(() => {
                          const label = formatTimerBadge(subject.timerMinutes);
                          return label ? (
                            <Badge
                              variant="outline"
                              className="text-xs gap-1 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
                            >
                              <Clock className="h-3 w-3" />
                              {label}
                            </Badge>
                          ) : null;
                        })()}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
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
                          className="h-8 w-8 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 text-destructive"
                          onClick={() => setDeleteId(subject.id)}
                          aria-label="Delete subject"
                          data-ocid={`admin.subjects.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Create dialog */}
        <Dialog
          open={showCreate}
          onOpenChange={(v) => {
            setShowCreate(v);
            if (!v) setNameError("");
          }}
        >
          <DialogContent
            className="border-0 shadow-2xl"
            data-ocid="admin.subjects.create.dialog"
          >
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <DialogTitle className="font-display text-xl">
                  New Subject
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-name" className="font-semibold text-sm">
                  Subject Name
                </Label>
                <Input
                  id="s-name"
                  value={form.name}
                  onChange={(e) => {
                    setNameError("");
                    setForm((f) => ({ ...f, name: e.target.value }));
                  }}
                  placeholder="e.g. Mathematics"
                  className="border-border/60 focus:border-violet-400 focus:ring-violet-400/20"
                  data-ocid="admin.subjects.create.name_input"
                />
                {nameError && (
                  <p className="text-sm text-destructive">{nameError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-desc" className="font-semibold text-sm">
                  Description
                </Label>
                <Textarea
                  id="s-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Brief description of this subject"
                  rows={3}
                  className="border-border/60 focus:border-violet-400 resize-none"
                  data-ocid="admin.subjects.create.description_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-semibold text-sm">Quiz Timer</Label>
                <Select
                  value={form.timerPreset}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      timerPreset: v as TimerPreset,
                      timerCustom: "",
                    }))
                  }
                >
                  <SelectTrigger
                    className="border-border/60 focus:border-violet-400"
                    data-ocid="admin.subjects.create.timer_select"
                  >
                    <SelectValue placeholder="Select timer" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMER_PRESETS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.timerPreset === "custom" && (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      min={1}
                      value={form.timerCustom}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, timerCustom: e.target.value }))
                      }
                      placeholder="Enter minutes"
                      className="border-border/60 focus:border-violet-400"
                      data-ocid="admin.subjects.create.timer_custom_input"
                    />
                    <span className="text-sm text-muted-foreground shrink-0">
                      minutes
                    </span>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
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
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
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
          <DialogContent
            className="border-0 shadow-2xl"
            data-ocid="admin.subjects.edit.dialog"
          >
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
                  <Pencil className="h-4 w-4 text-white" />
                </div>
                <DialogTitle className="font-display text-xl">
                  Edit Subject
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="es-name" className="font-semibold text-sm">
                  Subject Name
                </Label>
                <Input
                  id="es-name"
                  value={form.name}
                  onChange={(e) => {
                    setEditNameError("");
                    setForm((f) => ({ ...f, name: e.target.value }));
                  }}
                  className="border-border/60 focus:border-blue-400"
                  data-ocid="admin.subjects.edit.name_input"
                />
                {editNameError && (
                  <p className="text-sm text-destructive">{editNameError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="es-desc" className="font-semibold text-sm">
                  Description
                </Label>
                <Textarea
                  id="es-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="border-border/60 focus:border-blue-400 resize-none"
                  data-ocid="admin.subjects.edit.description_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-semibold text-sm">Quiz Timer</Label>
                <Select
                  value={form.timerPreset}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      timerPreset: v as TimerPreset,
                      timerCustom: "",
                    }))
                  }
                >
                  <SelectTrigger
                    className="border-border/60 focus:border-blue-400"
                    data-ocid="admin.subjects.edit.timer_select"
                  >
                    <SelectValue placeholder="Select timer" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMER_PRESETS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.timerPreset === "custom" && (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      min={1}
                      value={form.timerCustom}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, timerCustom: e.target.value }))
                      }
                      placeholder="Enter minutes"
                      className="border-border/60 focus:border-blue-400"
                      data-ocid="admin.subjects.edit.timer_custom_input"
                    />
                    <span className="text-sm text-muted-foreground shrink-0">
                      minutes
                    </span>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
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
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
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
          <DialogContent
            className="border-0 shadow-2xl max-w-sm"
            data-ocid="admin.subjects.delete.dialog"
          >
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <Trash2 className="h-4 w-4 text-rose-600" />
                </div>
                <DialogTitle className="font-display text-xl">
                  Delete Subject?
                </DialogTitle>
              </div>
            </DialogHeader>
            <p className="text-sm text-muted-foreground bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-lg p-3">
              ⚠️ This will permanently delete the subject and all its questions.
            </p>
            <DialogFooter className="gap-2">
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
                className="bg-rose-600 hover:bg-rose-700"
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
