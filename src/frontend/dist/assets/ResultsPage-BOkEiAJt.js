import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, B as Button } from "./index-wtDjB40g.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DmO1ws7H.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CuWDerKJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, I as Input, C as ChevronDown } from "./select-CEzoZTdG.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CDtFjtMc.js";
import { u as useAuth } from "./useAuth-DFpGwHTT.js";
import { u as useRole } from "./useRole-tymDn5Pd.js";
import { a as ChartColumn, A as AdminLayout } from "./AdminLayout-BhBXMxD2.js";
import { U as Users } from "./users-Boq_jEJu.js";
import { T as Trophy } from "./index-NdfUvQ1L.js";
import { C as ChevronRight, a as CircleX } from "./circle-x-BN7nWjq-.js";
import { C as CircleCheck } from "./circle-check-CMWg7sBD.js";
import "./check-BYMCITWT.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
function ScoreBadge({
  pct,
  score,
  total
}) {
  const label = `${score.toString()}/${total.toString()} (${pct}%)`;
  if (pct >= 70)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm", children: label });
  if (pct >= 40)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-sm", children: label });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-sm", children: label });
}
function AnswerBreakdown({
  attempt,
  details,
  isLoadingDetails
}) {
  if (isLoadingDetails)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-4 pl-12 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" }),
      "Loading answer details…"
    ] });
  if (!details)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 pl-12 text-sm text-muted-foreground", children: "Could not load answer details." });
  const { correctAnswers } = details;
  const { answers } = attempt;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-muted/30 to-muted/10 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[auto_1fr_1fr_auto] gap-x-6 gap-y-2 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "#" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Student Answer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Correct Answer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Result" }),
    answers.map((ans, idx) => {
      const correct = correctAnswers[idx];
      const isRight = ans === correct;
      const ansLabel = (Number(ans) + 1).toString();
      const correctLabel = correct !== void 0 ? (Number(correct) + 1).toString() : "—";
      return [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-xs text-muted-foreground py-1",
            children: [
              "Q",
              idx + 1
            ]
          },
          `q-${idx}-${ansLabel}`
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `text-xs py-1 font-semibold ${isRight ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`,
            children: [
              "Option ",
              ansLabel
            ]
          },
          `sa-${idx}-${ansLabel}`
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-xs py-1 text-foreground font-medium",
            children: [
              "Option ",
              correctLabel
            ]
          },
          `ca-${idx}-${correctLabel}`
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "py-1",
            children: isRight ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-rose-500" })
          },
          `r-${idx}-${isRight ? "pass" : "fail"}`
        )
      ];
    })
  ] }) }) });
}
function AttemptRow({
  attempt,
  subjectMap,
  actor,
  isFetchingActor,
  rowIndex
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const { data: details, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["attemptDetails", attempt.id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAttemptDetails(attempt.id);
    },
    enabled: expanded && !!actor && !isFetchingActor
  });
  const pct = Number(attempt.scorePercentage);
  const principal = attempt.studentPrincipal.toString();
  const truncatedPrincipal = `${principal.slice(0, 6)}…${principal.slice(-4)}`;
  const subjectName = subjectMap.get(attempt.subjectId.toString()) ?? "Unknown Subject";
  const date = attempt.completedAt ? new Date(Number(attempt.completedAt) / 1e6).toLocaleDateString(
    void 0,
    { month: "short", day: "numeric", year: "numeric" }
  ) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      TableRow,
      {
        className: `cursor-pointer transition-colors hover:bg-primary/5 ${rowIndex % 2 === 0 ? "bg-muted/20" : ""}`,
        onClick: () => setExpanded((v) => !v),
        "data-ocid": `admin.results.attempt.item.${rowIndex}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "w-8 pl-4 pr-0", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs bg-muted/60 border border-border px-2 py-1 rounded-lg font-mono text-muted-foreground", children: truncatedPrincipal }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-foreground font-semibold", children: subjectName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ScoreBadge,
            {
              pct,
              score: attempt.score,
              total: attempt.totalQuestions
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs text-muted-foreground tabular-nums", children: date })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      AnswerBreakdown,
      {
        attempt,
        details,
        isLoadingDetails
      }
    ) }) })
  ] });
}
const STAT_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600"
];
function ResultsPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const [search, setSearch] = reactExports.useState("");
  const [filterSubjectId, setFilterSubjectId] = reactExports.useState("all");
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "student") navigate({ to: "/student/quizzes" });
  }, [isAuthenticated, role, navigate]);
  const { data: attempts, isLoading: loadingAttempts } = useQuery({
    queryKey: ["allAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAttempts();
    },
    enabled: !!actor && !isFetching
  });
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching
  });
  const subjectMap = reactExports.useMemo(
    () => new Map((subjects == null ? void 0 : subjects.map((s) => [s.id.toString(), s.name])) ?? []),
    [subjects]
  );
  const completedAttempts = reactExports.useMemo(
    () => (attempts ?? []).filter((a) => a.completed),
    [attempts]
  );
  const avgScore = reactExports.useMemo(() => {
    if (completedAttempts.length === 0) return 0;
    return Math.round(
      completedAttempts.reduce((sum, a) => sum + Number(a.scorePercentage), 0) / completedAttempts.length
    );
  }, [completedAttempts]);
  const uniqueStudents = reactExports.useMemo(
    () => new Set(completedAttempts.map((a) => a.studentPrincipal.toString())).size,
    [completedAttempts]
  );
  const filteredAttempts = reactExports.useMemo(() => {
    let list = completedAttempts;
    if (filterSubjectId !== "all")
      list = list.filter((a) => a.subjectId.toString() === filterSubjectId);
    const q = search.trim().toLowerCase();
    if (q)
      list = list.filter(
        (a) => a.studentPrincipal.toString().toLowerCase().includes(q)
      );
    return list.slice().sort((a, b) => Number((b.completedAt ?? 0n) - (a.completedAt ?? 0n)));
  }, [completedAttempts, filterSubjectId, search]);
  if (role === "loading" || loadingAttempts || loadingSubjects)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  const STATS = [
    {
      label: "Total Students",
      value: uniqueStudents,
      icon: Users,
      grad: STAT_GRADIENTS[0]
    },
    {
      label: "Quiz Attempts",
      value: completedAttempts.length,
      icon: ChartColumn,
      grad: STAT_GRADIENTS[1]
    },
    {
      label: "Avg. Score %",
      value: `${avgScore}%`,
      icon: Trophy,
      grad: STAT_GRADIENTS[2]
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", "data-ocid": "admin.results.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent", children: "Results" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Review quiz submissions and answer breakdowns" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4 mb-8", children: STATS.map((stat) => {
      const Icon = stat.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1 w-full bg-gradient-to-r ${stat.grad}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-11 w-11 rounded-xl bg-gradient-to-br ${stat.grad} flex items-center justify-center shrink-0 shadow`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: stat.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: stat.label })
              ] })
            ] }) })
          ]
        },
        stat.label
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-0 shadow-md overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-card to-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "Quiz Submissions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filterSubjectId,
                onValueChange: setFilterSubjectId,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-8 text-sm w-44",
                      "data-ocid": "admin.results.subject.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Subjects" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Subjects" }),
                    subjects == null ? void 0 : subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectItem,
                      {
                        value: s.id.toString(),
                        children: s.name
                      },
                      s.id.toString()
                    ))
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Search principal…",
                className: "pl-8 h-8 text-sm w-48",
                "data-ocid": "admin.results.search_input"
              }
            )
          ] }),
          (search || filterSubjectId !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "h-8 text-xs text-muted-foreground px-2",
              onClick: () => {
                setSearch("");
                setFilterSubjectId("all");
              },
              "data-ocid": "admin.results.clear_filter_button",
              children: "Clear"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: completedAttempts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-16",
          "data-ocid": "admin.results.attempts.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-7 w-7 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No quiz submissions yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Results will appear here once students complete quizzes." })
          ]
        }
      ) : filteredAttempts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-12 text-muted-foreground",
          "data-ocid": "admin.results.attempts.no_match_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No submissions match the current filters." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-8 pl-4 pr-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Date" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredAttempts.map((attempt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          AttemptRow,
          {
            attempt,
            subjectMap,
            actor,
            isFetchingActor: isFetching,
            rowIndex: idx + 1
          },
          `${attempt.id.toString()}-${attempt.studentPrincipal.toString()}`
        )) })
      ] }) })
    ] })
  ] }) });
}
export {
  ResultsPage as default
};
