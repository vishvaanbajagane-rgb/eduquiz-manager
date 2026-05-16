import { createActor } from "@/backend";
import type { LeaderboardEntry } from "@/backend";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { AdminLayout } from "@/layouts/AdminLayout";
import { StudentLayout } from "@/layouts/StudentLayout";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Crown, Medal, Trophy, Users } from "lucide-react";
import { useEffect } from "react";

const RANK_COLOR: Record<number, string> = {
  1: "oklch(0.85 0.18 90)",
  2: "oklch(0.78 0.04 250)",
  3: "oklch(0.72 0.14 55)",
};

const TOP3_STYLES: Record<
  number,
  { bar: string; row: string; avatar: string; glow: string }
> = {
  1: {
    row: "border-[oklch(0.85_0.18_90/0.4)] bg-gradient-to-r from-[oklch(0.78_0.18_85/0.15)] via-[oklch(0.82_0.15_88/0.08)] to-transparent",
    bar: "from-[oklch(0.85_0.18_90)] to-[oklch(0.78_0.18_85)]",
    avatar: "from-[oklch(0.85_0.18_90)] to-[oklch(0.78_0.18_85)]",
    glow: "0 0 20px 4px oklch(0.78 0.18 85 / 0.25)",
  },
  2: {
    row: "border-[oklch(0.72_0.04_250/0.4)] bg-gradient-to-r from-[oklch(0.72_0.04_250/0.12)] via-[oklch(0.78_0.04_250/0.06)] to-transparent",
    bar: "from-[oklch(0.72_0.04_250)] to-[oklch(0.78_0.04_250)]",
    avatar: "from-[oklch(0.72_0.04_250)] to-[oklch(0.78_0.04_250)]",
    glow: "0 0 14px 2px oklch(0.72 0.04 250 / 0.2)",
  },
  3: {
    row: "border-[oklch(0.68_0.14_55/0.4)] bg-gradient-to-r from-[oklch(0.68_0.14_55/0.15)] via-[oklch(0.72_0.12_48/0.08)] to-transparent",
    bar: "from-[oklch(0.68_0.14_55)] to-[oklch(0.72_0.12_48)]",
    avatar: "from-[oklch(0.68_0.14_55)] to-[oklch(0.72_0.12_48)]",
    glow: "0 0 14px 2px oklch(0.72 0.14 55 / 0.25)",
  },
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="relative flex items-center justify-center">
        <Crown
          className="h-7 w-7 drop-shadow-md"
          style={{ color: "oklch(0.85 0.18 90)" }}
          aria-label="1st place"
        />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <Medal
        className="h-6 w-6 drop-shadow-sm"
        style={{ color: "oklch(0.78 0.04 250)" }}
        aria-label="2nd place"
      />
    );
  }
  if (rank === 3) {
    return (
      <Medal
        className="h-6 w-6 drop-shadow-sm"
        style={{ color: "oklch(0.72 0.14 55)" }}
        aria-label="3rd place"
      />
    );
  }
  return (
    <span className="text-sm font-bold tabular-nums text-muted-foreground w-7 text-center inline-block">
      {rank}
    </span>
  );
}

function ScoreBar({
  pct,
  rank,
}: {
  pct: number;
  rank: number;
}) {
  const isTop3 = rank <= 3;
  const gradientClass = isTop3
    ? TOP3_STYLES[rank].bar
    : pct >= 80
      ? "from-primary to-violet-500"
      : pct >= 60
        ? "from-secondary to-amber-400"
        : "from-muted-foreground/40 to-muted-foreground/20";

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-2 bg-muted/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${gradientClass}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <span
        className="text-sm font-bold tabular-nums w-12 text-right shrink-0"
        style={isTop3 ? { color: RANK_COLOR[rank] } : undefined}
      >
        {pct}%
      </span>
    </div>
  );
}

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {SKELETON_ROWS.map((id) => (
        <Skeleton
          key={`skel-${id}-skeleton-row`}
          className="h-16 w-full rounded-xl"
        />
      ))}
    </div>
  );
}

function LeaderboardContent() {
  const { actor, isFetching } = useActor(createActor);

  const { data: entries, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
    refetchInterval: 10_000,
  });

  if (isLoading || isFetching) {
    return <LeaderboardSkeleton />;
  }

  if (!entries || entries.length === 0) {
    return (
      <div
        className="text-center py-24 text-muted-foreground"
        data-ocid="leaderboard.empty_state"
      >
        <div className="h-20 w-20 rounded-2xl gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow">
          <Users className="h-10 w-10 text-white" />
        </div>
        <p className="font-display font-bold text-xl text-foreground">
          No scores yet
        </p>
        <p className="text-sm mt-1.5 text-muted-foreground">
          Complete a quiz to appear on the leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5" data-ocid="leaderboard.list">
      {entries.map((entry, idx) => {
        const rank = Number(entry.rank);
        const pct = Number(entry.averageScore);
        const isTop3 = rank <= 3;
        const s = isTop3 ? TOP3_STYLES[rank] : null;

        return (
          <div
            key={`entry-${idx}-${entry.principal.toString()}`}
            className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-smooth hover:scale-[1.01] ${
              isTop3 && s
                ? s.row
                : "bg-card border-border hover:border-primary/30 hover:shadow-md"
            }`}
            style={isTop3 && s ? { boxShadow: s.glow } : undefined}
            data-ocid={`leaderboard.item.${idx + 1}`}
          >
            {/* Rank */}
            <div className="w-8 flex justify-center shrink-0">
              <RankBadge rank={rank} />
            </div>

            {/* Avatar */}
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 font-display font-extrabold text-sm text-white ${
                isTop3 && s
                  ? `bg-gradient-to-br ${s.avatar}`
                  : "bg-gradient-to-br from-primary to-violet-600"
              }`}
              style={isTop3 && s ? { boxShadow: s.glow } : undefined}
            >
              {entry.displayName.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">
                {entry.displayName}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {Number(entry.totalAttempts)} quiz
                {Number(entry.totalAttempts) !== 1 ? "zes" : ""} completed
              </p>
            </div>

            {/* Score bar */}
            <div className="w-40 shrink-0">
              <ScoreBar pct={pct} rank={rank} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LeaderboardPage() {
  const { isAuthenticated } = useAuth();
  const role = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  const content = (
    <div className="max-w-2xl mx-auto" data-ocid="leaderboard.page">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary shadow-glow mx-auto mb-4 animate-float">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-display text-3xl font-extrabold text-foreground gradient-text">
            Global Leaderboard
          </h1>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
            data-ocid="leaderboard.live_badge"
            aria-label="Updates every 10 seconds"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            Live
          </span>
        </div>
        <p className="text-muted-foreground text-sm mt-1.5">
          Top students ranked by average quiz score
        </p>
      </div>

      {/* Column labels */}
      <div className="flex items-center gap-4 px-5 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        <span className="w-8 text-center">#</span>
        <span className="w-10" />
        <span className="flex-1">Student</span>
        <span className="w-40 text-right">Avg. Score</span>
      </div>

      <LeaderboardContent />
    </div>
  );

  if (role === "admin") {
    return <AdminLayout>{content}</AdminLayout>;
  }
  return <StudentLayout>{content}</StudentLayout>;
}
