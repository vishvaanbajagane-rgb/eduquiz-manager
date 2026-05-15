import { createActor } from "@/backend";
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
import { ClipboardList, PlayCircle } from "lucide-react";
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

  if (role === "loading" || isLoading) return <LoadingSpinner fullScreen />;

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
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Quiz History
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            All your completed quiz attempts, most recent first
          </p>
        </div>

        {completedAttempts.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="student.history.empty_state"
          >
            <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No completed quizzes yet</p>
            <p className="text-sm mt-1 mb-6">
              Go to My Quizzes to take your first quiz!
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate({ to: "/student/quizzes" })}
              data-ocid="student.history.go_quizzes_button"
            >
              <PlayCircle className="h-4 w-4" /> Browse Quizzes
            </Button>
          </div>
        ) : (
          <Card className="zone-section" data-ocid="student.history.table">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Completed Attempts
                <Badge variant="secondary" className="ml-2 text-xs">
                  {completedAttempts.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Result</TableHead>
                    <TableHead className="text-right">Date</TableHead>
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
                        data-ocid={`student.history.item.${i + 1}`}
                      >
                        <TableCell className="font-medium text-sm">
                          {subjectMap.get(a.subjectId.toString()) ?? "Unknown"}
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          {a.score.toString()}/{a.totalQuestions.toString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={pct >= 70 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {pct}%
                          </Badge>
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
