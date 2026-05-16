import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Fingerprint,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect } from "react";

const ADMIN_FEATURES = [
  "Manage subjects & topics",
  "Create multiple-choice questions",
  "View student results & scores",
  "Set quiz timers per subject",
];

const STUDENT_FEATURES = [
  "Take quizzes by subject",
  "Compete on the leaderboard",
  "Earn completion certificates",
  "Ask the AI doubt assistant",
];

export default function LoginPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, login } = useAuth();
  const role = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && role === "admin") {
      navigate({ to: "/admin/subjects" });
    } else if (isAuthenticated && role === "student") {
      navigate({ to: "/student/quizzes" });
    }
  }, [isAuthenticated, role, navigate]);

  if (isInitializing || (isAuthenticated && role === "loading")) {
    return <LoadingSpinner fullScreen label="Initializing…" />;
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.13 0.04 265) 0%, oklch(0.16 0.07 280) 30%, oklch(0.18 0.09 300) 60%, oklch(0.14 0.05 240) 100%)",
      }}
      data-ocid="login.page"
    >
      {/* Floating decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-20 animate-float"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.28 270) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.22 200) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full opacity-10 animate-spin-slow"
        style={{
          background:
            "conic-gradient(from 0deg, oklch(0.68 0.26 310), oklch(0.55 0.28 270), oklch(0.68 0.26 310))",
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            EduQuiz
          </span>
          <span className="badge-pill bg-white/10 text-white/70 ml-1">
            <Sparkles className="h-3 w-3" />
            Manager
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-3xl space-y-10">
          {/* Title block */}
          <div className="text-center space-y-5 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 badge-pill bg-white/10 text-white/80 border border-white/20 text-sm">
              <Star className="h-3.5 w-3.5 text-yellow-300" />
              Student Management System
              <Star className="h-3.5 w-3.5 text-yellow-300" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Learn smarter,
              <br />
              <span className="gradient-text-vivid">test better.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
              Manage subjects, create quizzes, earn certificates and track
              student progress — all in one beautiful platform.
            </p>
          </div>

          {/* Role cards */}
          <div
            className="grid md:grid-cols-2 gap-5"
            style={{ animationDelay: "100ms" }}
          >
            {/* Admin card */}
            <div className="glass-card rounded-2xl p-6 card-elevated hover:scale-[1.02] transition-smooth group">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shadow-glow shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.25 270) 0%, oklch(0.48 0.28 295) 100%)",
                  }}
                >
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-base">
                    Admin Access
                  </h2>
                  <p className="text-white/50 text-xs">Manage & oversee</p>
                </div>
                <Zap className="h-4 w-4 text-yellow-300/70 ml-auto group-hover:text-yellow-300 transition-colors" />
              </div>
              <ul className="space-y-2">
                {ADMIN_FEATURES.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-white/65"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Student card */}
            <div
              className="glass-card rounded-2xl p-6 card-elevated hover:scale-[1.02] transition-smooth group"
              style={{ animationDelay: "80ms" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.58 0.22 200) 0%, oklch(0.50 0.24 220) 100%)",
                    boxShadow: "0 0 16px 2px oklch(0.55 0.22 200 / 0.30)",
                  }}
                >
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-base">
                    Student Access
                  </h2>
                  <p className="text-white/50 text-xs">Learn & compete</p>
                </div>
                <Star className="h-4 w-4 text-cyan-300/70 ml-auto group-hover:text-cyan-300 transition-colors" />
              </div>
              <ul className="space-y-2">
                {STUDENT_FEATURES.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-white/65"
                  >
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div
            className="flex flex-col items-center gap-3 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <Button
              type="button"
              size="lg"
              className="gap-2.5 px-10 font-display font-bold text-base h-14 rounded-2xl gradient-primary text-white border-0 shadow-glow animate-pulse-glow hover:opacity-90 transition-smooth"
              onClick={login}
              disabled={isInitializing || isLoggingIn}
              data-ocid="login.sign_in_button"
            >
              <Fingerprint className="h-5 w-5" />
              {isLoggingIn ? "Connecting…" : "Sign in with Internet Identity"}
            </Button>
            <p className="text-center text-xs text-white/35">
              The first user to sign in automatically becomes admin.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
