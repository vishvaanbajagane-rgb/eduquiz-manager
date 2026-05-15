import { j as jsxRuntimeExports, a as cn, u as useNavigate, b as useQueryClient, r as reactExports, L as LoadingSpinner, B as Button } from "./index-BtG-7keB.js";
import { u as useAuth, a as useRole, g as useActor, h as useQuery, b as BookOpen, C as Card, c as CardHeader, d as CardTitle, B as Badge, i as createActor } from "./useRole-DKmUvK7y.js";
import { P as Plus, a as Pencil, T as Trash2, D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, L as Label, e as DialogFooter } from "./label-BrXp2lZe.js";
import { A as AdminLayout, I as Input } from "./AdminLayout-C4TKwBUP.js";
import { u as useMutation, a as ue } from "./index-1gSpk2TV.js";
import "./separator-C0JGTHfA.js";
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
function SubjectsPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [editSubject, setEditSubject] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({ name: "", description: "" });
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
      setForm({ name: "", description: "" });
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
      setForm({ name: "", description: "" });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", "data-ocid": "admin.subjects.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Subjects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Manage quiz topics and subjects" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          className: "gap-2",
          onClick: () => {
            setForm({ name: "", description: "" });
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
        className: "text-center py-16 text-muted-foreground",
        "data-ocid": "admin.subjects.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-12 w-12 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No subjects yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Create your first subject to get started." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-ocid": "admin.subjects.list", children: subjects == null ? void 0 : subjects.map((subject, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "zone-section",
        "data-ocid": `admin.subjects.item.${i + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: subject.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 line-clamp-2", children: subject.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              subject.questionCount.toString(),
              " Q"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8",
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
                className: "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => setDeleteId(subject.id),
                "aria-label": "Delete subject",
                "data-ocid": `admin.subjects.delete_button.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }) })
      },
      subject.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: showCreate,
        onOpenChange: (v) => {
          setShowCreate(v);
          if (!v) setNameError("");
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.subjects.create.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New Subject" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-name", children: "Name" }),
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
                  "data-ocid": "admin.subjects.create.name_input"
                }
              ),
              nameError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive mt-1", children: nameError })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-desc", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "s-desc",
                  value: form.description,
                  onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                  placeholder: "Brief description",
                  rows: 3,
                  "data-ocid": "admin.subjects.create.description_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
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
                "data-ocid": "admin.subjects.create.submit_button",
                children: "Create Subject"
              }
            )
          ] })
        ] })
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
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.subjects.edit.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Subject" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "es-name", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "es-name",
                  value: form.name,
                  onChange: (e) => {
                    setEditNameError("");
                    setForm((f) => ({ ...f, name: e.target.value }));
                  },
                  "data-ocid": "admin.subjects.edit.name_input"
                }
              ),
              editNameError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive mt-1", children: editNameError })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "es-desc", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "es-desc",
                  value: form.description,
                  onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                  rows: 3,
                  "data-ocid": "admin.subjects.edit.description_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
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
                "data-ocid": "admin.subjects.edit.save_button",
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
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.subjects.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Subject?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will permanently delete the subject and all its questions." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
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
                "data-ocid": "admin.subjects.delete.confirm_button",
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
  SubjectsPage as default
};
