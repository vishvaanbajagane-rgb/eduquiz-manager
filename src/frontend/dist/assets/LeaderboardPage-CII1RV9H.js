import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, u as useNavigate, r as reactExports } from "./index-Hh1gENll.js";
import { u as useAuth, a as useActor, b as useQuery, c as createActor } from "./backend-Bub9mio5.js";
import { u as useRole } from "./useRole-DOnT3i7R.js";
import { A as AdminLayout } from "./AdminLayout-DuNcujI_.js";
import { S as StudentLayout } from "./StudentLayout-CFKi020B.js";
import { T as Trophy } from "./badge-EMKhFOLg.js";
import { U as Users } from "./users-BrsFg6AR.js";
import { M as Medal } from "./medal-D43nNpm1.js";
import "./sparkles-Bf1D91Qa.js";
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
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode);
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
const RANK_COLOR = {
  1: "oklch(0.85 0.18 90)",
  2: "oklch(0.78 0.04 250)",
  3: "oklch(0.72 0.14 55)"
};
const TOP3_STYLES = {
  1: {
    row: "border-[oklch(0.85_0.18_90/0.4)] bg-gradient-to-r from-[oklch(0.78_0.18_85/0.15)] via-[oklch(0.82_0.15_88/0.08)] to-transparent",
    bar: "from-[oklch(0.85_0.18_90)] to-[oklch(0.78_0.18_85)]",
    avatar: "from-[oklch(0.85_0.18_90)] to-[oklch(0.78_0.18_85)]",
    glow: "0 0 20px 4px oklch(0.78 0.18 85 / 0.25)"
  },
  2: {
    row: "border-[oklch(0.72_0.04_250/0.4)] bg-gradient-to-r from-[oklch(0.72_0.04_250/0.12)] via-[oklch(0.78_0.04_250/0.06)] to-transparent",
    bar: "from-[oklch(0.72_0.04_250)] to-[oklch(0.78_0.04_250)]",
    avatar: "from-[oklch(0.72_0.04_250)] to-[oklch(0.78_0.04_250)]",
    glow: "0 0 14px 2px oklch(0.72 0.04 250 / 0.2)"
  },
  3: {
    row: "border-[oklch(0.68_0.14_55/0.4)] bg-gradient-to-r from-[oklch(0.68_0.14_55/0.15)] via-[oklch(0.72_0.12_48/0.08)] to-transparent",
    bar: "from-[oklch(0.68_0.14_55)] to-[oklch(0.72_0.12_48)]",
    avatar: "from-[oklch(0.68_0.14_55)] to-[oklch(0.72_0.12_48)]",
    glow: "0 0 14px 2px oklch(0.72 0.14 55 / 0.25)"
  }
};
function RankBadge({ rank }) {
  if (rank === 1) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Crown,
      {
        className: "h-7 w-7 drop-shadow-md",
        style: { color: "oklch(0.85 0.18 90)" },
        "aria-label": "1st place"
      }
    ) });
  }
  if (rank === 2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Medal,
      {
        className: "h-6 w-6 drop-shadow-sm",
        style: { color: "oklch(0.78 0.04 250)" },
        "aria-label": "2nd place"
      }
    );
  }
  if (rank === 3) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Medal,
      {
        className: "h-6 w-6 drop-shadow-sm",
        style: { color: "oklch(0.72 0.14 55)" },
        "aria-label": "3rd place"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold tabular-nums text-muted-foreground w-7 text-center inline-block", children: rank });
}
function ScoreBar({
  pct,
  rank
}) {
  const isTop3 = rank <= 3;
  const gradientClass = isTop3 ? TOP3_STYLES[rank].bar : pct >= 80 ? "from-primary to-violet-500" : pct >= 60 ? "from-secondary to-amber-400" : "from-muted-foreground/40 to-muted-foreground/20";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 bg-muted/60 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-full rounded-full transition-all duration-700 bg-gradient-to-r ${gradientClass}`,
        style: { width: `${Math.min(100, pct)}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "text-sm font-bold tabular-nums w-12 text-right shrink-0",
        style: isTop3 ? { color: RANK_COLOR[rank] } : void 0,
        children: [
          pct,
          "%"
        ]
      }
    )
  ] });
}
const SKELETON_ROWS = ["a", "b", "c", "d", "e"];
function LeaderboardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: SKELETON_ROWS.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Skeleton,
    {
      className: "h-16 w-full rounded-xl"
    },
    `skel-${id}-skeleton-row`
  )) });
}
function LeaderboardContent() {
  const { actor, isFetching } = useActor(createActor);
  const { data: entries, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
  if (isLoading || isFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardSkeleton, {});
  }
  if (!entries || entries.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-24 text-muted-foreground",
        "data-ocid": "leaderboard.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-2xl gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground", children: "No scores yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1.5 text-muted-foreground", children: "Complete a quiz to appear on the leaderboard!" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", "data-ocid": "leaderboard.list", children: entries.map((entry, idx) => {
    const rank = Number(entry.rank);
    const pct = Number(entry.averageScore);
    const isTop3 = rank <= 3;
    const s = isTop3 ? TOP3_STYLES[rank] : null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-smooth hover:scale-[1.01] ${isTop3 && s ? s.row : "bg-card border-border hover:border-primary/30 hover:shadow-md"}`,
        style: isTop3 && s ? { boxShadow: s.glow } : void 0,
        "data-ocid": `leaderboard.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 flex justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankBadge, { rank }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-10 w-10 rounded-xl flex items-center justify-center shrink-0 font-display font-extrabold text-sm text-white ${isTop3 && s ? `bg-gradient-to-br ${s.avatar}` : "bg-gradient-to-br from-primary to-violet-600"}`,
              style: isTop3 && s ? { boxShadow: s.glow } : void 0,
              children: entry.displayName.charAt(0).toUpperCase()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: entry.displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground tabular-nums", children: [
              Number(entry.totalAttempts),
              " quiz",
              Number(entry.totalAttempts) !== 1 ? "zes" : "",
              " completed"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-40 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { pct, rank }) })
        ]
      },
      `entry-${idx}-${entry.principal.toString()}`
    );
  }) });
}
function LeaderboardPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);
  const content = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", "data-ocid": "leaderboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary shadow-glow mx-auto mb-4 animate-float", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-8 w-8 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold text-foreground gradient-text", children: "Global Leaderboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1.5", children: "Top students ranked by average quiz score" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-5 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center", children: "#" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: "Student" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-40 text-right", children: "Avg. Score" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardContent, {})
  ] });
  if (role === "admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: content });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: content });
}
export {
  LeaderboardPage as default
};
