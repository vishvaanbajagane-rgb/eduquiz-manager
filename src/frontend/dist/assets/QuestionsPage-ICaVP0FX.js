import { u as useNavigate, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, B as Button } from "./index-DcBYUGDn.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DEykqYLI.js";
import { C as Card, a as CardContent } from "./card-DVGAhWCy.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-ONTbtxFW.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, I as Input } from "./select-CZd3a9cs.js";
import { P as Plus, L as Label, a as Pencil, T as Trash2 } from "./label-Bar5D3hW.js";
import { u as useAuth } from "./useAuth-D7cwyGZ8.js";
import { u as useRole } from "./useRole-GQ_g6Jyl.js";
import { A as AdminLayout, C as CircleHelp } from "./AdminLayout-DU6yCqqM.js";
import { u as useMutation, a as ue } from "./index-CYG2Uf6Z.js";
import { C as CircleCheck } from "./circle-check-D7WwVWzq.js";
import "./index-CTHcLgyq.js";
import "./check-B8cc352b.js";
import "./index-CcCU_S8x.js";
const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_COLORS = [
  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
  "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
  "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700"
];
function QuestionForm({
  form,
  setForm,
  ocidPrefix
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold text-sm", children: "Question Text" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: form.text,
          onChange: (e) => setForm((f) => ({ ...f, text: e.target.value })),
          placeholder: "Enter the question...",
          className: "border-border/60 focus:border-primary/50",
          "data-ocid": `${ocidPrefix}.text_input`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold text-sm", children: "Answer Options" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1", children: "Click the radio to mark the correct answer." }),
      form.options.map((opt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-2.5 p-2 rounded-xl border-2 transition-all duration-200 ${form.correctOptionIndex === idx ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" : "border-border/50 hover:border-border"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "radio",
                name: `correct-${ocidPrefix}`,
                checked: form.correctOptionIndex === idx,
                onChange: () => setForm((f) => ({ ...f, correctOptionIndex: idx })),
                className: "shrink-0 accent-emerald-500",
                "aria-label": `Mark option ${OPTION_LABELS[idx]} as correct`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${OPTION_COLORS[idx]}`,
                children: OPTION_LABELS[idx]
              }
            ),
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
                className: "flex-1 border-0 bg-transparent focus-visible:ring-0 p-0 h-auto text-sm",
                "data-ocid": `${ocidPrefix}.option_input.${idx + 1}`
              }
            ),
            form.correctOptionIndex === idx && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0" })
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "Questions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Manage multiple-choice questions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          className: "gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5",
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1.5 block font-semibold text-sm", children: "Filter by Subject" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: selectedSubjectId,
          onValueChange: setSelectedSubjectId,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-72 border-border/60 focus:border-blue-400 focus:ring-blue-400/20",
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
        className: "text-center py-20 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/10",
        "data-ocid": "admin.questions.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "h-8 w-8 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground mb-2", children: "Select a subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Choose a subject above to view and manage its questions." })
        ]
      }
    ),
    selectedSubjectId && isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}),
    selectedSubjectId && !isLoading && (questions == null ? void 0 : questions.length) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-20 rounded-2xl border-2 border-dashed border-border bg-muted/20",
        "data-ocid": "admin.questions.no_questions_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "h-12 w-12 mx-auto mb-3 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No questions yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Add the first question for this subject." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "admin.questions.list", children: questions == null ? void 0 : questions.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "group overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
        "data-ocid": `admin.questions.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center justify-center h-6 w-8 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold", children: [
                "Q",
                i + 1
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-relaxed mb-3", children: q.text }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: q.options.map((opt, oi) => {
                const isCorrect = oi === Number(q.correctOptionIndex);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `flex items-center gap-2 px-3 py-2 rounded-xl text-xs border-2 font-medium ${isCorrect ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300" : `${OPTION_COLORS[oi]}`}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold shrink-0 w-4", children: OPTION_LABELS[oi] }),
                      isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 shrink-0 text-emerald-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: opt })
                    ]
                  },
                  `opt-${oi}-${opt.slice(0, 8)}`
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600",
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
                  className: "h-8 w-8 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-destructive hover:text-rose-600",
                  onClick: () => setDeleteId(q.id),
                  "aria-label": "Delete question",
                  "data-ocid": `admin.questions.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ] })
          ] }) })
        ]
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
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "border-0 shadow-2xl",
            "data-ocid": "admin.questions.create.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: "New Question" })
              ] }) }),
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
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
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
                    className: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white",
                    "data-ocid": "admin.questions.create.submit_button",
                    children: "Create Question"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!editQuestion,
        onOpenChange: (v) => !v && setEditQuestion(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "border-0 shadow-2xl",
            "data-ocid": "admin.questions.edit.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: "Edit Question" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                QuestionForm,
                {
                  form,
                  setForm,
                  ocidPrefix: "admin.questions.edit"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
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
                    className: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white",
                    "data-ocid": "admin.questions.edit.save_button",
                    children: "Save Changes"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: deleteId !== null,
        onOpenChange: (v) => !v && setDeleteId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "border-0 shadow-2xl max-w-sm",
            "data-ocid": "admin.questions.delete.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-rose-600" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: "Delete Question?" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-lg p-3", children: "⚠️ This action cannot be undone." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
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
                    className: "bg-rose-600 hover:bg-rose-700",
                    "data-ocid": "admin.questions.delete.confirm_button",
                    children: "Delete"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] }) });
}
export {
  QuestionsPage as default
};
