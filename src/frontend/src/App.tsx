import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy page imports
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const AdminSubjectsPage = lazy(() => import("@/pages/admin/SubjectsPage"));
const AdminQuestionsPage = lazy(() => import("@/pages/admin/QuestionsPage"));
const AdminResultsPage = lazy(() => import("@/pages/admin/ResultsPage"));
const StudentQuizzesPage = lazy(() => import("@/pages/student/QuizzesPage"));
const StudentQuizPage = lazy(() => import("@/pages/student/QuizPage"));
const StudentHistoryPage = lazy(() => import("@/pages/student/HistoryPage"));

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <LoginPage />
    </Suspense>
  ),
});

// Admin routes
const adminSubjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/subjects",
  component: () => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <AdminSubjectsPage />
    </Suspense>
  ),
});

const adminQuestionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/questions",
  component: () => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <AdminQuestionsPage />
    </Suspense>
  ),
});

const adminResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/results",
  component: () => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <AdminResultsPage />
    </Suspense>
  ),
});

// Student routes
const studentQuizzesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/quizzes",
  component: () => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <StudentQuizzesPage />
    </Suspense>
  ),
});

const studentQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/quiz/$subjectId",
  component: () => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <StudentQuizPage />
    </Suspense>
  ),
});

const studentHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student/history",
  component: () => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <StudentHistoryPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminSubjectsRoute,
  adminQuestionsRoute,
  adminResultsRoute,
  studentQuizzesRoute,
  studentQuizRoute,
  studentHistoryRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
