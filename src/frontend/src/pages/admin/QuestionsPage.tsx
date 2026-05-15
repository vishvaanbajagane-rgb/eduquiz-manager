import { createActor } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Label>Question Text</Label>
        <Input
          value={form.text}
          onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          placeholder="Enter the question..."
          data-ocid={`${ocidPrefix}.text_input`}
        />
      </div>
      <div className="space-y-2">
        <Label>Answer Options</Label>
        <p className="text-xs text-muted-foreground -mt-1">
          Select the radio next to the correct answer.
        </p>
        {form.options.map((opt, idx) => (
          <div
            key={`form-opt-${idx}-${opt.slice(0, 8)}`}
            className={`flex items-center gap-2.5 p-2 rounded-lg border transition-smooth ${
              form.correctOptionIndex === idx
                ? "border-primary/50 bg-primary/5"
                : "border-transparent hover:border-border"
            }`}
          >
            <input
              type="radio"
              name={`correct-${ocidPrefix}`}
              checked={form.correctOptionIndex === idx}
              onChange={() =>
                setForm((f) => ({ ...f, correctOptionIndex: idx }))
              }
              className="shrink-0 accent-primary"
              aria-label={`Mark option ${OPTION_LABELS[idx]} as correct`}
            />
            <span className="text-xs font-semibold text-muted-foreground w-4 shrink-0">
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
              className="flex-1"
              data-ocid={`${ocidPrefix}.option_input.${idx + 1}`}
            />
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Questions
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage multiple-choice questions
            </p>
          </div>
          <Button
            type="button"
            className="gap-2"
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

        <div className="mb-6">
          <Label className="mb-1.5 block">Filter by Subject</Label>
          <Select
            value={selectedSubjectId}
            onValueChange={setSelectedSubjectId}
          >
            <SelectTrigger
              className="w-64"
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
            className="text-center py-16 text-muted-foreground"
            data-ocid="admin.questions.empty_state"
          >
            <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Select a subject</p>
            <p className="text-sm mt-1">
              Choose a subject above to view and manage its questions.
            </p>
          </div>
        )}

        {selectedSubjectId && isLoading && <LoadingSpinner />}

        {selectedSubjectId && !isLoading && questions?.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="admin.questions.no_questions_state"
          >
            <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No questions yet</p>
            <p className="text-sm mt-1">
              Add the first question for this subject.
            </p>
          </div>
        )}

        <div className="space-y-3" data-ocid="admin.questions.list">
          {questions?.map((q, i) => (
            <Card
              key={q.id.toString()}
              className="zone-section"
              data-ocid={`admin.questions.item.${i + 1}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs shrink-0">
                        Q{i + 1}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-medium leading-relaxed mb-3">
                      {q.text}
                    </CardTitle>
                    <div className="grid grid-cols-2 gap-1.5">
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === Number(q.correctOptionIndex);
                        return (
                          <div
                            key={`opt-${oi}-${opt.slice(0, 8)}`}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs border ${
                              isCorrect
                                ? "border-primary/50 bg-primary/10 text-primary font-semibold"
                                : "border-border bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            <span className="font-bold shrink-0">
                              {OPTION_LABELS[oi]}
                            </span>
                            {isCorrect && (
                              <CheckCircle2 className="h-3 w-3 shrink-0" />
                            )}
                            <span className="truncate">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
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
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(q.id)}
                      aria-label="Delete question"
                      data-ocid={`admin.questions.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Create */}
        <Dialog
          open={showCreate}
          onOpenChange={(v) => {
            setShowCreate(v);
            if (!v) setFormErrors({});
          }}
        >
          <DialogContent data-ocid="admin.questions.create.dialog">
            <DialogHeader>
              <DialogTitle>New Question</DialogTitle>
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
            <DialogFooter>
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
                data-ocid="admin.questions.create.submit_button"
              >
                Create Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit */}
        <Dialog
          open={!!editQuestion}
          onOpenChange={(v) => !v && setEditQuestion(null)}
        >
          <DialogContent data-ocid="admin.questions.edit.dialog">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            <QuestionForm
              form={form}
              setForm={setForm}
              ocidPrefix="admin.questions.edit"
            />
            <DialogFooter>
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
          <DialogContent data-ocid="admin.questions.delete.dialog">
            <DialogHeader>
              <DialogTitle>Delete Question?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <DialogFooter>
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
