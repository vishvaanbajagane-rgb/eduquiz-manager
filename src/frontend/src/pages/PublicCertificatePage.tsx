// route: /certificate/:token  — public, no auth required
import type { Certificate } from "@/backend";
import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Award, Sparkles, Star } from "lucide-react";

export default function PublicCertificatePage() {
  const { token } = useParams({ strict: false }) as { token?: string };
  const { actor, isFetching } = useActor(createActor);

  const { data: cert, isLoading } = useQuery<Certificate | null>({
    queryKey: ["publicCertificate", token],
    queryFn: async () => {
      if (!actor || !token) return null;
      return actor.getCertificateByToken(token);
    },
    enabled: !!actor && !isFetching && !!token,
    staleTime: 1000 * 60 * 5,
  });

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const scorePct = cert
    ? Math.round(
        (Number(cert.score) / Math.max(1, Number(cert.totalQuestions))) * 100,
      )
    : 0;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/20 flex flex-col items-center justify-center px-4 py-12"
      data-ocid="public_certificate.page"
    >
      {/* Branding header */}
      <div className="mb-8 text-center" data-ocid="public_certificate.header">
        <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-card/70 backdrop-blur-sm px-5 py-2 rounded-full border border-amber-200 dark:border-amber-700/50 shadow-sm">
          <Award className="h-5 w-5 text-amber-500" />
          <span className="font-display font-bold text-foreground text-sm tracking-wide">
            EduQuiz Manager
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Verified Certificate of Achievement
        </p>
      </div>

      {/* Loading state */}
      {(isLoading || isFetching) && (
        <div
          className="w-full max-w-2xl space-y-4"
          data-ocid="public_certificate.loading_state"
        >
          <Skeleton className="h-8 w-2/3 mx-auto" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      )}

      {/* Not found */}
      {!isLoading && !isFetching && !cert && (
        <div
          className="text-center py-20 max-w-md"
          data-ocid="public_certificate.not_found_state"
        >
          <div className="h-20 w-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
            <Award className="h-10 w-10 text-amber-400/60" />
          </div>
          <h1 className="font-display text-2xl font-black text-foreground mb-3">
            Certificate Not Found
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            This certificate link is invalid or has expired. Please ask the
            student to share a new link.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              window.location.href = "/";
            }}
            data-ocid="public_certificate.home_button"
          >
            Go to EduQuiz
          </Button>
        </div>
      )}

      {/* Certificate card */}
      {!isLoading && cert && (
        <div className="w-full max-w-2xl" data-ocid="public_certificate.card">
          {/* Outer glow wrapper */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-yellow-400/20 to-amber-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-2xl shadow-amber-500/30">
              <div className="rounded-2xl p-1 bg-gradient-to-br from-yellow-200 via-amber-200 to-yellow-300">
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/50 dark:via-yellow-950/40 dark:to-orange-950/30 p-10 relative overflow-hidden">
                  {/* Background decorative circles */}
                  <div className="absolute inset-0 opacity-5">
                    {([120, 240, 360, 480, 600] as const).map((size) => (
                      <div
                        key={size}
                        className="absolute rounded-full border-4 border-amber-600"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Top decoration */}
                  <div className="flex justify-center items-center gap-2 mb-6">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                    <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
                    <Star className="h-6 w-6 text-amber-600 fill-amber-500" />
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
                      <Award className="h-7 w-7 text-white" />
                    </div>
                    <Star className="h-6 w-6 text-amber-600 fill-amber-500" />
                    <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
                    <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                  </div>

                  {/* Title */}
                  <div className="text-center mb-8">
                    <p className="text-xs font-mono tracking-[0.35em] uppercase text-amber-700 dark:text-amber-400 mb-2">
                      Certificate of Achievement
                    </p>
                    <h1 className="font-display text-4xl font-black bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-1 tracking-tight">
                      Congratulations!
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-amber-400" />
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-amber-400" />
                    </div>
                  </div>

                  {/* Student section */}
                  <div className="text-center mb-6">
                    <p className="text-muted-foreground text-xs uppercase tracking-widest mb-3">
                      This is to certify that
                    </p>

                    {/* Avatar placeholder */}
                    <div
                      className="flex justify-center mb-4"
                      data-ocid="public_certificate.student_avatar"
                    >
                      <div className="h-24 w-24 rounded-full border-4 border-amber-400 shadow-xl shadow-amber-500/30 ring-4 ring-amber-200 dark:ring-amber-700 bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-display font-black text-3xl select-none">
                          {cert.studentName?.trim()
                            ? cert.studentName.trim().charAt(0).toUpperCase()
                            : "S"}
                        </span>
                      </div>
                    </div>

                    <p
                      className="font-display text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent leading-tight mb-2"
                      data-ocid="public_certificate.student_name"
                    >
                      {cert.studentName?.trim() || "Student"}
                    </p>
                    <p className="text-muted-foreground text-sm mt-3">
                      has successfully completed the subject
                    </p>
                  </div>

                  {/* Subject */}
                  <div className="text-center mb-8">
                    <div className="inline-block px-8 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl border-2 border-amber-300 dark:border-amber-700 shadow">
                      <p className="font-display text-3xl font-black text-foreground">
                        {cert.subjectName}
                      </p>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[oklch(0.6_0.15_145)] to-[oklch(0.55_0.15_175)] text-white px-6 py-2 rounded-full shadow-md shadow-[oklch(0.6_0.15_145)/30]">
                      <Award className="h-4 w-4" />
                      <span className="font-bold text-sm">
                        Score: {cert.score.toString()}/
                        {cert.totalQuestions.toString()} &mdash; {scorePct}%
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-full bg-amber-500 opacity-60"
                        />
                      ))}
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-400 to-transparent" />
                  </div>

                  {/* Footer */}
                  <div className="flex items-end justify-between">
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                        Date Awarded
                      </p>
                      <p className="font-bold text-sm text-foreground">
                        {formatDate(cert.completedAt)}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/40 border-4 border-amber-200">
                        <Award className="h-7 w-7 text-white" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 font-semibold">
                        EduQuiz Platform
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                        Certificate ID
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        #{cert.id.toString().padStart(6, "0")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            This certificate was issued by{" "}
            <span className="font-semibold text-foreground">
              EduQuiz Manager
            </span>
            . View the original at{" "}
            <a
              href="/"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              eduquiz-manager
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
