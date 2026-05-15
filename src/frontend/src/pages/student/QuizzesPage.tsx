import { createActor } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { StudentLayout } from "@/layouts/StudentLayout";
import type { QuizAttemptPublic, SubjectWithStats } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, PlayCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function QuizzesPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "admin") navigate({ to: "/admin/subjects" });
  }, [isAuthenticated, role, navigate]);

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

  const { data: attempts, isLoading: loadingAttempts } = useQuery<
    QuizAttemptPublic[]
  >({
    queryKey: ["myAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAttempts();
    },
    enabled: !!actor && !isFetching,
  });

  const startMutation = useMutation({
    mutationFn: async (subjectId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.startQuiz(subjectId);
    },
    onSuccess: (data, subjectId) => {
      queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
      navigate({
        to: "/student/quiz/$subjectId",
        params: { subjectId: subjectId.toString() },
        search: { attemptId: data.id.toString() },
      });
    },
    onError: () => toast.error("Failed to start quiz. Please try again."),
  });

  if (role === "loading" || loadingSubjects || loadingAttempts)
    return <LoadingSpinner fullScreen />;

  const availableSubjects =
    subjects?.filter((s) => Number(s.questionCount) > 0) ?? [];

  // Build a map: subjectId -> last completed attempt
  const completedMap = new Map<string, QuizAttemptPublic>();
  for (const a of attempts?.filter((a) => a.completed) ?? []) {
    const key = a.subjectId.toString();
    const existing = completedMap.get(key);
    if (
      !existing ||
      (a.completedAt &&
        existing.completedAt &&
        a.completedAt > existing.completedAt)
    ) {
      completedMap.set(key, a);
    }
  }

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto" data-ocid="student.quizzes.page">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            My Quizzes
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Choose a subject to start or retake a quiz
          </p>
        </div>

        {availableSubjects.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="student.quizzes.empty_state"
          >
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No quizzes available</p>
            <p className="text-sm mt-1">
              Your teacher hasn't added any questions yet. Check back soon!
            </p>
          </div>
        )}

        <div className="grid gap-4" data-ocid="student.quizzes.list">
          {availableSubjects.map((subject, i) => {
            const lastAttempt = completedMap.get(subject.id.toString());
            const pct = lastAttempt
              ? Math.round(
                  (Number(lastAttempt.score) /
                    Math.max(1, Number(lastAttempt.totalQuestions))) *
                    100,
                )
              : null;

            return (
              <Card
                key={subject.id.toString()}
                className="zone-section hover:shadow-md transition-smooth"
                data-ocid={`student.quizzes.item.${i + 1}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="font-display text-base">
                          {subject.name}
                        </CardTitle>
                        {lastAttempt && (
                          <Badge
                            variant="outline"
                            className="text-xs gap-1 border-primary/30 text-primary bg-primary/10"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs mt-1 line-clamp-2">
                        {subject.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {subject.questionCount.toString()} questions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    {lastAttempt && pct !== null ? (
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">
                          {lastAttempt.score.toString()}/
                          {lastAttempt.totalQuestions.toString()}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          — {pct}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Not started
                      </span>
                    )}
                    <div className="flex gap-2">
                      {lastAttempt ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          disabled={startMutation.isPending}
                          onClick={() => startMutation.mutate(subject.id)}
                          data-ocid={`student.quizzes.retake_button.${i + 1}`}
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Retake
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          className="gap-2"
                          disabled={startMutation.isPending}
                          onClick={() => startMutation.mutate(subject.id)}
                          data-ocid={`student.quizzes.start_button.${i + 1}`}
                        >
                          <PlayCircle className="h-4 w-4" /> Start Quiz
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}
