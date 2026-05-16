import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, B as Button } from "./index-DcBYUGDn.js";
import { u as useAuth, G as GraduationCap, B as BookOpen } from "./useAuth-D7cwyGZ8.js";
import { u as useRole } from "./useRole-GQ_g6Jyl.js";
import { S as Sparkles } from "./sparkles-CZYp6_D3.js";
import { S as Star } from "./star-CFlnbrwp.js";
import { Z as Zap } from "./zap-B3nl5IIs.js";
import { C as CircleCheck } from "./circle-check-D7WwVWzq.js";
import "./backend-DEykqYLI.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", key: "1nerag" }],
  ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88", key: "o46ks0" }],
  ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02", key: "ptglia" }],
  ["path", { d: "M2 12a10 10 0 0 1 18-6", key: "ydlgp0" }],
  ["path", { d: "M2 16h.01", key: "1gqxmh" }],
  ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6", key: "drycrb" }],
  ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", key: "1tidbn" }],
  ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2", key: "13wd9y" }],
  ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2", key: "1fr1j5" }]
];
const Fingerprint = createLucideIcon("fingerprint", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
const ADMIN_FEATURES = [
  "Manage subjects & topics",
  "Create multiple-choice questions",
  "View student results & scores",
  "Set quiz timers per subject"
];
const STUDENT_FEATURES = [
  "Take quizzes by subject",
  "Compete on the leaderboard",
  "Earn completion certificates",
  "Ask the AI doubt assistant"
];
function LoginPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, login } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (isAuthenticated && role === "admin") {
      navigate({ to: "/admin/subjects" });
    } else if (isAuthenticated && role === "student") {
      navigate({ to: "/student/quizzes" });
    }
  }, [isAuthenticated, role, navigate]);
  if (isInitializing || isAuthenticated && role === "loading") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true, label: "Initializing…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col relative overflow-hidden",
      style: {
        background: "linear-gradient(135deg, oklch(0.13 0.04 265) 0%, oklch(0.16 0.07 280) 30%, oklch(0.18 0.09 300) 60%, oklch(0.14 0.05 240) 100%)"
      },
      "data-ocid": "login.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-20 animate-float",
            style: {
              background: "radial-gradient(circle, oklch(0.65 0.28 270) 0%, transparent 70%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-15",
            style: {
              background: "radial-gradient(circle, oklch(0.62 0.22 200) 0%, transparent 70%)",
              animationDelay: "1.5s"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full opacity-10 animate-spin-slow",
            style: {
              background: "conic-gradient(from 0deg, oklch(0.68 0.26 310), oklch(0.55 0.28 270), oklch(0.68 0.26 310))"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "relative z-10 px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-white tracking-tight", children: "EduQuiz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-pill bg-white/10 text-white/70 ml-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
            "Manager"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex items-center justify-center px-4 py-12 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-3xl space-y-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-5 animate-fade-in-up", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 badge-pill bg-white/10 text-white/80 border border-white/20 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 text-yellow-300" }),
              "Student Management System",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 text-yellow-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight", children: [
              "Learn smarter,",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text-vivid", children: "test better." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-lg max-w-md mx-auto leading-relaxed", children: "Manage subjects, create quizzes, earn certificates and track student progress — all in one beautiful platform." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "grid md:grid-cols-2 gap-5",
              style: { animationDelay: "100ms" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-6 card-elevated hover:scale-[1.02] transition-smooth group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-12 w-12 rounded-xl flex items-center justify-center shadow-glow shrink-0",
                        style: {
                          background: "linear-gradient(135deg, oklch(0.55 0.25 270) 0%, oklch(0.48 0.28 295) 100%)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-white" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-white text-base", children: "Admin Access" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-xs", children: "Manage & oversee" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-yellow-300/70 ml-auto group-hover:text-yellow-300 transition-colors" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: ADMIN_FEATURES.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex items-center gap-2 text-sm text-white/65",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary shrink-0" }),
                        item
                      ]
                    },
                    item
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "glass-card rounded-2xl p-6 card-elevated hover:scale-[1.02] transition-smooth group",
                    style: { animationDelay: "80ms" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                            style: {
                              background: "linear-gradient(135deg, oklch(0.58 0.22 200) 0%, oklch(0.50 0.24 220) 100%)",
                              boxShadow: "0 0 16px 2px oklch(0.55 0.22 200 / 0.30)"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-white" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-white text-base", children: "Student Access" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-xs", children: "Learn & compete" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-cyan-300/70 ml-auto group-hover:text-cyan-300 transition-colors" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: STUDENT_FEATURES.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "li",
                        {
                          className: "flex items-center gap-2 text-sm text-white/65",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-cyan-400 shrink-0" }),
                            item
                          ]
                        },
                        item
                      )) })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-3 animate-fade-in-up",
              style: { animationDelay: "200ms" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "lg",
                    className: "gap-2.5 px-10 font-display font-bold text-base h-14 rounded-2xl gradient-primary text-white border-0 shadow-glow animate-pulse-glow hover:opacity-90 transition-smooth",
                    onClick: login,
                    disabled: isInitializing || isLoggingIn,
                    "data-ocid": "login.sign_in_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Fingerprint, { className: "h-5 w-5" }),
                      isLoggingIn ? "Connecting…" : "Sign in with Internet Identity"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-white/35", children: "The first user to sign in automatically becomes admin." })
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  LoginPage as default
};
