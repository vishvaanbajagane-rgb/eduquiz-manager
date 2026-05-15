import { c as createLucideIcon, u as useNavigate, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, B as Button } from "./index-BtG-7keB.js";
import { u as useAuth, a as useRole, g as useActor, h as useQuery, b as BookOpen, C as Card, c as CardHeader, d as CardTitle, B as Badge, e as CardDescription, f as CardContent, i as createActor } from "./useRole-DKmUvK7y.js";
import { S as StudentLayout } from "./StudentLayout-BuIusyAk.js";
import { u as useMutation, a as ue } from "./index-1gSpk2TV.js";
import { C as CircleCheck } from "./circle-check-CvYA9p_X.js";
import { C as CirclePlay } from "./circle-play-DYhh1UdD.js";
import "./separator-C0JGTHfA.js";
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", "data-ocid": "student.quizzes.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "My Quizzes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Choose a subject to start or retake a quiz" })
    ] }),
    availableSubjects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 text-muted-foreground",
        "data-ocid": "student.quizzes.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-12 w-12 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No quizzes available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Your teacher hasn't added any questions yet. Check back soon!" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-ocid": "student.quizzes.list", children: availableSubjects.map((subject, i) => {
      const lastAttempt = completedMap.get(subject.id.toString());
      const pct = lastAttempt ? Math.round(
        Number(lastAttempt.score) / Math.max(1, Number(lastAttempt.totalQuestions)) * 100
      ) : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "zone-section hover:shadow-md transition-smooth",
          "data-ocid": `student.quizzes.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: subject.name }),
                  lastAttempt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs gap-1 border-primary/30 text-primary bg-primary/10",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                        "Completed"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs mt-1 line-clamp-2", children: subject.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "shrink-0 text-xs", children: [
                subject.questionCount.toString(),
                " questions"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              lastAttempt && pct !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                  lastAttempt.score.toString(),
                  "/",
                  lastAttempt.totalQuestions.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1", children: [
                  "— ",
                  pct,
                  "%"
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Not started" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: lastAttempt ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "gap-2",
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
                  className: "gap-2",
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
