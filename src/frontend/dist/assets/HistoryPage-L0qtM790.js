import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, B as Button } from "./index-BtG-7keB.js";
import { u as useAuth, a as useRole, g as useActor, h as useQuery, C as Card, c as CardHeader, d as CardTitle, B as Badge, f as CardContent, i as createActor } from "./useRole-DKmUvK7y.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-B2mMw4ue.js";
import { S as StudentLayout, C as ClipboardList } from "./StudentLayout-BuIusyAk.js";
import { C as CirclePlay } from "./circle-play-DYhh1UdD.js";
import "./separator-C0JGTHfA.js";
function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "admin") navigate({ to: "/admin/subjects" });
  }, [isAuthenticated, role, navigate]);
  const { data: attempts, isLoading } = useQuery({
    queryKey: ["myAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAttempts();
    },
    enabled: !!actor && !isFetching
  });
  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching
  });
  if (role === "loading" || isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  const subjectMap = new Map(
    (subjects == null ? void 0 : subjects.map((s) => [s.id.toString(), s.name])) ?? []
  );
  const completedAttempts = ((attempts == null ? void 0 : attempts.filter((a) => a.completed)) ?? []).slice().sort((a, b) => {
    const ta = a.completedAt ? Number(a.completedAt) : 0;
    const tb = b.completedAt ? Number(b.completedAt) : 0;
    return tb - ta;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", "data-ocid": "student.history.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Quiz History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "All your completed quiz attempts, most recent first" })
    ] }),
    completedAttempts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 text-muted-foreground",
        "data-ocid": "student.history.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-12 w-12 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No completed quizzes yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1 mb-6", children: "Go to My Quizzes to take your first quiz!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "gap-2",
              onClick: () => navigate({ to: "/student/quizzes" }),
              "data-ocid": "student.history.go_quizzes_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "h-4 w-4" }),
                " Browse Quizzes"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "zone-section", "data-ocid": "student.history.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base", children: [
        "Completed Attempts",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-2 text-xs", children: completedAttempts.length })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Result" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Date" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: completedAttempts.map((a, i) => {
          const pct = Math.round(
            Number(a.score) / Math.max(1, Number(a.totalQuestions)) * 100
          );
          const date = a.completedAt ? new Date(
            Number(a.completedAt) / 1e6
          ).toLocaleDateString(void 0, {
            year: "numeric",
            month: "short",
            day: "numeric"
          }) : "—";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              "data-ocid": `student.history.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm", children: subjectMap.get(a.subjectId.toString()) ?? "Unknown" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right text-sm tabular-nums", children: [
                  a.score.toString(),
                  "/",
                  a.totalQuestions.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: pct >= 70 ? "default" : "secondary",
                    className: "text-xs",
                    children: [
                      pct,
                      "%"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs text-muted-foreground tabular-nums", children: date })
              ]
            },
            `${a.id.toString()}-${a.subjectId.toString()}`
          );
        }) })
      ] }) })
    ] })
  ] }) });
}
export {
  HistoryPage as default
};
