import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner, B as Button } from "./index-Hh1gENll.js";
import { u as useAuth, a as useActor, b as useQuery, c as createActor } from "./backend-Bub9mio5.js";
import { T as Trophy, B as Badge } from "./badge-EMKhFOLg.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DE0aOoMx.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CTiXg-on.js";
import { u as useRole } from "./useRole-DOnT3i7R.js";
import { S as StudentLayout, C as ClipboardList } from "./StudentLayout-CFKi020B.js";
import { A as Award } from "./award-BLMjWOeL.js";
import { S as Star } from "./star-CCOhaIKR.js";
import { M as Medal } from "./medal-D43nNpm1.js";
import { C as CirclePlay } from "./circle-play-DwKZexl-.js";
import "./sparkles-Bf1D91Qa.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "admin") navigate({ to: "/admin/subjects" });
  }, [isAuthenticated, role, navigate]);
  const { data: attempts, isLoading } = useQuery({
    queryKey: ["myAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAttempts();
    },
    enabled: !!actor && !isFetching
  });
  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching
  });
  const { data: certificates, isLoading: certsLoading } = useQuery({
    queryKey: ["myCertificates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCertificates();
    },
    enabled: !!actor && !isFetching
  });
  if (role === "loading" || isLoading || certsLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  const subjectMap = new Map(
    (subjects == null ? void 0 : subjects.map((s) => [s.id.toString(), s.name])) ?? []
  );
  const completedAttempts = ((attempts == null ? void 0 : attempts.filter((a) => a.completed)) ?? []).slice().sort((a, b) => {
    const ta = a.completedAt ? Number(a.completedAt) : 0;
    const tb = b.completedAt ? Number(b.completedAt) : 0;
    return tb - ta;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", "data-ocid": "student.history.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent", children: "My Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Certificates earned and completed quiz attempts" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", "data-ocid": "student.certificates.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 w-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-amber-500" }),
          " My Certificates"
        ] }),
        certificates && certificates.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold", children: certificates.length })
      ] }),
      !certificates || certificates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-12 rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50/60 to-yellow-50/40 dark:from-amber-950/10 dark:to-yellow-950/10",
          "data-ocid": "student.certificates.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-12 w-12 mx-auto mb-3 text-amber-400/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "No certificates yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Complete all questions in a subject to earn a certificate" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid gap-4 sm:grid-cols-2",
          "data-ocid": "student.certificates.list",
          children: certificates.map((cert, i) => {
            const pct = Math.round(
              Number(cert.score) / Math.max(1, Number(cert.totalQuestions)) * 100
            );
            const date = new Date(
              Number(cert.completedAt) / 1e6
            ).toLocaleDateString(void 0, {
              year: "numeric",
              month: "short",
              day: "numeric"
            });
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "relative overflow-hidden rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 shadow-lg shadow-amber-500/20",
                "data-ocid": `student.certificates.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-6 w-6 text-white fill-white" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground truncate", children: cert.subjectName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "h-3.5 w-3.5 text-amber-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-amber-700 dark:text-amber-400", children: [
                        cert.score.toString(),
                        "/",
                        cert.totalQuestions.toString(),
                        " — ",
                        pct,
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: date })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      className: "flex-shrink-0 gap-1 text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-sm",
                      onClick: () => navigate({
                        to: `/student/certificate/${cert.subjectId.toString()}`
                      }),
                      "data-ocid": `student.certificates.view_button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }),
                        " View"
                      ]
                    }
                  )
                ] }) })
              },
              `cert-${i}-${cert.id.toString()}`
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 w-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent", children: "Quiz Attempts" })
    ] }) }),
    completedAttempts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 rounded-2xl border-2 border-dashed border-border bg-muted/20",
        "data-ocid": "student.history.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-12 w-12 mx-auto mb-3 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-2", children: "No completed quizzes yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Go to My Quizzes to take your first quiz!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              className: "gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md hover:-translate-y-0.5 transition-transform",
              size: "sm",
              onClick: () => navigate({ to: "/student/quizzes" }),
              "data-ocid": "student.history.go_quizzes_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "h-4 w-4" }),
                " Browse Quizzes"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-0 shadow-md overflow-hidden",
        "data-ocid": "student.history.table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-4 w-4 text-violet-500" }),
            "Completed Attempts",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 font-bold", children: completedAttempts.length })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold", children: "Subject" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-bold", children: "Score" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-bold", children: "Result" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-bold", children: "Date" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: completedAttempts.map((a, i) => {
              const pct = Math.round(
                Number(a.score) / Math.max(1, Number(a.totalQuestions)) * 100
              );
              const date = a.completedAt ? new Date(
                Number(a.completedAt) / 1e6
              ).toLocaleDateString(void 0, {
                year: "numeric",
                month: "short",
                day: "numeric"
              }) : "—";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  className: `transition-colors hover:bg-primary/5 ${i % 2 === 0 ? "bg-muted/10" : ""}`,
                  "data-ocid": `student.history.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-semibold text-sm", children: subjectMap.get(a.subjectId.toString()) ?? "Unknown" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right text-sm tabular-nums font-medium", children: [
                      a.score.toString(),
                      "/",
                      a.totalQuestions.toString()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${pct >= 70 ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white" : pct >= 40 ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white" : "bg-gradient-to-r from-rose-500 to-red-500 text-white"}`,
                        children: [
                          pct,
                          "%"
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs text-muted-foreground tabular-nums", children: date })
                  ]
                },
                `${a.id.toString()}-${a.subjectId.toString()}`
              );
            }) })
          ] }) })
        ]
      }
    )
  ] }) });
}
export {
  HistoryPage as default
};
