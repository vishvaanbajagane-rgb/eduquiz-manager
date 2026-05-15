import { u as useNavigate, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, B as Button } from "./index-BtG-7keB.js";
import { u as useAuth, a as useRole, g as useActor, h as useQuery, C as Card, c as CardHeader, B as Badge, d as CardTitle, i as createActor } from "./useRole-DKmUvK7y.js";
import { P as Plus, L as Label, a as Pencil, T as Trash2, D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./label-BrXp2lZe.js";
import { A as AdminLayout, C as CircleHelp, I as Input } from "./AdminLayout-C4TKwBUP.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BLzaCnGn.js";
import { u as useMutation, a as ue } from "./index-1gSpk2TV.js";
import { C as CircleCheck } from "./circle-check-CvYA9p_X.js";
import "./separator-C0JGTHfA.js";
const OPTION_LABELS = ["A", "B", "C", "D"];
function QuestionForm({
  form,
  setForm,
  ocidPrefix
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Question Text" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: form.text,
          onChange: (e) => setForm((f) => ({ ...f, text: e.target.value })),
          placeholder: "Enter the question...",
          "data-ocid": `${ocidPrefix}.text_input`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Answer Options" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1", children: "Select the radio next to the correct answer." }),
      form.options.map((opt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-2.5 p-2 rounded-lg border transition-smooth ${form.correctOptionIndex === idx ? "border-primary/50 bg-primary/5" : "border-transparent hover:border-border"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "radio",
                name: `correct-${ocidPrefix}`,
                checked: form.correctOptionIndex === idx,
                onChange: () => setForm((f) => ({ ...f, correctOptionIndex: idx })),
                className: "shrink-0 accent-primary",
                "aria-label": `Mark option ${OPTION_LABELS[idx]} as correct`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground w-4 shrink-0", children: OPTION_LABELS[idx] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: opt,
                onChange: (e) => setForm((f) => {
                  const opts = [...f.options];
                  opts[idx] = e.target.value;
                  return { ...f, options: opts };
                }),
                placeholder: `Option ${OPTION_LABELS[idx]}`,
                className: "flex-1",
                "data-ocid": `${ocidPrefix}.option_input.${idx + 1}`
              }
            )
          ]
        },
        `form-opt-${idx}-${opt.slice(0, 8)}`
      ))
    ] })
  ] });
}
function QuestionsPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [selectedSubjectId, setSelectedSubjectId] = reactExports.useState("");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [editQuestion, setEditQuestion] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [formErrors, setFormErrors] = reactExports.useState({});
  const [form, setForm] = reactExports.useState({
    text: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0
  });
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "student") navigate({ to: "/student/quizzes" });
  }, [isAuthenticated, role, navigate]);
  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching
  });
  const { data: questions, isLoading } = useQuery({
    queryKey: ["questionsWithAnswers", selectedSubjectId],
    queryFn: async () => {
      if (!actor || !selectedSubjectId) return [];
      return actor.listQuestionsWithAnswers(BigInt(selectedSubjectId));
    },
    enabled: !!actor && !isFetching && !!selectedSubjectId
  });
  const createMutation = useMutation({
    mutationFn: async (p) => {
      if (!actor) throw new Error("No actor");
      return actor.createQuestion(p);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionsWithAnswers"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setShowCreate(false);
      resetForm();
      ue.success("Question created");
    },
    onError: () => ue.error("Failed to create question")
  });
  const updateMutation = useMutation({
    mutationFn: async (p) => {
      if (!actor) throw new Error("No actor");
      return actor.updateQuestion(p);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionsWithAnswers"] });
      setEditQuestion(null);
      resetForm();
      ue.success("Question updated");
    },
    onError: () => ue.error("Failed to update question")
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionsWithAnswers"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setDeleteId(null);
      ue.success("Question deleted");
    },
    onError: () => ue.error("Failed to delete question")
  });
  const resetForm = () => setForm({ text: "", options: ["", "", "", ""], correctOptionIndex: 0 });
  const openEdit = (q) => {
    setEditQuestion(q);
    setForm({
      text: q.text,
      options: [
        ...q.options,
        ...q.options.length < 4 ? Array(4 - q.options.length).fill("") : []
      ].slice(0, 4),
      correctOptionIndex: Number(q.correctOptionIndex)
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
      ue.error("Add at least 2 options");
      return;
    }
    createMutation.mutate({
      text: form.text,
      subjectId: BigInt(selectedSubjectId),
      options: opts,
      correctOptionIndex: BigInt(form.correctOptionIndex)
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
      correctOptionIndex: BigInt(form.correctOptionIndex)
    });
  };
  if (role === "loading") return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", "data-ocid": "admin.questions.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Questions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Manage multiple-choice questions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          className: "gap-2",
          onClick: () => {
            resetForm();
            setShowCreate(true);
          },
          disabled: !selectedSubjectId,
          "data-ocid": "admin.questions.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Question"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block", children: "Filter by Subject" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: selectedSubjectId,
          onValueChange: setSelectedSubjectId,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-64",
                "data-ocid": "admin.questions.subject_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a subject" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: subjects == null ? void 0 : subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id.toString(), children: s.name }, s.id.toString())) })
          ]
        }
      )
    ] }),
    !selectedSubjectId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 text-muted-foreground",
        "data-ocid": "admin.questions.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "h-12 w-12 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Select a subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Choose a subject above to view and manage its questions." })
        ]
      }
    ),
    selectedSubjectId && isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}),
    selectedSubjectId && !isLoading && (questions == null ? void 0 : questions.length) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 text-muted-foreground",
        "data-ocid": "admin.questions.no_questions_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "h-12 w-12 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No questions yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Add the first question for this subject." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "admin.questions.list", children: questions == null ? void 0 : questions.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "zone-section",
        "data-ocid": `admin.questions.item.${i + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs shrink-0", children: [
              "Q",
              i + 1
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium leading-relaxed mb-3", children: q.text }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: q.options.map((opt, oi) => {
              const isCorrect = oi === Number(q.correctOptionIndex);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs border ${isCorrect ? "border-primary/50 bg-primary/10 text-primary font-semibold" : "border-border bg-muted/50 text-muted-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold shrink-0", children: OPTION_LABELS[oi] }),
                    isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: opt })
                  ]
                },
                `opt-${oi}-${opt.slice(0, 8)}`
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8",
                onClick: () => openEdit(q),
                "aria-label": "Edit question",
                "data-ocid": `admin.questions.edit_button.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => setDeleteId(q.id),
                "aria-label": "Delete question",
                "data-ocid": `admin.questions.delete_button.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }) })
      },
      q.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: showCreate,
        onOpenChange: (v) => {
          setShowCreate(v);
          if (!v) setFormErrors({});
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.questions.create.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New Question" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              QuestionForm,
              {
                form,
                setForm,
                ocidPrefix: "admin.questions.create"
              }
            ),
            formErrors.text && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive mt-1", children: formErrors.text }),
            formErrors.subject && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive mt-1", children: formErrors.subject })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setShowCreate(false),
                "data-ocid": "admin.questions.create.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: handleCreate,
                disabled: createMutation.isPending,
                "data-ocid": "admin.questions.create.submit_button",
                children: "Create Question"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!editQuestion,
        onOpenChange: (v) => !v && setEditQuestion(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.questions.edit.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Question" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            QuestionForm,
            {
              form,
              setForm,
              ocidPrefix: "admin.questions.edit"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setEditQuestion(null),
                "data-ocid": "admin.questions.edit.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: handleUpdate,
                disabled: updateMutation.isPending,
                "data-ocid": "admin.questions.edit.save_button",
                children: "Save Changes"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: deleteId !== null,
        onOpenChange: (v) => !v && setDeleteId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.questions.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Question?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This action cannot be undone." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setDeleteId(null),
                "data-ocid": "admin.questions.delete.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "destructive",
                onClick: () => deleteId !== null && deleteMutation.mutate(deleteId),
                disabled: deleteMutation.isPending,
                "data-ocid": "admin.questions.delete.confirm_button",
                children: "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] }) });
}
export {
  QuestionsPage as default
};
