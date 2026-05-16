import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a as cn, u as useNavigate, g as useParams, b as useQueryClient, L as LoadingSpinner, f as Link, B as Button } from "./index-wtDjB40g.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DmO1ws7H.js";
import { A as Alert, a as AlertDescription, b as ArrowLeft } from "./alert-BliQrR1b.js";
import { T as Trophy, B as Badge } from "./index-NdfUvQ1L.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CuWDerKJ.js";
import { P as Primitive } from "./index-u-ADn6vd.js";
import { u as useAuth } from "./useAuth-DFpGwHTT.js";
import { u as useBackend } from "./useBackend-BwHrkvt_.js";
import { u as useRole } from "./useRole-tymDn5Pd.js";
import { S as StudentLayout } from "./StudentLayout-KWG3bcmk.js";
import { u as useMutation, a as ue } from "./index-B5fDjp4I.js";
import { C as CircleCheck } from "./circle-check-CMWg7sBD.js";
import { a as CircleX, C as ChevronRight } from "./circle-x-BN7nWjq-.js";
import { F as Flame } from "./flame-DS5sDFm7.js";
import { C as Clock } from "./clock-B9Iz6seb.js";
import "./dialog-CMA1u_p3.js";
import "./sparkles-C-RE_Svn.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    BaseContext.displayName = rootComponentName + "Context";
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a;
      const { scope, children, ...context } = props;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
function QuizPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const params = useParams({ from: "/student/quiz/$subjectId" });
  const { actor, isFetching } = useActor(createActor);
  const { actor: profileActor, isFetching: profileFetching } = useBackend();
  const queryClient = useQueryClient();
  const [attempt, setAttempt] = reactExports.useState(null);
  const [questions, setQuestions] = reactExports.useState([]);
  const [currentIdx, setCurrentIdx] = reactExports.useState(0);
  const [answers, setAnswers] = reactExports.useState([]);
  const [quizResult, setQuizResult] = reactExports.useState(null);
  const [correctAnswers, setCorrectAnswers] = reactExports.useState([]);
  const [timeLeft, setTimeLeft] = reactExports.useState(null);
  const [nudgeDismissed, setNudgeDismissed] = reactExports.useState(false);
  const { data: myProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!profileActor) return null;
      return profileActor.getMyProfile();
    },
    enabled: !!profileActor && !profileFetching,
    staleTime: 0,
    refetchOnMount: true
  });
  const isPrincipalLike = (s) => s.length >= 20 && /^[a-z0-9-]+$/.test(s);
  const hasName = !!((myProfile == null ? void 0 : myProfile.displayName) && myProfile.displayName.trim().length > 0 && myProfile.displayName.trim() !== "Student" && !isPrincipalLike(myProfile.displayName.trim()));
  const showNudge = !hasName && !nudgeDismissed;
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "admin") navigate({ to: "/admin/subjects" });
  }, [isAuthenticated, role, navigate]);
  const subjectId = BigInt(params.subjectId ?? "0");
  const { data: questionsData, isLoading: loadingQuestions } = useQuery({
    queryKey: ["questions", params.subjectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listQuestionsBySubject(subjectId);
    },
    enabled: !!actor && !isFetching
  });
  const startMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.startQuiz(subjectId);
    },
    onSuccess: (data) => {
      setAttempt(data);
      const qs = questionsData ?? [];
      setQuestions(qs);
      setCurrentIdx(0);
      setAnswers(new Array(qs.length).fill(void 0));
      if (data.timeLimitMinutes !== void 0 && data.timeLimitMinutes !== null) {
        const totalSeconds = Number(data.timeLimitMinutes) * 60;
        const elapsedSeconds = (Date.now() * 1e6 - Number(data.startedAt)) / 1e9;
        setTimeLeft(Math.max(0, Math.round(totalSeconds - elapsedSeconds)));
      } else {
        setTimeLeft(null);
      }
    },
    onError: () => ue.error("Failed to start quiz")
  });
  const submitMutation = useMutation({
    mutationFn: async (finalAnswers) => {
      if (!actor || !attempt) throw new Error("No actor");
      return actor.submitQuizAnswers({
        attemptId: attempt.id,
        answers: finalAnswers.map((a) => BigInt(a ?? 0))
      });
    },
    onSuccess: (data) => {
      setQuizResult(data.attempt);
      setCorrectAnswers(data.correctAnswers.map(Number));
      setTimeLeft(null);
      queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
    },
    onError: () => ue.error("Failed to submit quiz")
  });
  const submitMutate = submitMutation.mutate;
  reactExports.useEffect(() => {
    if (timeLeft === null || quizResult !== null) return;
    if (timeLeft <= 0) {
      ue.warning("Time's up! Submitting your quiz...");
      submitMutate(answers);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [timeLeft, quizResult, answers, submitMutate]);
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  if (role === "loading" || loadingQuestions)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  const handleStart = () => startMutation.mutate();
  const handleSelectAnswer = (idx) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = idx;
      return next;
    });
  };
  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };
  const handleNext = () => {
    if (currentIdx + 1 < questions.length) setCurrentIdx((i) => i + 1);
    else submitMutation.mutate(answers);
  };
  if (quizResult) {
    const pct = Math.round(
      Number(quizResult.score) / Math.max(1, Number(quizResult.totalQuestions)) * 100
    );
    const isGood = pct >= 70;
    const isMid = pct >= 40 && pct < 70;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", "data-ocid": "student.quiz.result.page", children: [
      showNudge && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Alert,
        {
          className: "mb-6 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400",
          "data-ocid": "student.quiz.result.profile_nudge",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "flex flex-wrap items-center justify-between gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex flex-wrap items-center gap-2", children: [
              "✏️ Your profile name isn't set — add your name so it appears on your certificate.",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/student/profile",
                  className: "font-semibold underline underline-offset-2 hover:no-underline shrink-0",
                  "data-ocid": "student.quiz.result.profile_nudge_link",
                  children: "Set your name →"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Dismiss profile nudge",
                className: "shrink-0 opacity-60 hover:opacity-100 transition-opacity text-base leading-none",
                onClick: () => setNudgeDismissed(true),
                "data-ocid": "student.quiz.result.profile_nudge_dismiss",
                children: "✕"
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl ${isGood ? "bg-gradient-to-br from-amber-400 to-yellow-500 shadow-amber-500/40" : isMid ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/40" : "bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-500/30"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-12 w-12 text-white" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-bold text-foreground mb-1", children: "Quiz Complete!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-lg", children: isGood ? "🎉 Excellent work!" : isMid ? "💪 Good effort!" : "📚 Keep practicing!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `inline-flex flex-col items-center rounded-2xl px-12 py-8 mb-8 shadow-xl ${isGood ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-300 dark:border-amber-700" : isMid ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-300 dark:border-blue-700" : "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-2 border-rose-300 dark:border-rose-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-7xl font-display font-bold mb-2 ${isGood ? "bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent" : isMid ? "bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent" : "bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent"}`,
                  children: [
                    pct,
                    "%"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm font-medium", children: [
                quizResult.score.toString(),
                " out of",
                " ",
                quizResult.totalQuestions.toString(),
                " correct"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "h-3 rounded-full" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-3 mb-10 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "gap-2 hover:-translate-y-0.5 transition-transform",
              onClick: () => navigate({ to: "/student/quizzes" }),
              "data-ocid": "student.quiz.result.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
                " Back to Quizzes"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => navigate({ to: "/student/history" }),
              "data-ocid": "student.quiz.result.history_button",
              children: "View History"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              className: "gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md hover:-translate-y-0.5 transition-transform",
              onClick: () => {
                setAttempt(null);
                setQuizResult(null);
              },
              "data-ocid": "student.quiz.result.retry_button",
              children: "Try Again"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-6 w-1.5 rounded-full bg-gradient-to-b from-violet-500 to-purple-600 inline-block" }),
        "Question Review"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-4",
          "data-ocid": "student.quiz.result.review_list",
          children: questions.map((q, qi) => {
            const chosenIdx = answers[qi];
            const correctIdx = correctAnswers[qi];
            const isCorrect = correctAnswers[qi] !== void 0 && chosenIdx === correctAnswers[qi];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: `overflow-hidden border-2 ${isCorrect ? "border-emerald-300 dark:border-emerald-700" : "border-rose-300 dark:border-rose-700"}`,
                "data-ocid": `student.quiz.result.review.item.${qi + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `h-1.5 w-full ${isCorrect ? "bg-gradient-to-r from-emerald-400 to-green-500" : "bg-gradient-to-r from-rose-400 to-red-500"}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-emerald-500 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-rose-500 shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium leading-relaxed", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs mr-2", children: [
                        "Q",
                        qi + 1,
                        "."
                      ] }),
                      q.text
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0 space-y-1.5", children: q.options.map((opt, oi) => {
                    const wasChosen = chosenIdx === oi;
                    const isTheCorrect = correctIdx === oi;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `flex items-center gap-2 px-3 py-2 rounded-xl text-sm border-2 ${wasChosen && isCorrect ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300" : wasChosen && !isCorrect ? "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300" : isTheCorrect ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300" : "border-border/50 text-muted-foreground"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 w-5 rounded-full border-2 border-current flex items-center justify-center text-xs shrink-0 font-bold", children: String.fromCharCode(65 + oi) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: opt }),
                          wasChosen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              className: `text-xs font-bold border-0 ${isCorrect ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700" : "bg-rose-100 dark:bg-rose-900/40 text-rose-700"}`,
                              children: "Your answer"
                            }
                          )
                        ]
                      },
                      `review-${qi}-opt-${oi}-${opt}`
                    );
                  }) })
                ]
              },
              `review-${qi}-${q.id.toString()}`
            );
          })
        }
      )
    ] }) });
  }
  if (attempt && questions.length > 0) {
    const q = questions[currentIdx];
    const selectedAnswer = answers[currentIdx];
    const progress = (currentIdx + 1) / questions.length * 100;
    const isLast = currentIdx + 1 === questions.length;
    const timerIsRed = timeLeft !== null && timeLeft < 60;
    const timerIsYellow = timeLeft !== null && timeLeft >= 60 && timeLeft < 180;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto", "data-ocid": "student.quiz.active.page", children: [
      timeLeft !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center justify-center gap-3 mb-6 px-6 py-3 rounded-2xl font-mono font-bold text-xl shadow-lg transition-all duration-500 ${timerIsRed ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/40 animate-pulse" : timerIsYellow ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-amber-500/30" : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-violet-500/30"}`,
          "data-ocid": "student.quiz.timer",
          children: [
            timerIsRed ? /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-6 w-6 shrink-0 animate-bounce" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-6 w-6 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums tracking-wider", children: formatTime(timeLeft) }),
            timerIsRed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-sans font-bold opacity-90", children: "Hurry!" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-muted-foreground", children: [
            "Question ",
            currentIdx + 1,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/60", children: [
              "of ",
              questions.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 font-bold", children: [
            Math.round(progress),
            "% done"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 transition-all duration-500",
            style: { width: `${progress}%` }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-0 shadow-xl overflow-hidden",
          "data-ocid": "student.quiz.question.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center justify-center h-8 w-10 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-bold shrink-0", children: [
                "Q",
                currentIdx + 1
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg leading-relaxed text-foreground", children: q.text })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3 pb-6", children: q.options.map((opt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: `w-full text-left px-5 py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${selectedAnswer === idx ? "border-violet-400 bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-300 shadow-md shadow-violet-500/10" : "border-border/60 bg-card hover:bg-muted/50 text-foreground hover:border-violet-200 dark:hover:border-violet-700"}`,
                onClick: () => handleSelectAnswer(idx),
                "data-ocid": `student.quiz.option.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${selectedAnswer === idx ? "border-violet-500 bg-gradient-to-br from-violet-500 to-purple-600 text-white" : "border-muted-foreground/30 text-muted-foreground"}`,
                      children: String.fromCharCode(65 + idx)
                    }
                  ),
                  opt
                ] })
              },
              `opt-${currentIdx}-${idx}-${opt}`
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "ghost",
            className: "gap-2 hover:bg-muted",
            disabled: currentIdx === 0,
            onClick: handlePrev,
            "data-ocid": "student.quiz.prev_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
              " Previous"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            className: `gap-2 font-bold transition-all duration-200 hover:-translate-y-0.5 ${isLast ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/30" : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md shadow-violet-500/30"}`,
            disabled: selectedAnswer === void 0 || submitMutation.isPending,
            onClick: handleNext,
            "data-ocid": "student.quiz.next_button",
            children: [
              isLast ? "Submit Quiz" : "Next",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            ]
          }
        )
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-xl mx-auto text-center py-16",
      "data-ocid": "student.quiz.start.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-12 w-12 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-3", children: "Ready for the challenge?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-2 text-lg", children: [
          (questionsData == null ? void 0 : questionsData.length) ?? 0,
          " questions await you!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-8", children: "Answer all questions and see your score at the end." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              className: "gap-2",
              onClick: () => navigate({ to: "/student/quizzes" }),
              "data-ocid": "student.quiz.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
                " Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "lg",
              className: "gap-2 font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-200",
              onClick: handleStart,
              disabled: startMutation.isPending,
              "data-ocid": "student.quiz.start_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }),
                " Start Quiz"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  QuizPage as default
};
