import { createActor } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { StudentLayout } from "@/layouts/StudentLayout";
import type { QuestionPublic, QuizAttemptPublic } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function QuizPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const params = useParams({ from: "/student/quiz/$subjectId" });
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [attempt, setAttempt] = useState<QuizAttemptPublic | null>(null);
  const [questions, setQuestions] = useState<QuestionPublic[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  // answers[i] = selected option index for question i (or undefined)
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [quizResult, setQuizResult] = useState<QuizAttemptPublic | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    if (role === "admin") navigate({ to: "/admin/subjects" });
  }, [isAuthenticated, role, navigate]);

  const subjectId = BigInt(params.subjectId ?? "0");

  const { data: questionsData, isLoading: loadingQuestions } = useQuery<
    QuestionPublic[]
  >({
    queryKey: ["questions", params.subjectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listQuestionsBySubject(subjectId);
    },
    enabled: !!actor && !isFetching,
  });

  const startMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.startQuiz(subjectId);
    },
    onSuccess: (data) => {
      setAttempt(data);
      const qs = questionsData ?? [];
      setQuestions(qs);
      setCurrentIdx(0);
      setAnswers(new Array(qs.length).fill(undefined));
    },
    onError: () => toast.error("Failed to start quiz"),
  });

  const submitMutation = useMutation({
    mutationFn: async (finalAnswers: (number | undefined)[]) => {
      if (!actor || !attempt) throw new Error("No actor");
      return actor.submitQuizAnswers({
        attemptId: attempt.id,
        answers: finalAnswers.map((a) => BigInt(a ?? 0)),
      });
    },
    onSuccess: (data) => {
      setQuizResult(data.attempt);
      setCorrectAnswers(data.correctAnswers.map(Number));
      queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
    },
    onError: () => toast.error("Failed to submit quiz"),
  });

  if (role === "loading" || loadingQuestions)
    return <LoadingSpinner fullScreen />;

  const handleStart = () => startMutation.mutate();

  const handleSelectAnswer = (idx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = idx;
      return next;
    });
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      submitMutation.mutate(answers);
    }
  };

  // ─── Result Screen ────────────────────────────────────────────────────────
  if (quizResult) {
    const pct = Math.round(
      (Number(quizResult.score) /
        Math.max(1, Number(quizResult.totalQuestions))) *
        100,
    );
    const isGood = pct >= 70;

    return (
      <StudentLayout>
        <div className="max-w-2xl mx-auto" data-ocid="student.quiz.result.page">
          {/* Score summary */}
          <div className="text-center py-10">
            <div
              className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isGood ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <Trophy
                className={`h-10 w-10 ${
                  isGood ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Quiz Complete!
            </h1>
            <p className="text-muted-foreground mb-6">Here's how you did</p>

            <div className="inline-flex flex-col items-center bg-card border border-border rounded-xl px-10 py-6 mb-8 card-elevated">
              <p
                className={`text-6xl font-display font-bold mb-1 ${
                  isGood ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {pct}%
              </p>
              <p className="text-muted-foreground text-sm">
                {quizResult.score.toString()} out of{" "}
                {quizResult.totalQuestions.toString()} correct
              </p>
              <Progress value={pct} className="mt-4 w-48" />
            </div>

            <div className="flex justify-center gap-3 mb-10">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => navigate({ to: "/student/quizzes" })}
                data-ocid="student.quiz.result.back_button"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Quizzes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/student/history" })}
                data-ocid="student.quiz.result.history_button"
              >
                View History
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setAttempt(null);
                  setQuizResult(null);
                }}
                data-ocid="student.quiz.result.retry_button"
              >
                Try Again
              </Button>
            </div>
          </div>

          {/* Question review */}
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Question Review
          </h2>
          <div
            className="space-y-4"
            data-ocid="student.quiz.result.review_list"
          >
            {questions.map((q, qi) => {
              const chosenIdx = answers[qi];
              const correctIdx = correctAnswers[qi];
              const isCorrect =
                correctAnswers[qi] !== undefined &&
                chosenIdx === correctAnswers[qi];

              return (
                <Card
                  key={`review-${qi}-${q.id.toString()}`}
                  className={`border-l-4 ${
                    isCorrect ? "border-l-primary" : "border-l-destructive"
                  }`}
                  data-ocid={`student.quiz.result.review.item.${qi + 1}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      )}
                      <CardTitle className="text-sm font-medium leading-relaxed">
                        <span className="text-muted-foreground text-xs mr-2">
                          Q{qi + 1}.
                        </span>
                        {q.text}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const wasChosen = chosenIdx === oi;
                      const isTheCorrect = correctIdx === oi;
                      return (
                        <div
                          key={`review-${qi}-opt-${oi}-${opt}`}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                            wasChosen && isCorrect
                              ? "bg-primary/10 border border-primary/30 text-primary"
                              : wasChosen && !isCorrect
                                ? "bg-destructive/10 border border-destructive/30 text-destructive"
                                : isTheCorrect
                                  ? "bg-primary/10 border border-primary/30 text-primary"
                                  : "text-muted-foreground"
                          }`}
                        >
                          <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {wasChosen && (
                            <Badge
                              variant={isCorrect ? "default" : "destructive"}
                              className="text-xs"
                            >
                              Your answer
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </StudentLayout>
    );
  }

  // ─── Active Quiz ──────────────────────────────────────────────────────────
  if (attempt && questions.length > 0) {
    const q = questions[currentIdx];
    const selectedAnswer = answers[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const isLast = currentIdx + 1 === questions.length;

    return (
      <StudentLayout>
        <div className="max-w-xl mx-auto" data-ocid="student.quiz.active.page">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <Badge variant="secondary">{Math.round(progress)}% done</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="zone-section" data-ocid="student.quiz.question.card">
            <CardHeader>
              <CardTitle className="font-display text-lg leading-relaxed">
                {q.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.options.map((opt, idx) => (
                <button
                  key={`opt-${currentIdx}-${idx}-${opt}`}
                  type="button"
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-smooth ${
                    selectedAnswer === idx
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border bg-card hover:bg-muted text-foreground"
                  }`}
                  onClick={() => handleSelectAnswer(idx)}
                  data-ocid={`student.quiz.option.${idx + 1}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-4">
            <Button
              type="button"
              variant="ghost"
              className="gap-2"
              disabled={currentIdx === 0}
              onClick={handlePrev}
              data-ocid="student.quiz.prev_button"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              type="button"
              className="gap-2"
              disabled={
                selectedAnswer === undefined || submitMutation.isPending
              }
              onClick={handleNext}
              data-ocid="student.quiz.next_button"
            >
              {isLast ? "Submit Quiz" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // ─── Start Screen ─────────────────────────────────────────────────────────
  return (
    <StudentLayout>
      <div
        className="max-w-xl mx-auto text-center py-16"
        data-ocid="student.quiz.start.page"
      >
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Ready to start?
        </h1>
        <p className="text-muted-foreground mb-2">
          {questionsData?.length ?? 0} questions in this subject quiz.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Answer all questions and see your score at the end.
        </p>
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            variant="ghost"
            className="gap-2"
            onClick={() => navigate({ to: "/student/quizzes" })}
            data-ocid="student.quiz.back_button"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            type="button"
            size="lg"
            className="gap-2"
            onClick={handleStart}
            disabled={startMutation.isPending}
            data-ocid="student.quiz.start_button"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </StudentLayout>
  );
}
