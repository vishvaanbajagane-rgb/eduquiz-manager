import { createActor } from "@/backend";
import type { Certificate } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { StudentLayout } from "@/layouts/StudentLayout";
import type { QuizAttemptPublic, SubjectWithStats } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  ClipboardList,
  ExternalLink,
  Medal,
  PlayCircle,
  Star,
  Trophy,
} from "lucide-react";
import { useEffect } from "react";

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "admin") navigate({ to: "/admin/subjects" });
  }, [isAuthenticated, role, navigate]);

  const { data: attempts, isLoading } = useQuery<QuizAttemptPublic[]>({
    queryKey: ["myAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAttempts();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: subjects } = useQuery<SubjectWithStats[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: certificates, isLoading: certsLoading } = useQuery<
    Certificate[]
  >({
    queryKey: ["myCertificates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCertificates();
    },
    enabled: !!actor && !isFetching,
  });

  if (role === "loading" || isLoading || certsLoading)
    return <LoadingSpinner fullScreen />;

  const subjectMap = new Map(
    subjects?.map((s) => [s.id.toString(), s.name]) ?? [],
  );

  const completedAttempts = (attempts?.filter((a) => a.completed) ?? [])
    .slice()
    .sort((a, b) => {
      const ta = a.completedAt ? Number(a.completedAt) : 0;
      const tb = b.completedAt ? Number(b.completedAt) : 0;
      return tb - ta;
    });

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto" data-ocid="student.history.page">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                My Progress
              </h1>
              <p className="text-muted-foreground text-sm">
                Certificates earned and completed quiz attempts
              </p>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mb-10" data-ocid="student.certificates.section">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-0.5 w-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />
            <h2 className="font-display text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" /> My Certificates
            </h2>
            {certificates && certificates.length > 0 && (
              <Badge className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold">
                {certificates.length}
              </Badge>
            )}
          </div>

          {!certificates || certificates.length === 0 ? (
            <div
              className="text-center py-12 rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50/60 to-yellow-50/40 dark:from-amber-950/10 dark:to-yellow-950/10"
              data-ocid="student.certificates.empty_state"
            >
              <Award className="h-12 w-12 mx-auto mb-3 text-amber-400/60" />
              <p className="font-semibold text-foreground mb-1">
                No certificates yet
              </p>
              <p className="text-xs text-muted-foreground">
                Complete all questions in a subject to earn a certificate
              </p>
            </div>
          ) : (
            <div
              className="grid gap-4 sm:grid-cols-2"
              data-ocid="student.certificates.list"
            >
              {certificates.map((cert, i) => {
                const pct = Math.round(
                  (Number(cert.score) /
                    Math.max(1, Number(cert.totalQuestions))) *
                    100,
                );
                const date = new Date(
                  Number(cert.completedAt) / 1_000_000,
                ).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div
                    key={`cert-${i}-${cert.id.toString()}`}
                    className="relative overflow-hidden rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 shadow-lg shadow-amber-500/20"
                    data-ocid={`student.certificates.item.${i + 1}`}
                  >
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
                          <Star className="h-6 w-6 text-white fill-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-base text-foreground truncate">
                            {cert.subjectName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Medal className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                              {cert.score.toString()}/
                              {cert.totalQuestions.toString()} — {pct}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {date}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          className="flex-shrink-0 gap-1 text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-sm"
                          onClick={() =>
                            navigate({
                              to: `/student/certificate/${cert.subjectId.toString()}`,
                            })
                          }
                          data-ocid={`student.certificates.view_button.${i + 1}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> View
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quiz History Section */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />
            <h2 className="font-display text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Quiz Attempts
            </h2>
          </div>
        </div>

        {completedAttempts.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border-2 border-dashed border-border bg-muted/20"
            data-ocid="student.history.empty_state"
          >
            <ClipboardList className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-semibold text-foreground mb-2">
              No completed quizzes yet
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Go to My Quizzes to take your first quiz!
            </p>
            <Button
              type="button"
              className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md hover:-translate-y-0.5 transition-transform"
              size="sm"
              onClick={() => navigate({ to: "/student/quizzes" })}
              data-ocid="student.history.go_quizzes_button"
            >
              <PlayCircle className="h-4 w-4" /> Browse Quizzes
            </Button>
          </div>
        ) : (
          <Card
            className="border-0 shadow-md overflow-hidden"
            data-ocid="student.history.table"
          >
            <CardHeader className="pb-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-violet-500" />
                Completed Attempts
                <Badge className="ml-1 text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 font-bold">
                  {completedAttempts.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="font-bold">Subject</TableHead>
                    <TableHead className="text-right font-bold">
                      Score
                    </TableHead>
                    <TableHead className="text-right font-bold">
                      Result
                    </TableHead>
                    <TableHead className="text-right font-bold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedAttempts.map((a, i) => {
                    const pct = Math.round(
                      (Number(a.score) /
                        Math.max(1, Number(a.totalQuestions))) *
                        100,
                    );
                    const date = a.completedAt
                      ? new Date(
                          Number(a.completedAt) / 1_000_000,
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—";
                    return (
                      <TableRow
                        key={`${a.id.toString()}-${a.subjectId.toString()}`}
                        className={`transition-colors hover:bg-primary/5 ${i % 2 === 0 ? "bg-muted/10" : ""}`}
                        data-ocid={`student.history.item.${i + 1}`}
                      >
                        <TableCell className="font-semibold text-sm">
                          {subjectMap.get(a.subjectId.toString()) ?? "Unknown"}
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums font-medium">
                          {a.score.toString()}/{a.totalQuestions.toString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              pct >= 70
                                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                                : pct >= 40
                                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white"
                                  : "bg-gradient-to-r from-rose-500 to-red-500 text-white"
                            }`}
                          >
                            {pct}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                          {date}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}
