import { c as createLucideIcon, i as useRouterState, z, j as jsxRuntimeExports, B as Button, f as Link } from "./index-DcBYUGDn.js";
import { B as Badge, S as Sun, M as Moon, T as Trophy, L as LogOut } from "./index-CTHcLgyq.js";
import { u as useAuth, G as GraduationCap, B as BookOpen } from "./useAuth-D7cwyGZ8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleHelp = createLucideIcon("circle-help", __iconNode);
const NAV_ITEMS = [
  { label: "Subjects", path: "/admin/subjects", icon: BookOpen },
  { label: "Questions", path: "/admin/questions", icon: CircleHelp },
  { label: "Results", path: "/admin/results", icon: ChartColumn },
  { label: "Leaderboard", path: "/leaderboard", icon: Trophy }
];
function AdminLayout({ children }) {
  const { logout } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, setTheme } = z();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 gradient-sidebar-admin flex flex-col shrink-0 shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-5 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-white truncate tracking-tight", children: "EduQuiz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "text-xs px-2 py-0.5 h-5 mt-0.5 bg-white/15 text-white/90 border-0 hover:bg-white/15",
              children: "Admin"
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
            "data-ocid": "admin.theme_toggle",
            children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "nav",
        {
          className: "flex-1 px-3 py-5 space-y-1",
          "aria-label": "Admin navigation",
          children: NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = currentPath.startsWith(item.path);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: item.path,
                style: { animationDelay: `${i * 60}ms` },
                className: `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold animate-fade-in-up nav-item-hover ${isActive ? "nav-item-active" : "text-white/65 hover:text-white"}`,
                "data-ocid": `admin.nav.${item.label.toLowerCase()}_link`,
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
          "data-ocid": "admin.logout_button",
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
  AdminLayout as A,
  CircleHelp as C,
  ChartColumn as a
};
