// route: /student/certificate/$subjectId
import { createActor } from "@/backend";
import type { Certificate } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { StudentLayout } from "@/layouts/StudentLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Award,
  Download,
  Printer,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useRef } from "react";

export default function CertificatePage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { subjectId } = useParams({ strict: false }) as { subjectId?: string };
  const { actor, isFetching } = useActor(createActor);
  const printRef = useRef<HTMLDivElement>(null);
  const confettiFiredRef = useRef(false);

  const { data: cert, isLoading } = useQuery<Certificate | null>({
    queryKey: ["subjectCertificate", subjectId],
    queryFn: async () => {
      if (!actor || !subjectId) return null;
      return actor.getSubjectCertificate(BigInt(subjectId));
    },
    enabled: !!actor && !isFetching && !!subjectId,
  });

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "admin") navigate({ to: "/admin/subjects" });
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    if (!cert || confettiFiredRef.current) return;
    confettiFiredRef.current = true;
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    const t1 = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.4 },
        angle: 60,
      });
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.4 },
        angle: 120,
      });
    }, 600);
    return () => clearTimeout(t1);
  }, [cert]);

  if (role === "loading" || isLoading) return <LoadingSpinner fullScreen />;

  const handlePrint = () => window.print();
  const handleDownloadPDF = () => {
    // Use print dialog — user can choose "Save as PDF" from the print destination
    window.print();
  };

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
    <StudentLayout>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .certificate-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
          @page { margin: 0.5cm; size: A4 landscape; }
        }
      `}</style>

      <div
        className="certificate-page max-w-3xl mx-auto px-4 py-8"
        data-ocid="certificate.page"
      >
        {/* Toolbar */}
        <div
          className="no-print flex items-center justify-between mb-8"
          data-ocid="certificate.toolbar"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate({ to: "/student/history" })}
            data-ocid="certificate.back_button"
          >
            <ArrowLeft className="h-4 w-4" /> Back to History
          </Button>
          {cert && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 hover:-translate-y-0.5 transition-transform"
                onClick={handlePrint}
                data-ocid="certificate.print_button"
              >
                <Printer className="h-4 w-4" /> Print
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-2 bg-gradient-to-r from-[oklch(0.75_0.15_60)] to-[oklch(0.82_0.15_85)] hover:from-[oklch(0.68_0.15_60)] hover:to-[oklch(0.75_0.15_85)] text-white border-0 shadow-md shadow-[oklch(0.75_0.15_60)/30] hover:-translate-y-0.5 transition-transform"
                onClick={handleDownloadPDF}
                data-ocid="certificate.download_button"
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
          )}
        </div>

        {!cert ? (
          <div
            className="text-center py-20"
            data-ocid="certificate.not_found_state"
          >
            <Award className="h-16 w-16 mx-auto mb-4 text-amber-400/40" />
            <p className="font-display font-bold text-xl mb-2">
              Certificate Not Found
            </p>
            <p className="text-sm text-muted-foreground">
              Complete all questions in a subject to earn your certificate.
            </p>
          </div>
        ) : (
          <div ref={printRef} className="relative" data-ocid="certificate.card">
            {/* Outer glow wrapper */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-yellow-400/20 to-amber-500/20 rounded-3xl blur-2xl" />
            {/* Multi-layer border */}
            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-2xl shadow-amber-500/30">
              <div className="rounded-2xl p-1 bg-gradient-to-br from-yellow-200 via-amber-200 to-yellow-300">
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/50 dark:via-yellow-950/40 dark:to-orange-950/30 p-10 relative overflow-hidden">
                  {/* Background decorative pattern */}
                  <div className="absolute inset-0 opacity-5">
                    {([120, 240, 360, 480, 600, 720] as const).map((size) => (
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

                  {/* Certify text */}
                  <div className="text-center mb-6">
                    <p className="text-muted-foreground text-sm mb-3 uppercase tracking-widest text-xs">
                      This is to certify that
                    </p>
                    <p className="font-display text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent leading-tight mb-2">
                      {cert.studentName}
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

                  {/* Decorative divider */}
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
        )}
      </div>
    </StudentLayout>
  );
}
