import { c as createLucideIcon, i as useRouterState, z, r as reactExports, j as jsxRuntimeExports, B as Button, f as Link } from "./index-DcBYUGDn.js";
import { B as Badge, S as Sun, M as Moon, T as Trophy, L as LogOut } from "./index-CTHcLgyq.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogDescription, d as DialogFooter } from "./dialog-ONTbtxFW.js";
import { u as useAuth, G as GraduationCap, B as BookOpen } from "./useAuth-D7cwyGZ8.js";
import { S as Sparkles } from "./sparkles-CZYp6_D3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const NAV_ITEMS = [
  { label: "My Quizzes", path: "/student/quizzes", icon: BookOpen },
  { label: "My Profile", path: "/student/profile", icon: User },
  { label: "Quiz History", path: "/student/history", icon: ClipboardList },
  { label: "Leaderboard", path: "/leaderboard", icon: Trophy }
];
function StudentLayout({ children }) {
  const { logout, principal } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, setTheme } = z();
  const [showWelcome, setShowWelcome] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!principal) return;
    const key = `eduquiz_profile_nudge_shown_${principal.toString()}`;
    if (!localStorage.getItem(key)) {
      setShowWelcome(true);
    }
  }, [principal]);
  const dismissWelcome = () => {
    if (principal) {
      localStorage.setItem(
        `eduquiz_profile_nudge_shown_${principal.toString()}`,
        "1"
      );
    }
    setShowWelcome(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: showWelcome,
        onOpenChange: (open) => {
          if (!open) dismissWelcome();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "student.welcome_dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl flex items-center gap-2", children: "🎉 Welcome to EduQuiz!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-muted-foreground mt-1", children: "Complete your profile to personalize your certificates and results. Adding your name only takes a second!" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "w-full sm:w-auto",
                onClick: dismissWelcome,
                "data-ocid": "student.welcome_dialog.cancel_button",
                children: "Maybe later"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/student/profile",
                className: "inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-sm transition-all hover:-translate-y-px w-full sm:w-auto",
                onClick: dismissWelcome,
                "data-ocid": "student.welcome_dialog.profile_link",
                children: "Set up my profile →"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 gradient-sidebar-student flex flex-col shrink-0 shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-5 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-10 w-10 rounded-xl flex items-center justify-center shadow-glow shrink-0",
              style: {
                background: "linear-gradient(135deg, oklch(0.55 0.22 200) 0%, oklch(0.48 0.24 220) 100%)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-6 w-6 text-white" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-white truncate tracking-tight", children: "EduQuiz" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-xs px-2 py-0.5 h-5 mt-0.5 bg-cyan-400/20 text-cyan-200 border-0 hover:bg-cyan-400/20",
                children: "Student"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 shrink-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg",
              onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
              "aria-label": "Toggle theme",
              "data-ocid": "student.theme_toggle",
              children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-cyan-300/80" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 italic", children: "Every quiz makes you smarter!" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "nav",
        {
          className: "flex-1 px-3 py-5 space-y-1",
          "aria-label": "Student navigation",
          children: NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = currentPath.startsWith(item.path);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: item.path,
                style: { animationDelay: `${i * 60}ms` },
                className: `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold animate-fade-in-up nav-item-hover ${isActive ? "nav-item-active" : "text-white/65 hover:text-white"}`,
                "data-ocid": `student.nav.${item.label.toLowerCase().replace(" ", "_")}_link`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0" }),
                  item.label
                ]
              },
              item.path
            );
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 h-px bg-white/10 mb-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          className: "w-full justify-start gap-3 text-white/55 hover:text-red-300 hover:bg-red-500/15 text-sm font-medium rounded-xl",
          onClick: logout,
          "data-ocid": "student.logout_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
            "Sign out"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 zone-content", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-muted/40 border-t border-border px-6 py-3 text-xs text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        ". Built with love using",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "underline hover:text-foreground transition-colors",
            children: "caffeine.ai"
          }
        )
      ] })
    ] })
  ] });
}
export {
  ClipboardList as C,
  StudentLayout as S,
  User as U
};
