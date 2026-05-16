import { g as useParams, j as jsxRuntimeExports, B as Button } from "./index-DcBYUGDn.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DEykqYLI.js";
import { S as Skeleton } from "./skeleton-CuOGs5s6.js";
import { A as Award } from "./award-0Fjb26mX.js";
import { S as Star } from "./star-CFlnbrwp.js";
import { S as Sparkles } from "./sparkles-CZYp6_D3.js";
function PublicCertificatePage() {
  var _a, _b;
  const { token } = useParams({ strict: false });
  const { actor, isFetching } = useActor(createActor);
  const { data: cert, isLoading } = useQuery({
    queryKey: ["publicCertificate", token],
    queryFn: async () => {
      if (!actor || !token) return null;
      return actor.getCertificateByToken(token);
    },
    enabled: !!actor && !isFetching && !!token,
    staleTime: 1e3 * 60 * 5
  });
  const formatDate = (ts) => new Date(Number(ts) / 1e6).toLocaleDateString(void 0, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const scorePct = cert ? Math.round(
    Number(cert.score) / Math.max(1, Number(cert.totalQuestions)) * 100
  ) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/20 flex flex-col items-center justify-center px-4 py-12",
      "data-ocid": "public_certificate.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", "data-ocid": "public_certificate.header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-white/70 dark:bg-card/70 backdrop-blur-sm px-5 py-2 rounded-full border border-amber-200 dark:border-amber-700/50 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-amber-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground text-sm tracking-wide", children: "EduQuiz Manager" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Verified Certificate of Achievement" })
        ] }),
        (isLoading || isFetching) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-full max-w-2xl space-y-4",
            "data-ocid": "public_certificate.loading_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-2/3 mx-auto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-96 w-full rounded-3xl" })
            ]
          }
        ),
        !isLoading && !isFetching && !cert && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-20 max-w-md",
            "data-ocid": "public_certificate.not_found_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-10 w-10 text-amber-400/60" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-foreground mb-3", children: "Certificate Not Found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "This certificate link is invalid or has expired. Please ask the student to share a new link." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => {
                    window.location.href = "/";
                  },
                  "data-ocid": "public_certificate.home_button",
                  children: "Go to EduQuiz"
                }
              )
            ]
          }
        ),
        !isLoading && cert && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl", "data-ocid": "public_certificate.card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-amber-400/20 via-yellow-400/20 to-amber-500/20 rounded-3xl blur-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-3xl p-1 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-2xl shadow-amber-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl p-1 bg-gradient-to-br from-yellow-200 via-amber-200 to-yellow-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/50 dark:via-yellow-950/40 dark:to-orange-950/30 p-10 relative overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-5", children: [120, 240, 360, 480, 600].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute rounded-full border-4 border-amber-600",
                  style: {
                    width: `${size}px`,
                    height: `${size}px`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }
                },
                size
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center gap-2 mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-amber-500 fill-amber-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-amber-500 fill-amber-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-6 w-6 text-amber-600 fill-amber-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-7 w-7 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-6 w-6 text-amber-600 fill-amber-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-amber-500 fill-amber-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-amber-500 fill-amber-400" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono tracking-[0.35em] uppercase text-amber-700 dark:text-amber-400 mb-2", children: "Certificate of Achievement" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-black bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-1 tracking-tight", children: "Congratulations!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-amber-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-amber-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-amber-400" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs uppercase tracking-widest mb-3", children: "This is to certify that" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex justify-center mb-4",
                    "data-ocid": "public_certificate.student_avatar",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-full border-4 border-amber-400 shadow-xl shadow-amber-500/30 ring-4 ring-amber-200 dark:ring-amber-700 bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-display font-black text-3xl select-none", children: ((_a = cert.studentName) == null ? void 0 : _a.trim()) ? cert.studentName.trim().charAt(0).toUpperCase() : "S" }) })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent leading-tight mb-2",
                    "data-ocid": "public_certificate.student_name",
                    children: ((_b = cert.studentName) == null ? void 0 : _b.trim()) || "Student"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-3", children: "has successfully completed the subject" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block px-8 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl border-2 border-amber-300 dark:border-amber-700 shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl font-black text-foreground", children: cert.subjectName }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[oklch(0.6_0.15_145)] to-[oklch(0.55_0.15_175)] text-white px-6 py-2 rounded-full shadow-md shadow-[oklch(0.6_0.15_145)/30]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-sm", children: [
                    "Score: ",
                    cert.score.toString(),
                    "/",
                    cert.totalQuestions.toString(),
                    " — ",
                    scorePct,
                    "%"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-2 w-2 rounded-full bg-amber-500 opacity-60"
                  },
                  i
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-l from-transparent via-amber-400 to-transparent" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-1", children: "Date Awarded" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: formatDate(cert.completedAt) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/40 border-4 border-amber-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-7 w-7 text-white" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 font-semibold", children: "EduQuiz Platform" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-1", children: "Certificate ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
                    "#",
                    cert.id.toString().padStart(6, "0")
                  ] })
                ] })
              ] })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground mt-6", children: [
            "This certificate was issued by",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "EduQuiz Manager" }),
            ". View the original at",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "/",
                className: "underline underline-offset-2 hover:text-foreground transition-colors",
                children: "eduquiz-manager"
              }
            ),
            "."
          ] })
        ] })
      ]
    }
  );
}
export {
  PublicCertificatePage as default
};
