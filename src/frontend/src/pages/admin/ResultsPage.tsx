import { createActor } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { AdminLayout } from "@/layouts/AdminLayout";
import type {
  AttemptDetails,
  QuizAttemptPublic,
  SubjectWithStats,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ─── Score Badge ────────────────────────────────────────────────────────────
function ScoreBadge({
  pct,
  score,
  total,
}: { pct: number; score: bigint; total: bigint }) {
  const label = `${score.toString()}/${total.toString()} (${pct}%)`;
  if (pct >= 70)
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 text-xs tabular-nums">
        {label}
      </Badge>
    );
  if (pct >= 40)
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs tabular-nums">
        {label}
      </Badge>
    );
  return (
    <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-xs tabular-nums">
      {label}
    </Badge>
  );
}

// ─── Answer Breakdown ────────────────────────────────────────────────────────
function AnswerBreakdown({
  attempt,
  details,
  isLoadingDetails,
}: {
  attempt: QuizAttemptPublic;
  details: AttemptDetails | null | undefined;
  isLoadingDetails: boolean;
}) {
  if (isLoadingDetails)
    return (
      <div className="flex items-center gap-2 py-4 pl-12 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Loading answer details…
      </div>
    );

  if (!details)
    return (
      <div className="py-4 pl-12 text-sm text-muted-foreground">
        Could not load answer details.
      </div>
    );

  const { correctAnswers } = details;
  const { answers } = attempt;

  return (
    <div className="bg-muted/20 border-b border-border">
      <div className="px-6 py-3 grid grid-cols-[auto_1fr_1fr_auto] gap-x-6 gap-y-1 max-w-3xl">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          #
        </span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Student Answer
        </span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Correct Answer
        </span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Result
        </span>
        {answers.map((ans, idx) => {
          const correct = correctAnswers[idx];
          const isRight = ans === correct;
          const ansLabel = (Number(ans) + 1).toString();
          const correctLabel =
            correct !== undefined ? (Number(correct) + 1).toString() : "—";
          return [
            <span
              key={`q-${idx}-${ansLabel}`}
              className="text-xs text-muted-foreground py-1"
            >
              Q{idx + 1}
            </span>,
            <span
              key={`sa-${idx}-${ansLabel}`}
              className={`text-xs py-1 font-medium ${isRight ? "text-emerald-700" : "text-red-700"}`}
            >
              Option {ansLabel}
            </span>,
            <span
              key={`ca-${idx}-${correctLabel}`}
              className="text-xs py-1 text-foreground"
            >
              Option {correctLabel}
            </span>,
            <span
              key={`r-${idx}-${isRight ? "pass" : "fail"}`}
              className="py-1"
            >
              {isRight ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </span>,
          ];
        })}
      </div>
    </div>
  );
}

// ─── Attempt Row ─────────────────────────────────────────────────────────────
function AttemptRow({
  attempt,
  subjectMap,
  actor,
  isFetchingActor,
  rowIndex,
}: {
  attempt: QuizAttemptPublic;
  subjectMap: Map<string, string>;
  actor: ReturnType<typeof createActor> | null;
  isFetchingActor: boolean;
  rowIndex: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const { data: details, isLoading: isLoadingDetails } =
    useQuery<AttemptDetails | null>({
      queryKey: ["attemptDetails", attempt.id.toString()],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getAttemptDetails(attempt.id);
      },
      enabled: expanded && !!actor && !isFetchingActor,
    });

  const pct = Number(attempt.scorePercentage);
  const principal = attempt.studentPrincipal.toString();
  const truncatedPrincipal = `${principal.slice(0, 6)}…${principal.slice(-4)}`;
  const subjectName =
    subjectMap.get(attempt.subjectId.toString()) ?? "Unknown Subject";
  const date = attempt.completedAt
    ? new Date(Number(attempt.completedAt) / 1_000_000).toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      )
    : "—";

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
        data-ocid={`admin.results.attempt.item.${rowIndex}`}
      >
        <TableCell className="w-8 pl-4 pr-0">
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </TableCell>
        <TableCell>
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
            {truncatedPrincipal}
          </code>
        </TableCell>
        <TableCell className="text-sm text-foreground font-medium">
          {subjectName}
        </TableCell>
        <TableCell className="text-right">
          <ScoreBadge
            pct={pct}
            score={attempt.score}
            total={attempt.totalQuestions}
          />
        </TableCell>
        <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
          {date}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={5} className="p-0">
            <AnswerBreakdown
              attempt={attempt}
              details={details}
              isLoadingDetails={isLoadingDetails}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const [search, setSearch] = useState("");
  const [filterSubjectId, setFilterSubjectId] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "student") navigate({ to: "/student/quizzes" });
  }, [isAuthenticated, role, navigate]);

  const { data: attempts, isLoading: loadingAttempts } = useQuery<
    QuizAttemptPublic[]
  >({
    queryKey: ["allAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAttempts();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: subjects, isLoading: loadingSubjects } = useQuery<
    SubjectWithStats[]
  >({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching,
  });

  const subjectMap = useMemo(
    () => new Map(subjects?.map((s) => [s.id.toString(), s.name]) ?? []),
    [subjects],
  );

  const completedAttempts = useMemo(
    () => (attempts ?? []).filter((a) => a.completed),
    [attempts],
  );

  const avgScore = useMemo(() => {
    if (completedAttempts.length === 0) return 0;
    return Math.round(
      completedAttempts.reduce((sum, a) => sum + Number(a.scorePercentage), 0) /
        completedAttempts.length,
    );
  }, [completedAttempts]);

  const uniqueStudents = useMemo(
    () =>
      new Set(completedAttempts.map((a) => a.studentPrincipal.toString())).size,
    [completedAttempts],
  );

  const filteredAttempts = useMemo(() => {
    let list = completedAttempts;
    if (filterSubjectId !== "all") {
      list = list.filter((a) => a.subjectId.toString() === filterSubjectId);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((a) =>
        a.studentPrincipal.toString().toLowerCase().includes(q),
      );
    }
    return list
      .slice()
      .sort((a, b) => Number((b.completedAt ?? 0n) - (a.completedAt ?? 0n)));
  }, [completedAttempts, filterSubjectId, search]);

  if (role === "loading" || loadingAttempts || loadingSubjects)
    return <LoadingSpinner fullScreen />;

  const STATS = [
    { label: "Total Students", value: uniqueStudents, icon: Users },
    {
      label: "Quiz Attempts",
      value: completedAttempts.length,
      icon: BarChart3,
    },
    { label: "Avg. Score %", value: `${avgScore}%`, icon: Trophy },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto" data-ocid="admin.results.page">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Results
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Review quiz submissions and answer breakdowns
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="zone-section">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-display font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Attempts table */}
        <Card className="zone-section">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="font-display text-base">
                Quiz Submissions
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* Subject filter */}
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Select
                    value={filterSubjectId}
                    onValueChange={setFilterSubjectId}
                  >
                    <SelectTrigger
                      className="h-8 text-sm w-44"
                      data-ocid="admin.results.subject.select"
                    >
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects?.map((s) => (
                        <SelectItem
                          key={s.id.toString()}
                          value={s.id.toString()}
                        >
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Student search */}
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search principal…"
                    className="pl-8 h-8 text-sm w-48"
                    data-ocid="admin.results.search_input"
                  />
                </div>

                {(search || filterSubjectId !== "all") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground px-2"
                    onClick={() => {
                      setSearch("");
                      setFilterSubjectId("all");
                    }}
                    data-ocid="admin.results.clear_filter_button"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {completedAttempts.length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="admin.results.attempts.empty_state"
              >
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No quiz submissions yet</p>
                <p className="text-xs mt-1">
                  Results will appear here once students complete quizzes.
                </p>
              </div>
            ) : filteredAttempts.length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="admin.results.attempts.no_match_state"
              >
                <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">
                  No submissions match the current filters.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8 pl-4 pr-0" />
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttempts.map((attempt, idx) => (
                    <AttemptRow
                      key={`${attempt.id.toString()}-${attempt.studentPrincipal.toString()}`}
                      attempt={attempt}
                      subjectMap={subjectMap}
                      actor={actor}
                      isFetchingActor={isFetching}
                      rowIndex={idx + 1}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
