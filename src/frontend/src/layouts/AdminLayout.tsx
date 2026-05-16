import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Trophy,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { label: "Subjects", path: "/admin/subjects", icon: BookOpen },
  { label: "Questions", path: "/admin/questions", icon: HelpCircle },
  { label: "Results", path: "/admin/results", icon: BarChart3 },
  { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 gradient-sidebar-admin flex flex-col shrink-0 shadow-xl">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow shrink-0">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-base text-white truncate tracking-tight">
                EduQuiz
              </p>
              <Badge
                variant="secondary"
                className="text-xs px-2 py-0.5 h-5 mt-0.5 bg-white/15 text-white/90 border-0 hover:bg-white/15"
              >
                Admin
              </Badge>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              data-ocid="admin.theme_toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Nav */}
        <nav
          className="flex-1 px-3 py-5 space-y-1"
          aria-label="Admin navigation"
        >
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = currentPath.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold animate-fade-in-up nav-item-hover ${
                  isActive
                    ? "nav-item-active"
                    : "text-white/65 hover:text-white"
                }`}
                data-ocid={`admin.nav.${item.label.toLowerCase()}_link`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/10 mb-1" />

        {/* Logout */}
        <div className="px-3 py-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-3 text-white/55 hover:text-red-300 hover:bg-red-500/15 text-sm font-medium rounded-xl"
            onClick={logout}
            data-ocid="admin.logout_button"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 zone-content">{children}</main>
        <footer className="bg-muted/40 border-t border-border px-6 py-3 text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
