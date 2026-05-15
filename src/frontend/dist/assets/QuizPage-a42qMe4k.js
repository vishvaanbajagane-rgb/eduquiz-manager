import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a as cn, u as useNavigate, k as useParams, b as useQueryClient, L as LoadingSpinner, B as Button } from "./index-BtG-7keB.js";
import { u as useAuth, a as useRole, g as useActor, h as useQuery, C as Card, c as CardHeader, d as CardTitle, f as CardContent, B as Badge, i as createActor } from "./useRole-DKmUvK7y.js";
import { P as Primitive } from "./separator-C0JGTHfA.js";
import { S as StudentLayout } from "./StudentLayout-BuIusyAk.js";
import { u as useMutation, a as ue } from "./index-1gSpk2TV.js";
import { T as Trophy, a as CircleX, C as ChevronRight } from "./trophy-CEN2CDc2.js";
import { C as CircleCheck } from "./circle-check-CvYA9p_X.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
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
  const queryClient = useQueryClient();
  const [attempt, setAttempt] = reactExports.useState(null);
  const [questions, setQuestions] = reactExports.useState([]);
  const [currentIdx, setCurrentIdx] = reactExports.useState(0);
  const [answers, setAnswers] = reactExports.useState([]);
  const [quizResult, setQuizResult] = reactExports.useState(null);
  const [correctAnswers, setCorrectAnswers] = reactExports.useState([]);
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
      queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
    },
    onError: () => ue.error("Failed to submit quiz")
  });
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
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      submitMutation.mutate(answers);
    }
  };
  if (quizResult) {
    const pct = Math.round(
      Number(quizResult.score) / Math.max(1, Number(quizResult.totalQuestions)) * 100
    );
    const isGood = pct >= 70;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", "data-ocid": "student.quiz.result.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isGood ? "bg-primary/10" : "bg-muted"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Trophy,
              {
                className: `h-10 w-10 ${isGood ? "text-primary" : "text-muted-foreground"}`
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-1", children: "Quiz Complete!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Here's how you did" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex flex-col items-center bg-card border border-border rounded-xl px-10 py-6 mb-8 card-elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: `text-6xl font-display font-bold mb-1 ${isGood ? "text-primary" : "text-muted-foreground"}`,
              children: [
                pct,
                "%"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
            quizResult.score.toString(),
            " out of",
            " ",
            quizResult.totalQuestions.toString(),
            " correct"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "mt-4 w-48" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-3 mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "gap-2",
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground mb-4", children: "Question Review" }),
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
                className: `border-l-4 ${isCorrect ? "border-l-primary" : "border-l-destructive"}`,
                "data-ocid": `student.quiz.result.review.item.${qi + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-destructive shrink-0 mt-0.5" }),
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
                        className: `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${wasChosen && isCorrect ? "bg-primary/10 border border-primary/30 text-primary" : wasChosen && !isCorrect ? "bg-destructive/10 border border-destructive/30 text-destructive" : isTheCorrect ? "bg-primary/10 border border-primary/30 text-primary" : "text-muted-foreground"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 w-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0", children: String.fromCharCode(65 + oi) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: opt }),
                          wasChosen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              variant: isCorrect ? "default" : "destructive",
                              className: "text-xs",
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto", "data-ocid": "student.quiz.active.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "Question ",
            currentIdx + 1,
            " of ",
            questions.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
            Math.round(progress),
            "% done"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "zone-section", "data-ocid": "student.quiz.question.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg leading-relaxed", children: q.text }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: q.options.map((opt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: `w-full text-left px-4 py-3 rounded-lg border text-sm transition-smooth ${selectedAnswer === idx ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-card hover:bg-muted text-foreground"}`,
            onClick: () => handleSelectAnswer(idx),
            "data-ocid": `student.quiz.option.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 w-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0", children: String.fromCharCode(65 + idx) }),
              opt
            ] })
          },
          `opt-${currentIdx}-${idx}-${opt}`
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "ghost",
            className: "gap-2",
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
            className: "gap-2",
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-8 w-8 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Ready to start?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-2", children: [
          (questionsData == null ? void 0 : questionsData.length) ?? 0,
          " questions in this subject quiz."
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "lg",
              className: "gap-2",
              onClick: handleStart,
              disabled: startMutation.isPending,
              "data-ocid": "student.quiz.start_button",
              children: "Start Quiz"
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
