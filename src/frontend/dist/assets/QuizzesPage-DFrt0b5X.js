import { c as createLucideIcon, u as useNavigate, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, B as Button } from "./index-Hh1gENll.js";
import { u as useAuth, a as useActor, b as useQuery, B as BookOpen, c as createActor } from "./backend-Bub9mio5.js";
import { B as Badge } from "./badge-EMKhFOLg.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-DE0aOoMx.js";
import { u as useRole } from "./useRole-DOnT3i7R.js";
import { S as StudentLayout } from "./StudentLayout-CFKi020B.js";
import { u as useMutation, a as ue } from "./index-CLu1Ust6.js";
import { Z as Zap } from "./zap-DNUFb4Rd.js";
import { S as Sparkles } from "./sparkles-Bf1D91Qa.js";
import { C as CircleCheck } from "./circle-check-BCDIuKY2.js";
import { C as CirclePlay } from "./circle-play-DwKZexl-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
const CARD_GRADIENTS = [
  {
    bg: "from-violet-500 to-purple-600",
    soft: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
    border: "border-violet-200 dark:border-violet-800/50"
  },
  {
    bg: "from-blue-500 to-cyan-600",
    soft: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    border: "border-blue-200 dark:border-blue-800/50"
  },
  {
    bg: "from-emerald-500 to-teal-600",
    soft: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
    border: "border-emerald-200 dark:border-emerald-800/50"
  },
  {
    bg: "from-orange-500 to-amber-500",
    soft: "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
    border: "border-orange-200 dark:border-orange-800/50"
  },
  {
    bg: "from-rose-500 to-pink-600",
    soft: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
    border: "border-rose-200 dark:border-rose-800/50"
  },
  {
    bg: "from-indigo-500 to-blue-600",
    soft: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
    border: "border-indigo-200 dark:border-indigo-800/50"
  }
];
function QuizzesPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "admin") navigate({ to: "/admin/subjects" });
  }, [isAuthenticated, role, navigate]);
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching
  });
  const { data: attempts, isLoading: loadingAttempts } = useQuery({
    queryKey: ["myAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAttempts();
    },
    enabled: !!actor && !isFetching
  });
  const startMutation = useMutation({
    mutationFn: async (subjectId) => {
      if (!actor) throw new Error("No actor");
      return actor.startQuiz(subjectId);
    },
    onSuccess: (data, subjectId) => {
      queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
      navigate({
        to: "/student/quiz/$subjectId",
        params: { subjectId: subjectId.toString() },
        search: { attemptId: data.id.toString() }
      });
    },
    onError: () => ue.error("Failed to start quiz. Please try again.")
  });
  if (role === "loading" || loadingSubjects || loadingAttempts)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  const availableSubjects = (subjects == null ? void 0 : subjects.filter((s) => Number(s.questionCount) > 0)) ?? [];
  const completedMap = /* @__PURE__ */ new Map();
  for (const a of (attempts == null ? void 0 : attempts.filter((a2) => a2.completed)) ?? []) {
    const key = a.subjectId.toString();
    const existing = completedMap.get(key);
    if (!existing || a.completedAt && existing.completedAt && a.completedAt > existing.completedAt) {
      completedMap.set(key, a);
    }
  }
  const totalSubjects = availableSubjects.length;
  const completedCount = availableSubjects.filter(
    (s) => completedMap.has(s.id.toString())
  ).length;
  const RING_SIZE = 120;
  const RING_STROKE = 10;
  const RING_R = (RING_SIZE - RING_STROKE) / 2;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;
  const globalPct = totalSubjects > 0 ? completedCount / totalSubjects : 0;
  const globalOffset = RING_CIRCUMFERENCE * (1 - globalPct);
  const MINI_SIZE = 40;
  const MINI_STROKE = 4;
  const MINI_R = (MINI_SIZE - MINI_STROKE) / 2;
  const MINI_CIRCUMFERENCE = 2 * Math.PI * MINI_R;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", "data-ocid": "student.quizzes.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent", children: "My Quizzes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Choose a subject to start or retake a quiz" })
      ] })
    ] }) }),
    totalSubjects > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-8 rounded-2xl border bg-gradient-to-br from-violet-50/80 to-purple-50/60 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800/50 p-6 flex flex-col items-center gap-3 shadow-sm",
        "data-ocid": "student.quizzes.progress_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              width: RING_SIZE,
              height: RING_SIZE,
              style: { transform: "rotate(-90deg)" },
              role: "img",
              "aria-label": `${completedCount} of ${totalSubjects} subjects completed`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: RING_SIZE / 2,
                    cy: RING_SIZE / 2,
                    r: RING_R,
                    fill: "none",
                    stroke: "oklch(0.3 0.05 240)",
                    strokeWidth: RING_STROKE,
                    strokeLinecap: "round",
                    opacity: "0.35"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: RING_SIZE / 2,
                    cy: RING_SIZE / 2,
                    r: RING_R,
                    fill: "none",
                    stroke: "oklch(0.7 0.15 145)",
                    strokeWidth: RING_STROKE,
                    strokeLinecap: "round",
                    strokeDasharray: RING_CIRCUMFERENCE,
                    strokeDashoffset: globalOffset,
                    style: { transition: "stroke-dashoffset 0.8s ease" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "text",
                  {
                    x: RING_SIZE / 2,
                    y: RING_SIZE / 2 - 6,
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    style: {
                      transform: `rotate(90deg) translate(0px, -${RING_SIZE}px)`,
                      transformOrigin: `${RING_SIZE / 2}px ${RING_SIZE / 2}px`,
                      fontSize: "18px",
                      fontWeight: "700",
                      fill: "oklch(0.7 0.15 145)",
                      fontFamily: "inherit"
                    },
                    children: [
                      completedCount,
                      " / ",
                      totalSubjects
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: RING_SIZE / 2,
                    y: RING_SIZE / 2 + 14,
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    style: {
                      transform: `rotate(90deg) translate(0px, -${RING_SIZE}px)`,
                      transformOrigin: `${RING_SIZE / 2}px ${RING_SIZE / 2}px`,
                      fontSize: "11px",
                      fontWeight: "500",
                      fill: "oklch(0.55 0.05 240)",
                      fontFamily: "inherit"
                    },
                    children: "Subjects"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground tracking-wide", children: "Your Progress" })
        ]
      }
    ),
    availableSubjects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-20 rounded-2xl border-2 border-dashed border-violet-200 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/60 to-purple-50/40 dark:from-violet-950/10 dark:to-purple-950/10",
        "data-ocid": "student.quizzes.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-8 w-8 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground mb-2", children: "🏗️ Coming soon!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mx-auto", children: "Your teacher is preparing amazing quizzes for you. Check back soon — challenges await!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-violet-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-violet-500 font-medium", children: "Get ready to learn!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-violet-400" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-ocid": "student.quizzes.list", children: availableSubjects.map((subject, i) => {
      const lastAttempt = completedMap.get(subject.id.toString());
      const pct = lastAttempt ? Math.round(
        Number(lastAttempt.score) / Math.max(1, Number(lastAttempt.totalQuestions)) * 100
      ) : null;
      const grad = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
      const miniOffset = lastAttempt ? 0 : MINI_CIRCUMFERENCE;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: `overflow-hidden border bg-gradient-to-br ${grad.soft} ${grad.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`,
          "data-ocid": `student.quizzes.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-12 w-12 rounded-xl bg-gradient-to-br ${grad.bg} flex items-center justify-center shrink-0 shadow-md`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: subject.name }),
                    lastAttempt && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs gap-1 bg-[oklch(0.92_0.08_145)] text-[oklch(0.45_0.12_145)] dark:bg-[oklch(0.3_0.08_145)] dark:text-[oklch(0.8_0.1_145)] border-[oklch(0.75_0.1_145)] dark:border-[oklch(0.45_0.1_145)] font-semibold", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                      "Completed"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs mt-1 line-clamp-2", children: subject.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex flex-col items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  width: MINI_SIZE,
                  height: MINI_SIZE,
                  style: { transform: "rotate(-90deg)" },
                  role: "img",
                  "aria-label": lastAttempt ? "Completed" : "Not started",
                  "data-ocid": `student.quizzes.progress_ring.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: MINI_SIZE / 2,
                        cy: MINI_SIZE / 2,
                        r: MINI_R,
                        fill: "none",
                        stroke: "oklch(0.7 0.04 240)",
                        strokeWidth: MINI_STROKE,
                        opacity: "0.4"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: MINI_SIZE / 2,
                        cy: MINI_SIZE / 2,
                        r: MINI_R,
                        fill: "none",
                        stroke: lastAttempt ? "oklch(0.6 0.15 145)" : "oklch(0.7 0.04 240)",
                        strokeWidth: MINI_STROKE,
                        strokeLinecap: "round",
                        strokeDasharray: MINI_CIRCUMFERENCE,
                        strokeDashoffset: miniOffset,
                        opacity: lastAttempt ? 1 : 0.25,
                        style: { transition: "stroke-dashoffset 0.6s ease" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "text",
                      {
                        x: MINI_SIZE / 2,
                        y: MINI_SIZE / 2,
                        textAnchor: "middle",
                        dominantBaseline: "middle",
                        style: {
                          transform: `rotate(90deg) translate(0px, -${MINI_SIZE}px)`,
                          transformOrigin: `${MINI_SIZE / 2}px ${MINI_SIZE / 2}px`,
                          fontSize: "13px",
                          fontWeight: "700",
                          fill: lastAttempt ? "oklch(0.6 0.15 145)" : "oklch(0.6 0.04 240)",
                          fontFamily: "inherit"
                        },
                        children: lastAttempt ? "✓" : "0"
                      }
                    )
                  ]
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              lastAttempt && pct !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-bold text-foreground", children: [
                  lastAttempt.score.toString(),
                  "/",
                  lastAttempt.totalQuestions.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `text-xs font-bold px-2 py-0.5 rounded-full ${pct >= 70 ? "bg-[oklch(0.92_0.08_145)] text-[oklch(0.45_0.12_145)] dark:bg-[oklch(0.3_0.08_145)] dark:text-[oklch(0.8_0.1_145)]" : pct >= 40 ? "bg-[oklch(0.93_0.1_75)] text-[oklch(0.5_0.14_75)] dark:bg-[oklch(0.32_0.08_75)] dark:text-[oklch(0.82_0.1_75)]" : "bg-[oklch(0.93_0.08_25)] text-[oklch(0.48_0.14_25)] dark:bg-[oklch(0.3_0.08_25)] dark:text-[oklch(0.82_0.1_25)]"}`,
                    children: [
                      pct,
                      "%"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "✨ Not started yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: lastAttempt ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "gap-2 font-semibold hover:bg-muted",
                  disabled: startMutation.isPending,
                  onClick: () => startMutation.mutate(subject.id),
                  "data-ocid": `student.quizzes.retake_button.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" }),
                    " Retake"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: `gap-2 font-bold bg-gradient-to-r ${grad.bg} hover:opacity-90 text-white border-0 shadow-md shadow-black/10 hover:-translate-y-0.5 transition-all duration-200`,
                  disabled: startMutation.isPending,
                  onClick: () => startMutation.mutate(subject.id),
                  "data-ocid": `student.quizzes.start_button.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "h-4 w-4" }),
                    " Start Quiz"
                  ]
                }
              ) })
            ] }) })
          ]
        },
        subject.id.toString()
      );
    }) })
  ] }) });
}
export {
  QuizzesPage as default
};
