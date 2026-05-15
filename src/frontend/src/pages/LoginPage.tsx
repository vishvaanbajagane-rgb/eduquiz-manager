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
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  Fingerprint,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";

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

  const features = [
    {
      icon: ShieldCheck,
      role: "Admin",
      color: "bg-primary/10 text-primary",
      items: [
        "Manage subjects & topics",
        "Create multiple-choice questions",
        "View student results",
      ],
    },
    {
      icon: BookOpen,
      role: "Student",
      color: "bg-accent/10 text-accent",
      items: [
        "Take quizzes by subject",
        "Review quiz history",
        "Track your progress",
      ],
    },
  ];

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="login.page"
    >
      {/* Header */}
      <header className="zone-header">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-foreground">
            EduManage
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-3xl space-y-10">
          {/* Title block */}
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
              <ClipboardCheck className="h-3 w-3" />
              Student Management System
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Learn smarter,
              <br />
              <span className="text-primary">test better.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Manage subjects, create quizzes, and track student progress — all
              in one place.
            </p>
          </div>

          {/* Role cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.role} className="zone-section border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${f.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-display">
                          {f.role} Access
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Sign in as {f.role.toLowerCase()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1.5">
                      {f.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <Button
              type="button"
              size="lg"
              className="gap-2 px-8 font-display font-semibold text-base h-12"
              onClick={login}
              disabled={isInitializing || isLoggingIn}
              data-ocid="login.sign_in_button"
            >
              <Fingerprint className="h-5 w-5" />
              {isLoggingIn ? "Connecting…" : "Sign in with Internet Identity"}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            The first user to sign in automatically becomes admin.
          </p>
        </div>
      </main>
    </div>
  );
}
