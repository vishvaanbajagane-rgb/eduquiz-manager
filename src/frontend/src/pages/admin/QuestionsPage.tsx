import { createActor } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { AdminLayout } from "@/layouts/AdminLayout";
import type {
  CreateQuestionPayload,
  Question,
  SubjectWithStats,
  UpdateQuestionPayload,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, HelpCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_COLORS = [
  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
  "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
  "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700",
];

function QuestionForm({
  form,
  setForm,
  ocidPrefix,
}: {
  form: { text: string; options: string[]; correctOptionIndex: number };
  setForm: React.Dispatch<
    React.SetStateAction<{
      text: string;
      options: string[];
      correctOptionIndex: number;
    }>
  >;
  ocidPrefix: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="font-semibold text-sm">Question Text</Label>
        <Input
          value={form.text}
          onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          placeholder="Enter the question..."
          className="border-border/60 focus:border-primary/50"
          data-ocid={`${ocidPrefix}.text_input`}
        />
      </div>
      <div className="space-y-2">
        <Label className="font-semibold text-sm">Answer Options</Label>
        <p className="text-xs text-muted-foreground -mt-1">
          Click the radio to mark the correct answer.
        </p>
        {form.options.map((opt, idx) => (
          <div
            key={`form-opt-${idx}-${opt.slice(0, 8)}`}
            className={`flex items-center gap-2.5 p-2 rounded-xl border-2 transition-all duration-200 ${
              form.correctOptionIndex === idx
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                : "border-border/50 hover:border-border"
            }`}
          >
            <input
              type="radio"
              name={`correct-${ocidPrefix}`}
              checked={form.correctOptionIndex === idx}
              onChange={() =>
                setForm((f) => ({ ...f, correctOptionIndex: idx }))
              }
              className="shrink-0 accent-emerald-500"
              aria-label={`Mark option ${OPTION_LABELS[idx]} as correct`}
            />
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${OPTION_COLORS[idx]}`}
            >
              {OPTION_LABELS[idx]}
            </span>
            <Input
              value={opt}
              onChange={(e) =>
                setForm((f) => {
                  const opts = [...f.options];
                  opts[idx] = e.target.value;
                  return { ...f, options: opts };
                })
              }
              placeholder={`Option ${OPTION_LABELS[idx]}`}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 p-0 h-auto text-sm"
              data-ocid={`${ocidPrefix}.option_input.${idx + 1}`}
            />
            {form.correctOptionIndex === idx && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuestionsPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [formErrors, setFormErrors] = useState<{
    text?: string;
    subject?: string;
  }>({});
  const [form, setForm] = useState({
    text: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "student") navigate({ to: "/student/quizzes" });
  }, [isAuthenticated, role, navigate]);

  const { data: subjects } = useQuery<SubjectWithStats[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ["questionsWithAnswers", selectedSubjectId],
    queryFn: async () => {
      if (!actor || !selectedSubjectId) return [];
      return actor.listQuestionsWithAnswers(BigInt(selectedSubjectId));
    },
    enabled: !!actor && !isFetching && !!selectedSubjectId,
  });

  const createMutation = useMutation({
    mutationFn: async (p: CreateQuestionPayload) => {
      if (!actor) throw new Error("No actor");
      return actor.createQuestion(p);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionsWithAnswers"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setShowCreate(false);
      resetForm();
      toast.success("Question created");
    },
    onError: () => toast.error("Failed to create question"),
  });

  const updateMutation = useMutation({
    mutationFn: async (p: UpdateQuestionPayload) => {
      if (!actor) throw new Error("No actor");
      return actor.updateQuestion(p);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionsWithAnswers"] });
      setEditQuestion(null);
      resetForm();
      toast.success("Question updated");
    },
    onError: () => toast.error("Failed to update question"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionsWithAnswers"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setDeleteId(null);
      toast.success("Question deleted");
    },
    onError: () => toast.error("Failed to delete question"),
  });

  const resetForm = () =>
    setForm({ text: "", options: ["", "", "", ""], correctOptionIndex: 0 });

  const openEdit = (q: Question) => {
    setEditQuestion(q);
    setForm({
      text: q.text,
      options: [
        ...q.options,
        ...(q.options.length < 4 ? Array(4 - q.options.length).fill("") : []),
      ].slice(0, 4),
      correctOptionIndex: Number(q.correctOptionIndex),
    });
  };

  const handleCreate = () => {
    if (!form.text.trim()) {
      setFormErrors((e) => ({ ...e, text: "Question text is required" }));
      return;
    }
    if (!selectedSubjectId) {
      setFormErrors((e) => ({ ...e, subject: "Please select a subject" }));
      return;
    }
    const opts = form.options.filter((o) => o.trim());
    if (opts.length < 2) {
      toast.error("Add at least 2 options");
      return;
    }
    createMutation.mutate({
      text: form.text,
      subjectId: BigInt(selectedSubjectId),
      options: opts,
      correctOptionIndex: BigInt(form.correctOptionIndex),
    });
  };

  const handleUpdate = () => {
    if (!editQuestion || !form.text.trim()) return;
    const opts = form.options.filter((o) => o.trim());
    updateMutation.mutate({
      id: editQuestion.id,
      text: form.text,
      subjectId: editQuestion.subjectId,
      options: opts,
      correctOptionIndex: BigInt(form.correctOptionIndex),
    });
  };

  if (role === "loading") return <LoadingSpinner fullScreen />;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto" data-ocid="admin.questions.page">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage multiple-choice questions
            </p>
          </div>
          <Button
            type="button"
            className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => {
              resetForm();
              setShowCreate(true);
            }}
            disabled={!selectedSubjectId}
            data-ocid="admin.questions.add_button"
          >
            <Plus className="h-4 w-4" /> Add Question
          </Button>
        </div>

        {/* Subject selector */}
        <div className="mb-6">
          <Label className="mb-1.5 block font-semibold text-sm">
            Filter by Subject
          </Label>
          <Select
            value={selectedSubjectId}
            onValueChange={setSelectedSubjectId}
          >
            <SelectTrigger
              className="w-72 border-border/60 focus:border-blue-400 focus:ring-blue-400/20"
              data-ocid="admin.questions.subject_select"
            >
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.map((s) => (
                <SelectItem key={s.id.toString()} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!selectedSubjectId && (
          <div
            className="text-center py-20 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/10"
            data-ocid="admin.questions.empty_state"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <p className="font-display font-bold text-xl text-foreground mb-2">
              Select a subject
            </p>
            <p className="text-muted-foreground text-sm">
              Choose a subject above to view and manage its questions.
            </p>
          </div>
        )}

        {selectedSubjectId && isLoading && <LoadingSpinner />}

        {selectedSubjectId && !isLoading && questions?.length === 0 && (
          <div
            className="text-center py-20 rounded-2xl border-2 border-dashed border-border bg-muted/20"
            data-ocid="admin.questions.no_questions_state"
          >
            <HelpCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-medium text-foreground">No questions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add the first question for this subject.
            </p>
          </div>
        )}

        <div className="space-y-4" data-ocid="admin.questions.list">
          {questions?.map((q, i) => (
            <Card
              key={q.id.toString()}
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              data-ocid={`admin.questions.item.${i + 1}`}
            >
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center h-6 w-8 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold">
                        Q{i + 1}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-relaxed mb-3">
                      {q.text}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === Number(q.correctOptionIndex);
                        return (
                          <div
                            key={`opt-${oi}-${opt.slice(0, 8)}`}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border-2 font-medium ${
                              isCorrect
                                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                                : `${OPTION_COLORS[oi]}`
                            }`}
                          >
                            <span className="font-bold shrink-0 w-4">
                              {OPTION_LABELS[oi]}
                            </span>
                            {isCorrect && (
                              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                            )}
                            <span className="truncate">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
                      onClick={() => openEdit(q)}
                      aria-label="Edit question"
                      data-ocid={`admin.questions.edit_button.${i + 1}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-destructive hover:text-rose-600"
                      onClick={() => setDeleteId(q.id)}
                      aria-label="Delete question"
                      data-ocid={`admin.questions.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create dialog */}
        <Dialog
          open={showCreate}
          onOpenChange={(v) => {
            setShowCreate(v);
            if (!v) setFormErrors({});
          }}
        >
          <DialogContent
            className="border-0 shadow-2xl"
            data-ocid="admin.questions.create.dialog"
          >
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <DialogTitle className="font-display text-xl">
                  New Question
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-1">
              <QuestionForm
                form={form}
                setForm={setForm}
                ocidPrefix="admin.questions.create"
              />
              {formErrors.text && (
                <p className="text-sm text-destructive mt-1">
                  {formErrors.text}
                </p>
              )}
              {formErrors.subject && (
                <p className="text-sm text-destructive mt-1">
                  {formErrors.subject}
                </p>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreate(false)}
                data-ocid="admin.questions.create.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                data-ocid="admin.questions.create.submit_button"
              >
                Create Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit dialog */}
        <Dialog
          open={!!editQuestion}
          onOpenChange={(v) => !v && setEditQuestion(null)}
        >
          <DialogContent
            className="border-0 shadow-2xl"
            data-ocid="admin.questions.edit.dialog"
          >
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
                  <Pencil className="h-4 w-4 text-white" />
                </div>
                <DialogTitle className="font-display text-xl">
                  Edit Question
                </DialogTitle>
              </div>
            </DialogHeader>
            <QuestionForm
              form={form}
              setForm={setForm}
              ocidPrefix="admin.questions.edit"
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditQuestion(null)}
                data-ocid="admin.questions.edit.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                data-ocid="admin.questions.edit.save_button"
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
            data-ocid="admin.questions.delete.dialog"
          >
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <Trash2 className="h-4 w-4 text-rose-600" />
                </div>
                <DialogTitle className="font-display text-xl">
                  Delete Question?
                </DialogTitle>
              </div>
            </DialogHeader>
            <p className="text-sm text-muted-foreground bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-lg p-3">
              ⚠️ This action cannot be undone.
            </p>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteId(null)}
                data-ocid="admin.questions.delete.cancel_button"
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
                data-ocid="admin.questions.delete.confirm_button"
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
