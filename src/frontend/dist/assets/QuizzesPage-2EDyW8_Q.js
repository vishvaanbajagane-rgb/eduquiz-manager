import { c as createLucideIcon, u as useNavigate, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, f as Link, B as Button } from "./index-wtDjB40g.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DmO1ws7H.js";
import { T as Trophy, B as Badge } from "./index-NdfUvQ1L.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-CuWDerKJ.js";
import { u as useAuth, B as BookOpen } from "./useAuth-DFpGwHTT.js";
import { u as useRole } from "./useRole-tymDn5Pd.js";
import { S as StudentLayout } from "./StudentLayout-KWG3bcmk.js";
import { u as useMutation, a as ue } from "./index-B5fDjp4I.js";
import { S as Star } from "./star-Db7jX7_P.js";
import { F as Flame } from "./flame-DS5sDFm7.js";
import { Z as Zap } from "./zap-UVO5BJ87.js";
import { S as Sparkles } from "./sparkles-C-RE_Svn.js";
import { C as CircleCheck } from "./circle-check-CMWg7sBD.js";
import { C as CirclePlay } from "./circle-play-B2ORHby1.js";
import "./dialog-CMA1u_p3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M18 20a6 6 0 0 0-12 0", key: "1qehca" }],
  ["circle", { cx: "12", cy: "10", r: "4", key: "1h16sb" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const CircleUserRound = createLucideIcon("circle-user-round", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2", key: "1fvzgz" }],
  ["path", { d: "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2", key: "1kc0my" }],
  ["path", { d: "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8", key: "10h0bg" }],
  [
    "path",
    {
      d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
      key: "1s1gnw"
    }
  ]
];
const Hand = createLucideIcon("hand", __iconNode$1);
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
function isPrincipalId(s) {
  if (!s) return false;
  if (/^[a-z0-9]{5}(-[a-z0-9]{5}){3}-[a-z0-9]{3}$/.test(s)) return true;
  if (/^[a-z2-7]{5,}(-[a-z2-7]{5,}){4,}$/.test(s)) return true;
  if (s.length > 20 && (s.match(/-/g) ?? []).length >= 4 && /^[a-z0-9-]+$/.test(s))
    return true;
  return false;
}
function sanitizeName(raw) {
  const s = (raw == null ? void 0 : raw.trim()) ?? "";
  return isPrincipalId(s) ? "" : s;
}
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
  var _a;
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: profileRaw } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getMyProfile();
      if (Array.isArray(result)) return result[0] ?? null;
      return result;
    },
    enabled: !!actor && !isFetching
  });
  const profile = profileRaw ?? null;
  const rawName = sanitizeName(profile == null ? void 0 : profile.displayName);
  const displayName = rawName.length > 0 ? rawName : null;
  const PHOTO_LS_KEY_PREFIX = "student-photo-";
  const [profilePhoto, setProfilePhoto] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (profile == null ? void 0 : profile.principal) {
      const key = `${PHOTO_LS_KEY_PREFIX}${profile.principal.toString()}`;
      setProfilePhoto(localStorage.getItem(key) ?? "");
    }
  }, [profile == null ? void 0 : profile.principal]);
  const profileFields = [
    {
      key: "Name",
      filled: sanitizeName(profile == null ? void 0 : profile.displayName).length > 0
    },
    {
      key: "Department",
      filled: !!((profile == null ? void 0 : profile.department) && profile.department.trim().length > 0)
    },
    {
      key: "Register No.",
      filled: !!((profile == null ? void 0 : profile.registerNumber) && profile.registerNumber.trim().length > 0)
    },
    {
      key: "Enroll No.",
      filled: !!((profile == null ? void 0 : profile.enrollNumber) && profile.enrollNumber.trim().length > 0)
    },
    {
      key: "Section",
      filled: !!((profile == null ? void 0 : profile.section) && profile.section.trim().length > 0)
    }
  ];
  const filledCount = profileFields.filter((f) => f.filled).length;
  const profilePct = Math.round(filledCount / profileFields.length * 100);
  const missingFields = profileFields.filter((f) => !f.filled);
  const profileComplete = profilePct === 100;
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
  const streak = reactExports.useMemo(() => {
    const completed = (attempts ?? []).filter(
      (a) => a.completed && a.completedAt && Number(a.completedAt) > 0
    );
    if (completed.length === 0) return 0;
    const days = new Set(
      completed.map((a) => {
        const ms = Number(a.completedAt) / 1e6;
        return new Date(ms).toISOString().slice(0, 10);
      })
    );
    const sorted = Array.from(days).sort().reverse();
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;
    let count = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(new Date(sorted[i - 1]).getTime() - 864e5).toISOString().slice(0, 10);
      if (sorted[i] === prev) count++;
      else break;
    }
    return count;
  }, [attempts]);
  const totalCompleted = reactExports.useMemo(
    () => (attempts ?? []).filter((a) => a.completed).length,
    [attempts]
  );
  const topScore = reactExports.useMemo(() => {
    const completed = (attempts ?? []).filter(
      (a) => a.completed && Number(a.totalQuestions) > 0
    );
    if (completed.length === 0) return null;
    return Math.max(
      ...completed.map(
        (a) => Math.round(
          Number(a.score) / Math.max(1, Number(a.totalQuestions)) * 100
        )
      )
    );
  }, [attempts]);
  const bestScoreBySubject = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const a of (attempts ?? []).filter(
      (a2) => a2.completed && Number(a2.totalQuestions) > 0
    )) {
      const key = a.subjectId.toString();
      const pct = Math.round(
        Number(a.score) / Math.max(1, Number(a.totalQuestions)) * 100
      );
      const prev = map.get(key);
      if (prev === void 0 || pct > prev) map.set(key, pct);
    }
    return map;
  }, [attempts]);
  const department = ((_a = profile == null ? void 0 : profile.department) == null ? void 0 : _a.trim()) ?? "";
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mb-6 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-px shadow-lg shadow-violet-500/20",
        "data-ocid": "student.quizzes.welcome_banner",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[calc(1rem-1px)] bg-gradient-to-r from-violet-50/90 via-purple-50/90 to-indigo-50/90 dark:from-violet-950/60 dark:via-purple-950/60 dark:to-indigo-950/60 px-6 py-4 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: profilePhoto ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: profilePhoto,
              alt: displayName ?? "Student",
              className: "h-14 w-14 rounded-full object-cover ring-2 ring-violet-400/60 shadow-md shadow-violet-500/25"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ring-2 ring-violet-400/60 shadow-md shadow-violet-500/25", children: displayName ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-white leading-none", children: displayName.charAt(0).toUpperCase() }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUserRound, { className: "h-7 w-7 text-white/90" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hand, { className: "h-5 w-5 text-white [animation:wave_1.8s_ease-in-out_1]" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight", children: displayName ? `Welcome ${displayName}!! 🎉` : "Welcome!! 🎉" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5 font-medium", children: "Ready to test your knowledge today?" }),
            topScore !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400/20 to-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 shadow-sm",
                "data-ocid": "student.quizzes.top_score_badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-amber-400 text-amber-400" }),
                  "Top Score: ",
                  topScore,
                  "%"
                ]
              }
            ) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `mb-6 grid gap-3 ${department ? "grid-cols-3" : "grid-cols-2"}`,
        "data-ocid": "student.quizzes.stats_row",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-orange-200 dark:border-orange-800/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 px-4 py-3 flex items-center gap-3 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md shadow-orange-400/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4.5 w-4.5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide leading-none", children: "Streak" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl font-extrabold text-orange-600 dark:text-orange-400 leading-tight", children: [
                streak,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold ml-1 text-orange-500 dark:text-orange-400", children: streak === 1 ? "day" : "days" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 px-4 py-3 flex items-center gap-3 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-4.5 w-4.5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide leading-none", children: "Completed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-tight", children: [
                totalCompleted,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold ml-1 text-emerald-500 dark:text-emerald-400", children: totalCompleted === 1 ? "quiz" : "quizzes" })
              ] })
            ] })
          ] }),
          department && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 px-4 py-3 flex items-center gap-3 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4.5 w-4.5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide leading-none", children: "Dept" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-extrabold text-indigo-600 dark:text-indigo-400 leading-tight truncate", children: department })
            ] })
          ] })
        ]
      }
    ),
    profile !== null && profile !== void 0 && !profileComplete && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mb-6 rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/25 dark:to-orange-950/25 p-5 shadow-sm",
        "data-ocid": "student.quizzes.profile_completion_banner",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-400/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUserRound, { className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-amber-900 dark:text-amber-100 text-sm", children: "Complete your profile! 🌟" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700 dark:text-amber-300 mt-0.5", children: profilePct === 0 ? "Add your details to personalise your experience." : `Almost there — just ${missingFields.length} more ${missingFields.length === 1 ? "field" : "fields"} to go!` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/student/profile",
                  "data-ocid": "student.quizzes.complete_profile_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      className: "shrink-0 font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 shadow-md shadow-amber-400/20 hover:-translate-y-0.5 transition-all duration-200",
                      children: "Update Profile"
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-amber-800 dark:text-amber-200", children: [
                  "Profile ",
                  profilePct,
                  "% complete"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-amber-700 dark:text-amber-400", children: [
                  filledCount,
                  "/",
                  profileFields.length,
                  " fields"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full rounded-full bg-amber-200 dark:bg-amber-900/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out",
                  style: { width: `${profilePct}%` }
                }
              ) })
            ] }),
            missingFields.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-700 dark:text-amber-400 font-medium mr-1", children: "Missing:" }),
              missingFields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50",
                  children: f.key
                },
                f.key
              ))
            ] })
          ] })
        ] })
      }
    ),
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
                    ] }),
                    (() => {
                      const best = bestScoreBySubject.get(
                        subject.id.toString()
                      );
                      if (best === void 0) return null;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[oklch(0.93_0.08_145)] text-[oklch(0.42_0.14_145)] dark:bg-[oklch(0.28_0.08_145)] dark:text-[oklch(0.78_0.12_145)] border border-[oklch(0.78_0.1_145)] dark:border-[oklch(0.4_0.1_145)]",
                          "data-ocid": `student.quizzes.best_score_badge.${i + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 fill-current" }),
                            "Best: ",
                            best,
                            "%"
                          ]
                        }
                      );
                    })()
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
