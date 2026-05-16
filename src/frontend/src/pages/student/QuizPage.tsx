import { createActor } from "@/backend";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { useRole } from "@/hooks/useRole";
import { StudentLayout } from "@/layouts/StudentLayout";
import type { StudentProfilePublic } from "@/types";
import type { QuestionPublic, QuizAttemptPublic } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Timer,
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
  const { actor: profileActor, isFetching: profileFetching } = useBackend();
  const queryClient = useQueryClient();

  const [attempt, setAttempt] = useState<QuizAttemptPublic | null>(null);
  const [questions, setQuestions] = useState<QuestionPublic[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [quizResult, setQuizResult] = useState<QuizAttemptPublic | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  const { data: myProfile } = useQuery<StudentProfilePublic | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!profileActor) return null;
      return profileActor.getMyProfile();
    },
    enabled: !!profileActor && !profileFetching,
    staleTime: 0,
    refetchOnMount: true,
  });

  // A name is considered "missing" if it's empty, the fallback word "Student",
  // or an ICP principal (63+ char alphanumeric+dash string)
  const isPrincipalLike = (s: string) =>
    s.length >= 20 && /^[a-z0-9-]+$/.test(s);

  const hasName = !!(
    myProfile?.displayName &&
    myProfile.displayName.trim().length > 0 &&
    myProfile.displayName.trim() !== "Student" &&
    !isPrincipalLike(myProfile.displayName.trim())
  );

  const showNudge = !hasName && !nudgeDismissed;

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
      if (
        data.timeLimitMinutes !== undefined &&
        data.timeLimitMinutes !== null
      ) {
        const totalSeconds = Number(data.timeLimitMinutes) * 60;
        const elapsedSeconds =
          (Date.now() * 1e6 - Number(data.startedAt)) / 1e9;
        setTimeLeft(Math.max(0, Math.round(totalSeconds - elapsedSeconds)));
      } else {
        setTimeLeft(null);
      }
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
      setTimeLeft(null);
      queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
    },
    onError: () => toast.error("Failed to submit quiz"),
  });

  const submitMutate = submitMutation.mutate;

  useEffect(() => {
    if (timeLeft === null || quizResult !== null) return;
    if (timeLeft <= 0) {
      toast.warning("Time's up! Submitting your quiz...");
      submitMutate(answers);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, quizResult, answers, submitMutate]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

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
    if (currentIdx + 1 < questions.length) setCurrentIdx((i) => i + 1);
    else submitMutation.mutate(answers);
  };

  // ─── Result Screen ────────────────────────────────────────────────────────
  if (quizResult) {
    const pct = Math.round(
      (Number(quizResult.score) /
        Math.max(1, Number(quizResult.totalQuestions))) *
        100,
    );
    const isGood = pct >= 70;
    const isMid = pct >= 40 && pct < 70;

    return (
      <StudentLayout>
        <div className="max-w-2xl mx-auto" data-ocid="student.quiz.result.page">
          {/* Profile name nudge — only shown if displayName is missing/principal/fallback */}
          {showNudge && (
            <Alert
              className="mb-6 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              data-ocid="student.quiz.result.profile_nudge"
            >
              <AlertDescription className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="flex flex-wrap items-center gap-2">
                  ✏️ Your profile name isn't set — add your name so it appears on
                  your certificate.
                  <Link
                    to="/student/profile"
                    className="font-semibold underline underline-offset-2 hover:no-underline shrink-0"
                    data-ocid="student.quiz.result.profile_nudge_link"
                  >
                    Set your name →
                  </Link>
                </span>
                <button
                  type="button"
                  aria-label="Dismiss profile nudge"
                  className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-base leading-none"
                  onClick={() => setNudgeDismissed(true)}
                  data-ocid="student.quiz.result.profile_nudge_dismiss"
                >
                  ✕
                </button>
              </AlertDescription>
            </Alert>
          )}
          <div className="text-center py-10">
            {/* Trophy */}
            <div
              className={`h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl ${
                isGood
                  ? "bg-gradient-to-br from-amber-400 to-yellow-500 shadow-amber-500/40"
                  : isMid
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/40"
                    : "bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-500/30"
              }`}
            >
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-1">
              Quiz Complete!
            </h1>
            <p className="text-muted-foreground mb-6 text-lg">
              {isGood
                ? "🎉 Excellent work!"
                : isMid
                  ? "💪 Good effort!"
                  : "📚 Keep practicing!"}
            </p>

            <div
              className={`inline-flex flex-col items-center rounded-2xl px-12 py-8 mb-8 shadow-xl ${
                isGood
                  ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-300 dark:border-amber-700"
                  : isMid
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-300 dark:border-blue-700"
                    : "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-2 border-rose-300 dark:border-rose-700"
              }`}
            >
              <p
                className={`text-7xl font-display font-bold mb-2 ${
                  isGood
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent"
                    : isMid
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent"
                }`}
              >
                {pct}%
              </p>
              <p className="text-muted-foreground text-sm font-medium">
                {quizResult.score.toString()} out of{" "}
                {quizResult.totalQuestions.toString()} correct
              </p>
              <div className="mt-4 w-48">
                <Progress value={pct} className="h-3 rounded-full" />
              </div>
            </div>

            <div className="flex justify-center gap-3 mb-10 flex-wrap">
              <Button
                type="button"
                variant="outline"
                className="gap-2 hover:-translate-y-0.5 transition-transform"
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
                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md hover:-translate-y-0.5 transition-transform"
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

          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-violet-500 to-purple-600 inline-block" />
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
                  className={`overflow-hidden border-2 ${
                    isCorrect
                      ? "border-emerald-300 dark:border-emerald-700"
                      : "border-rose-300 dark:border-rose-700"
                  }`}
                  data-ocid={`student.quiz.result.review.item.${qi + 1}`}
                >
                  <div
                    className={`h-1.5 w-full ${
                      isCorrect
                        ? "bg-gradient-to-r from-emerald-400 to-green-500"
                        : "bg-gradient-to-r from-rose-400 to-red-500"
                    }`}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
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
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border-2 ${
                            wasChosen && isCorrect
                              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                              : wasChosen && !isCorrect
                                ? "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300"
                                : isTheCorrect
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                                  : "border-border/50 text-muted-foreground"
                          }`}
                        >
                          <span className="h-5 w-5 rounded-full border-2 border-current flex items-center justify-center text-xs shrink-0 font-bold">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {wasChosen && (
                            <Badge
                              className={`text-xs font-bold border-0 ${
                                isCorrect
                                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700"
                                  : "bg-rose-100 dark:bg-rose-900/40 text-rose-700"
                              }`}
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
    const timerIsRed = timeLeft !== null && timeLeft < 60;
    const timerIsYellow = timeLeft !== null && timeLeft >= 60 && timeLeft < 180;

    return (
      <StudentLayout>
        <div className="max-w-xl mx-auto" data-ocid="student.quiz.active.page">
          {/* Timer */}
          {timeLeft !== null && (
            <div
              className={`flex items-center justify-center gap-3 mb-6 px-6 py-3 rounded-2xl font-mono font-bold text-xl shadow-lg transition-all duration-500 ${
                timerIsRed
                  ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/40 animate-pulse"
                  : timerIsYellow
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-amber-500/30"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-violet-500/30"
              }`}
              data-ocid="student.quiz.timer"
            >
              {timerIsRed ? (
                <Flame className="h-6 w-6 shrink-0 animate-bounce" />
              ) : (
                <Timer className="h-6 w-6 shrink-0" />
              )}
              <span className="tabular-nums tracking-wider">
                {formatTime(timeLeft)}
              </span>
              {timerIsRed && (
                <span className="text-sm font-sans font-bold opacity-90">
                  Hurry!
                </span>
              )}
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-muted-foreground">
                Question {currentIdx + 1}{" "}
                <span className="text-muted-foreground/60">
                  of {questions.length}
                </span>
              </span>
              <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 font-bold">
                {Math.round(progress)}% done
              </Badge>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <Card
            className="border-0 shadow-xl overflow-hidden"
            data-ocid="student.quiz.question.card"
          >
            <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600" />
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-8 w-10 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-bold shrink-0">
                  Q{currentIdx + 1}
                </span>
                <CardTitle className="font-display text-lg leading-relaxed text-foreground">
                  {q.text}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-6">
              {q.options.map((opt, idx) => (
                <button
                  key={`opt-${currentIdx}-${idx}-${opt}`}
                  type="button"
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                    selectedAnswer === idx
                      ? "border-violet-400 bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-300 shadow-md shadow-violet-500/10"
                      : "border-border/60 bg-card hover:bg-muted/50 text-foreground hover:border-violet-200 dark:hover:border-violet-700"
                  }`}
                  onClick={() => handleSelectAnswer(idx)}
                  data-ocid={`student.quiz.option.${idx + 1}`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span
                      className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                        selectedAnswer === idx
                          ? "border-violet-500 bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                          : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="ghost"
              className="gap-2 hover:bg-muted"
              disabled={currentIdx === 0}
              onClick={handlePrev}
              data-ocid="student.quiz.prev_button"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              type="button"
              className={`gap-2 font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                isLast
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/30"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md shadow-violet-500/30"
              }`}
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
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/40">
          <Trophy className="h-12 w-12 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-3">
          Ready for the challenge?
        </h1>
        <p className="text-muted-foreground mb-2 text-lg">
          {questionsData?.length ?? 0} questions await you!
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
            className="gap-2 font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-200"
            onClick={handleStart}
            disabled={startMutation.isPending}
            data-ocid="student.quiz.start_button"
          >
            <Clock className="h-5 w-5" /> Start Quiz
          </Button>
        </div>
      </div>
    </StudentLayout>
  );
}
