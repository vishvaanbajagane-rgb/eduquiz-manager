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
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  CheckCircle2,
  Flame,
  Hand,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  UserCircle2,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Detects ICP Internet Identity principal strings so they are never shown as names.
function isPrincipalId(s: string): boolean {
  if (!s) return false;
  if (/^[a-z0-9]{5}(-[a-z0-9]{5}){3}-[a-z0-9]{3}$/.test(s)) return true;
  if (/^[a-z2-7]{5,}(-[a-z2-7]{5,}){4,}$/.test(s)) return true;
  if (
    s.length > 20 &&
    (s.match(/-/g) ?? []).length >= 4 &&
    /^[a-z0-9-]+$/.test(s)
  )
    return true;
  return false;
}

function sanitizeName(raw: string | undefined): string {
  const s = raw?.trim() ?? "";
  return isPrincipalId(s) ? "" : s;
}

const CARD_GRADIENTS = [
  {
    bg: "from-violet-500 to-purple-600",
    soft: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
    border: "border-violet-200 dark:border-violet-800/50",
  },
  {
    bg: "from-blue-500 to-cyan-600",
    soft: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    border: "border-blue-200 dark:border-blue-800/50",
  },
  {
    bg: "from-emerald-500 to-teal-600",
    soft: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
    border: "border-emerald-200 dark:border-emerald-800/50",
  },
  {
    bg: "from-orange-500 to-amber-500",
    soft: "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
    border: "border-orange-200 dark:border-orange-800/50",
  },
  {
    bg: "from-rose-500 to-pink-600",
    soft: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
    border: "border-rose-200 dark:border-rose-800/50",
  },
  {
    bg: "from-indigo-500 to-blue-600",
    soft: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
    border: "border-indigo-200 dark:border-indigo-800/50",
  },
];

export default function QuizzesPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const { data: profileRaw } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getMyProfile();
      if (Array.isArray(result)) return result[0] ?? null;
      return result;
    },
    enabled: !!actor && !isFetching,
  });
  // profileRaw may be null, undefined, or a profile object
  const profile = profileRaw ?? null;

  const rawName = sanitizeName(profile?.displayName);
  const displayName = rawName.length > 0 ? rawName : null;

  // Profile photo from localStorage — same pattern as StudentProfilePage
  const PHOTO_LS_KEY_PREFIX = "student-photo-";
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  useEffect(() => {
    if (profile?.principal) {
      const key = `${PHOTO_LS_KEY_PREFIX}${profile.principal.toString()}`;
      setProfilePhoto(localStorage.getItem(key) ?? "");
    }
  }, [profile?.principal]);

  // Profile completion
  const profileFields = [
    {
      key: "Name",
      filled: sanitizeName(profile?.displayName).length > 0,
    },
    {
      key: "Department",
      filled: !!(profile?.department && profile.department.trim().length > 0),
    },
    {
      key: "Register No.",
      filled: !!(
        profile?.registerNumber && profile.registerNumber.trim().length > 0
      ),
    },
    {
      key: "Enroll No.",
      filled: !!(
        profile?.enrollNumber && profile.enrollNumber.trim().length > 0
      ),
    },
    {
      key: "Section",
      filled: !!(profile?.section && profile.section.trim().length > 0),
    },
  ];
  const filledCount = profileFields.filter((f) => f.filled).length;
  const profilePct = Math.round((filledCount / profileFields.length) * 100);
  const missingFields = profileFields.filter((f) => !f.filled);
  const profileComplete = profilePct === 100;

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

  // Streak: count consecutive calendar days (UTC) with at least one completed quiz
  const streak = useMemo(() => {
    const completed = (attempts ?? []).filter(
      (a) => a.completed && a.completedAt && Number(a.completedAt) > 0,
    );
    if (completed.length === 0) return 0;
    // Collect unique day strings "YYYY-MM-DD" in UTC
    const days = new Set(
      completed.map((a) => {
        const ms = Number(a.completedAt) / 1_000_000; // nanoseconds → ms
        return new Date(ms).toISOString().slice(0, 10);
      }),
    );
    const sorted = Array.from(days).sort().reverse();
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 86_400_000)
      .toISOString()
      .slice(0, 10);
    // Chain must start from today or yesterday
    if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;
    let count = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(new Date(sorted[i - 1]).getTime() - 86_400_000)
        .toISOString()
        .slice(0, 10);
      if (sorted[i] === prev) count++;
      else break;
    }
    return count;
  }, [attempts]);

  const totalCompleted = useMemo(
    () => (attempts ?? []).filter((a) => a.completed).length,
    [attempts],
  );

  // Top score: max score% across ALL completed attempts
  const topScore = useMemo(() => {
    const completed = (attempts ?? []).filter(
      (a) => a.completed && Number(a.totalQuestions) > 0,
    );
    if (completed.length === 0) return null;
    return Math.max(
      ...completed.map((a) =>
        Math.round(
          (Number(a.score) / Math.max(1, Number(a.totalQuestions))) * 100,
        ),
      ),
    );
  }, [attempts]);

  // Best score per subject: highest % among completed attempts for each subject
  const bestScoreBySubject = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of (attempts ?? []).filter(
      (a) => a.completed && Number(a.totalQuestions) > 0,
    )) {
      const key = a.subjectId.toString();
      const pct = Math.round(
        (Number(a.score) / Math.max(1, Number(a.totalQuestions))) * 100,
      );
      const prev = map.get(key);
      if (prev === undefined || pct > prev) map.set(key, pct);
    }
    return map;
  }, [attempts]);

  const department = profile?.department?.trim() ?? "";

  if (role === "loading" || loadingSubjects || loadingAttempts)
    return <LoadingSpinner fullScreen />;

  const availableSubjects =
    subjects?.filter((s) => Number(s.questionCount) > 0) ?? [];

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

  const totalSubjects = availableSubjects.length;
  const completedCount = availableSubjects.filter((s) =>
    completedMap.has(s.id.toString()),
  ).length;

  // Large progress ring constants
  const RING_SIZE = 120;
  const RING_STROKE = 10;
  const RING_R = (RING_SIZE - RING_STROKE) / 2;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;
  const globalPct = totalSubjects > 0 ? completedCount / totalSubjects : 0;
  const globalOffset = RING_CIRCUMFERENCE * (1 - globalPct);

  // Small per-card ring constants
  const MINI_SIZE = 40;
  const MINI_STROKE = 4;
  const MINI_R = (MINI_SIZE - MINI_STROKE) / 2;
  const MINI_CIRCUMFERENCE = 2 * Math.PI * MINI_R;

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto" data-ocid="student.quizzes.page">
        {/* Personalised greeting */}
        <div
          className="mb-6 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-px shadow-lg shadow-violet-500/20"
          data-ocid="student.quizzes.welcome_banner"
        >
          <div className="rounded-[calc(1rem-1px)] bg-gradient-to-r from-violet-50/90 via-purple-50/90 to-indigo-50/90 dark:from-violet-950/60 dark:via-purple-950/60 dark:to-indigo-950/60 px-6 py-4 flex items-center gap-4">
            {/* Profile photo avatar */}
            <div className="shrink-0">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={displayName ?? "Student"}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-violet-400/60 shadow-md shadow-violet-500/25"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ring-2 ring-violet-400/60 shadow-md shadow-violet-500/25">
                  {displayName ? (
                    <span className="text-xl font-bold text-white leading-none">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <UserCircle2 className="h-7 w-7 text-white/90" />
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/30">
                <Hand className="h-5 w-5 text-white [animation:wave_1.8s_ease-in-out_1]" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                {displayName ? `Welcome ${displayName}!! 🎉` : "Welcome!! 🎉"}
              </p>
              <p className="text-muted-foreground text-sm mt-0.5 font-medium">
                Ready to test your knowledge today?
              </p>
              {topScore !== null && (
                <div className="mt-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400/20 to-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 shadow-sm"
                    data-ocid="student.quizzes.top_score_badge"
                  >
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    Top Score: {topScore}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div
          className={`mb-6 grid gap-3 ${department ? "grid-cols-3" : "grid-cols-2"}`}
          data-ocid="student.quizzes.stats_row"
        >
          {/* Streak */}
          <div className="rounded-2xl border border-orange-200 dark:border-orange-800/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md shadow-orange-400/30">
              <Flame className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide leading-none">
                Streak
              </p>
              <p className="font-display text-2xl font-extrabold text-orange-600 dark:text-orange-400 leading-tight">
                {streak}
                <span className="text-sm font-semibold ml-1 text-orange-500 dark:text-orange-400">
                  {streak === 1 ? "day" : "days"}
                </span>
              </p>
            </div>
          </div>
          {/* Total completed */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
              <Trophy className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide leading-none">
                Completed
              </p>
              <p className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-tight">
                {totalCompleted}
                <span className="text-sm font-semibold ml-1 text-emerald-500 dark:text-emerald-400">
                  {totalCompleted === 1 ? "quiz" : "quizzes"}
                </span>
              </p>
            </div>
          </div>
          {/* Department — only shown when set */}
          {department && (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <Building2 className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide leading-none">
                  Dept
                </p>
                <p className="font-display text-sm font-extrabold text-indigo-600 dark:text-indigo-400 leading-tight truncate">
                  {department}
                </p>
              </div>
            </div>
          )}
        </div>

        {profile !== null && profile !== undefined && !profileComplete && (
          <div
            className="mb-6 rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/25 dark:to-orange-950/25 p-5 shadow-sm"
            data-ocid="student.quizzes.profile_completion_banner"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-400/30">
                <UserCircle2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <p className="font-display font-bold text-amber-900 dark:text-amber-100 text-sm">
                      Complete your profile! 🌟
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      {profilePct === 0
                        ? "Add your details to personalise your experience."
                        : `Almost there — just ${missingFields.length} more ${missingFields.length === 1 ? "field" : "fields"} to go!`}
                    </p>
                  </div>
                  <Link
                    to="/student/profile"
                    data-ocid="student.quizzes.complete_profile_button"
                  >
                    <Button
                      type="button"
                      size="sm"
                      className="shrink-0 font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 shadow-md shadow-amber-400/20 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Update Profile
                    </Button>
                  </Link>
                </div>
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                      Profile {profilePct}% complete
                    </span>
                    <span className="text-xs text-amber-700 dark:text-amber-400">
                      {filledCount}/{profileFields.length} fields
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-amber-200 dark:bg-amber-900/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out"
                      style={{ width: `${profilePct}%` }}
                    />
                  </div>
                </div>
                {/* Missing fields */}
                {missingFields.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-medium mr-1">
                      Missing:
                    </span>
                    {missingFields.map((f) => (
                      <span
                        key={f.key}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50"
                      >
                        {f.key}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                My Quizzes
              </h1>
              <p className="text-muted-foreground text-sm">
                Choose a subject to start or retake a quiz
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress Ring Card */}
        {totalSubjects > 0 && (
          <div
            className="mb-8 rounded-2xl border bg-gradient-to-br from-violet-50/80 to-purple-50/60 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800/50 p-6 flex flex-col items-center gap-3 shadow-sm"
            data-ocid="student.quizzes.progress_card"
          >
            <svg
              width={RING_SIZE}
              height={RING_SIZE}
              style={{ transform: "rotate(-90deg)" }}
              role="img"
              aria-label={`${completedCount} of ${totalSubjects} subjects completed`}
            >
              {/* Track */}
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_R}
                fill="none"
                stroke="oklch(0.3 0.05 240)"
                strokeWidth={RING_STROKE}
                strokeLinecap="round"
                opacity="0.35"
              />
              {/* Filled arc */}
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_R}
                fill="none"
                stroke="oklch(0.7 0.15 145)"
                strokeWidth={RING_STROKE}
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={globalOffset}
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
              {/* Center text — rotate back since SVG is rotated */}
              <text
                x={RING_SIZE / 2}
                y={RING_SIZE / 2 - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  transform: `rotate(90deg) translate(0px, -${RING_SIZE}px)`,
                  transformOrigin: `${RING_SIZE / 2}px ${RING_SIZE / 2}px`,
                  fontSize: "18px",
                  fontWeight: "700",
                  fill: "oklch(0.7 0.15 145)",
                  fontFamily: "inherit",
                }}
              >
                {completedCount} / {totalSubjects}
              </text>
              <text
                x={RING_SIZE / 2}
                y={RING_SIZE / 2 + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  transform: `rotate(90deg) translate(0px, -${RING_SIZE}px)`,
                  transformOrigin: `${RING_SIZE / 2}px ${RING_SIZE / 2}px`,
                  fontSize: "11px",
                  fontWeight: "500",
                  fill: "oklch(0.55 0.05 240)",
                  fontFamily: "inherit",
                }}
              >
                Subjects
              </text>
            </svg>
            <p className="text-sm font-semibold text-muted-foreground tracking-wide">
              Your Progress
            </p>
          </div>
        )}

        {availableSubjects.length === 0 && (
          <div
            className="text-center py-20 rounded-2xl border-2 border-dashed border-violet-200 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/60 to-purple-50/40 dark:from-violet-950/10 dark:to-purple-950/10"
            data-ocid="student.quizzes.empty_state"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <p className="font-display font-bold text-xl text-foreground mb-2">
              🏗️ Coming soon!
            </p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Your teacher is preparing amazing quizzes for you. Check back soon
              — challenges await!
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-xs text-violet-500 font-medium">
                Get ready to learn!
              </span>
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
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
            const grad = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
            const miniOffset = lastAttempt ? 0 : MINI_CIRCUMFERENCE;

            return (
              <Card
                key={subject.id.toString()}
                className={`overflow-hidden border bg-gradient-to-br ${grad.soft} ${grad.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                data-ocid={`student.quizzes.item.${i + 1}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${grad.bg} flex items-center justify-center shrink-0 shadow-md`}
                      >
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="font-display text-lg">
                            {subject.name}
                          </CardTitle>
                          {lastAttempt && (
                            <Badge className="text-xs gap-1 bg-[oklch(0.92_0.08_145)] text-[oklch(0.45_0.12_145)] dark:bg-[oklch(0.3_0.08_145)] dark:text-[oklch(0.8_0.1_145)] border-[oklch(0.75_0.1_145)] dark:border-[oklch(0.45_0.1_145)] font-semibold">
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </Badge>
                          )}
                          {(() => {
                            const best = bestScoreBySubject.get(
                              subject.id.toString(),
                            );
                            if (best === undefined) return null;
                            return (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[oklch(0.93_0.08_145)] text-[oklch(0.42_0.14_145)] dark:bg-[oklch(0.28_0.08_145)] dark:text-[oklch(0.78_0.12_145)] border border-[oklch(0.78_0.1_145)] dark:border-[oklch(0.4_0.1_145)]"
                                data-ocid={`student.quizzes.best_score_badge.${i + 1}`}
                              >
                                <Star className="h-2.5 w-2.5 fill-current" />
                                Best: {best}%
                              </span>
                            );
                          })()}
                        </div>
                        <CardDescription className="text-xs mt-1 line-clamp-2">
                          {subject.description}
                        </CardDescription>
                      </div>
                    </div>
                    {/* Small progress ring */}
                    <div className="shrink-0 flex flex-col items-center gap-1">
                      <svg
                        width={MINI_SIZE}
                        height={MINI_SIZE}
                        style={{ transform: "rotate(-90deg)" }}
                        role="img"
                        aria-label={lastAttempt ? "Completed" : "Not started"}
                        data-ocid={`student.quizzes.progress_ring.${i + 1}`}
                      >
                        {/* Track */}
                        <circle
                          cx={MINI_SIZE / 2}
                          cy={MINI_SIZE / 2}
                          r={MINI_R}
                          fill="none"
                          stroke="oklch(0.7 0.04 240)"
                          strokeWidth={MINI_STROKE}
                          opacity="0.4"
                        />
                        {/* Arc */}
                        <circle
                          cx={MINI_SIZE / 2}
                          cy={MINI_SIZE / 2}
                          r={MINI_R}
                          fill="none"
                          stroke={
                            lastAttempt
                              ? "oklch(0.6 0.15 145)"
                              : "oklch(0.7 0.04 240)"
                          }
                          strokeWidth={MINI_STROKE}
                          strokeLinecap="round"
                          strokeDasharray={MINI_CIRCUMFERENCE}
                          strokeDashoffset={miniOffset}
                          opacity={lastAttempt ? 1 : 0.25}
                          style={{ transition: "stroke-dashoffset 0.6s ease" }}
                        />
                        {/* Center symbol */}
                        <text
                          x={MINI_SIZE / 2}
                          y={MINI_SIZE / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{
                            transform: `rotate(90deg) translate(0px, -${MINI_SIZE}px)`,
                            transformOrigin: `${MINI_SIZE / 2}px ${MINI_SIZE / 2}px`,
                            fontSize: "13px",
                            fontWeight: "700",
                            fill: lastAttempt
                              ? "oklch(0.6 0.15 145)"
                              : "oklch(0.6 0.04 240)",
                            fontFamily: "inherit",
                          }}
                        >
                          {lastAttempt ? "✓" : "0"}
                        </text>
                      </svg>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    {lastAttempt && pct !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-foreground">
                          {lastAttempt.score.toString()}/
                          {lastAttempt.totalQuestions.toString()}
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            pct >= 70
                              ? "bg-[oklch(0.92_0.08_145)] text-[oklch(0.45_0.12_145)] dark:bg-[oklch(0.3_0.08_145)] dark:text-[oklch(0.8_0.1_145)]"
                              : pct >= 40
                                ? "bg-[oklch(0.93_0.1_75)] text-[oklch(0.5_0.14_75)] dark:bg-[oklch(0.32_0.08_75)] dark:text-[oklch(0.82_0.1_75)]"
                                : "bg-[oklch(0.93_0.08_25)] text-[oklch(0.48_0.14_25)] dark:bg-[oklch(0.3_0.08_25)] dark:text-[oklch(0.82_0.1_25)]"
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">
                        ✨ Not started yet
                      </span>
                    )}
                    <div className="flex gap-2">
                      {lastAttempt ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2 font-semibold hover:bg-muted"
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
                          className={`gap-2 font-bold bg-gradient-to-r ${grad.bg} hover:opacity-90 text-white border-0 shadow-md shadow-black/10 hover:-translate-y-0.5 transition-all duration-200`}
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
