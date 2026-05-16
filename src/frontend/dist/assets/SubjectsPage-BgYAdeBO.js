import { j as jsxRuntimeExports, a as cn, u as useNavigate, b as useQueryClient, r as reactExports, L as LoadingSpinner, B as Button } from "./index-bpXuEzrw.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-CCEFFmVU.js";
import { B as Badge } from "./index-Cxvel48n.js";
import { C as Card, a as CardContent } from "./card-CmR3d6zk.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BJ8WYbYb.js";
import { I as Input, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-lvEbVpzU.js";
import { P as Plus, a as Pencil, T as Trash2, L as Label } from "./label-Cb5MjiB7.js";
import { u as useAuth, B as BookOpen } from "./useAuth-C9wYs-_s.js";
import { u as useRole } from "./useRole-BpWvTBpD.js";
import { A as AdminLayout } from "./AdminLayout-CtcNoo36.js";
import { u as useMutation, a as ue } from "./index-BnyW8Eih.js";
import { C as Clock } from "./clock-DvqmsUEp.js";
import "./check-CYQH_8X5.js";
import "./index-vfi5ijP2.js";
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const SUBJECT_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600"
];
const TIMER_PRESETS = [
  { value: "none", label: "No Timer", minutes: null },
  { value: "30", label: "30 minutes", minutes: 30 },
  { value: "60", label: "1 hour", minutes: 60 },
  { value: "120", label: "2 hours", minutes: 120 },
  { value: "1440", label: "24 hours", minutes: 1440 },
  { value: "custom", label: "Custom …", minutes: null }
];
function minutesToPreset(minutes) {
  if (minutes == null) return "none";
  const match = TIMER_PRESETS.find((p) => p.minutes === minutes);
  return match ? match.value : "custom";
}
function formatTimerBadge(minutes) {
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
function SubjectsPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [editSubject, setEditSubject] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    description: "",
    timerPreset: "none",
    timerCustom: ""
  });
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [nameError, setNameError] = reactExports.useState("");
  const [editNameError, setEditNameError] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "student") navigate({ to: "/student/quizzes" });
  }, [isAuthenticated, role, navigate]);
  const { data: subjects, isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching
  });
  const createMutation = useMutation({
    mutationFn: async (payload) => {
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
        timerCustom: ""
      });
      ue.success("Subject created");
    },
    onError: () => ue.error("Failed to create subject")
  });
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
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
        timerCustom: ""
      });
      ue.success("Subject updated");
    },
    onError: () => ue.error("Failed to update subject")
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSubject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setDeleteId(null);
      ue.success("Subject deleted");
    },
    onError: () => ue.error("Failed to delete subject")
  });
  if (role === "loading" || isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  const openEdit = (s) => {
    setEditSubject(s);
    const mins = s.timerMinutes != null ? Number(s.timerMinutes) : null;
    const preset = minutesToPreset(mins);
    setForm({
      name: s.name,
      description: s.description,
      timerPreset: preset,
      timerCustom: preset === "custom" && mins != null ? mins.toString() : ""
    });
  };
  const handleCreate = () => {
    if (!form.name.trim()) {
      setNameError("Subject name is required");
      return;
    }
    let timerMinutes;
    if (form.timerPreset !== "none") {
      const mins = form.timerPreset === "custom" ? Number.parseInt(form.timerCustom, 10) : Number(form.timerPreset);
      if (!Number.isNaN(mins) && mins > 0) timerMinutes = BigInt(mins);
    }
    createMutation.mutate({
      name: form.name,
      description: form.description,
      ...timerMinutes != null ? { timerMinutes } : {}
    });
  };
  const handleUpdate = () => {
    if (!editSubject) return;
    if (!form.name.trim()) {
      setEditNameError("Subject name is required");
      return;
    }
    setEditNameError("");
    let timerMinutes;
    if (form.timerPreset !== "none") {
      const mins = form.timerPreset === "custom" ? Number.parseInt(form.timerCustom, 10) : Number(form.timerPreset);
      if (!Number.isNaN(mins) && mins > 0) timerMinutes = BigInt(mins);
    }
    updateMutation.mutate({
      id: editSubject.id,
      name: form.name,
      description: form.description,
      ...timerMinutes != null ? { timerMinutes } : {}
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", "data-ocid": "admin.subjects.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent", children: "Subjects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Manage quiz topics and subjects" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          className: "gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 hover:-translate-y-0.5",
          onClick: () => {
            setForm({
              name: "",
              description: "",
              timerPreset: "none",
              timerCustom: ""
            });
            setShowCreate(true);
          },
          "data-ocid": "admin.subjects.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Subject"
          ]
        }
      )
    ] }),
    (subjects == null ? void 0 : subjects.length) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-20 rounded-2xl border-2 border-dashed border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-950/10",
        "data-ocid": "admin.subjects.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-8 w-8 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground mb-2", children: "No subjects yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Create your first subject to get started." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-ocid": "admin.subjects.list", children: subjects == null ? void 0 : subjects.map((subject, i) => {
      const grad = SUBJECT_GRADIENTS[i % SUBJECT_GRADIENTS.length];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "group overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card",
          "data-ocid": `admin.subjects.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 w-full bg-gradient-to-r ${grad}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-11 w-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0 shadow-sm`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-base truncate", children: subject.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5 line-clamp-1", children: subject.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700 font-semibold text-xs px-2.5", children: [
                    subject.questionCount.toString(),
                    " Q"
                  ] }),
                  (() => {
                    const label = formatTimerBadge(subject.timerMinutes);
                    return label ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs gap-1 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                          label
                        ]
                      }
                    ) : null;
                  })()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600",
                      onClick: () => openEdit(subject),
                      "aria-label": "Edit subject",
                      "data-ocid": `admin.subjects.edit_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 text-destructive",
                      onClick: () => setDeleteId(subject.id),
                      "aria-label": "Delete subject",
                      "data-ocid": `admin.subjects.delete_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] })
              ] })
            ] }) })
          ]
        },
        subject.id.toString()
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: showCreate,
        onOpenChange: (v) => {
          setShowCreate(v);
          if (!v) setNameError("");
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "border-0 shadow-2xl",
            "data-ocid": "admin.subjects.create.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: "New Subject" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-name", className: "font-semibold text-sm", children: "Subject Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "s-name",
                      value: form.name,
                      onChange: (e) => {
                        setNameError("");
                        setForm((f) => ({ ...f, name: e.target.value }));
                      },
                      placeholder: "e.g. Mathematics",
                      className: "border-border/60 focus:border-violet-400 focus:ring-violet-400/20",
                      "data-ocid": "admin.subjects.create.name_input"
                    }
                  ),
                  nameError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: nameError })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-desc", className: "font-semibold text-sm", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "s-desc",
                      value: form.description,
                      onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                      placeholder: "Brief description of this subject",
                      rows: 3,
                      className: "border-border/60 focus:border-violet-400 resize-none",
                      "data-ocid": "admin.subjects.create.description_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold text-sm", children: "Quiz Timer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: form.timerPreset,
                      onValueChange: (v) => setForm((f) => ({
                        ...f,
                        timerPreset: v,
                        timerCustom: ""
                      })),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "border-border/60 focus:border-violet-400",
                            "data-ocid": "admin.subjects.create.timer_select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select timer" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: TIMER_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.value, children: p.label }, p.value)) })
                      ]
                    }
                  ),
                  form.timerPreset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: 1,
                        value: form.timerCustom,
                        onChange: (e) => setForm((f) => ({ ...f, timerCustom: e.target.value })),
                        placeholder: "Enter minutes",
                        className: "border-border/60 focus:border-violet-400",
                        "data-ocid": "admin.subjects.create.timer_custom_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground shrink-0", children: "minutes" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => setShowCreate(false),
                    "data-ocid": "admin.subjects.create.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    onClick: handleCreate,
                    disabled: createMutation.isPending,
                    className: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white",
                    "data-ocid": "admin.subjects.create.submit_button",
                    children: "Create Subject"
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
        open: !!editSubject,
        onOpenChange: (v) => {
          if (!v) {
            setEditSubject(null);
            setEditNameError("");
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "border-0 shadow-2xl",
            "data-ocid": "admin.subjects.edit.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: "Edit Subject" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "es-name", className: "font-semibold text-sm", children: "Subject Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "es-name",
                      value: form.name,
                      onChange: (e) => {
                        setEditNameError("");
                        setForm((f) => ({ ...f, name: e.target.value }));
                      },
                      className: "border-border/60 focus:border-blue-400",
                      "data-ocid": "admin.subjects.edit.name_input"
                    }
                  ),
                  editNameError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editNameError })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "es-desc", className: "font-semibold text-sm", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "es-desc",
                      value: form.description,
                      onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                      rows: 3,
                      className: "border-border/60 focus:border-blue-400 resize-none",
                      "data-ocid": "admin.subjects.edit.description_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold text-sm", children: "Quiz Timer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: form.timerPreset,
                      onValueChange: (v) => setForm((f) => ({
                        ...f,
                        timerPreset: v,
                        timerCustom: ""
                      })),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "border-border/60 focus:border-blue-400",
                            "data-ocid": "admin.subjects.edit.timer_select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select timer" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: TIMER_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.value, children: p.label }, p.value)) })
                      ]
                    }
                  ),
                  form.timerPreset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: 1,
                        value: form.timerCustom,
                        onChange: (e) => setForm((f) => ({ ...f, timerCustom: e.target.value })),
                        placeholder: "Enter minutes",
                        className: "border-border/60 focus:border-blue-400",
                        "data-ocid": "admin.subjects.edit.timer_custom_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground shrink-0", children: "minutes" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => setEditSubject(null),
                    "data-ocid": "admin.subjects.edit.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    onClick: handleUpdate,
                    disabled: updateMutation.isPending,
                    className: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white",
                    "data-ocid": "admin.subjects.edit.save_button",
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
            "data-ocid": "admin.subjects.delete.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-rose-600" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: "Delete Subject?" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-lg p-3", children: "⚠️ This will permanently delete the subject and all its questions." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => setDeleteId(null),
                    "data-ocid": "admin.subjects.delete.cancel_button",
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
                    "data-ocid": "admin.subjects.delete.confirm_button",
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
  SubjectsPage as default
};
