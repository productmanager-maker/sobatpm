import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import OnboardingPage from "./pages/Onboarding";
import AppLayout from "./components/app/AppLayout";
import PageEditor from "./components/editor/PageEditor";
import PublicShare from "./pages/PublicShare";
import FilteredPagesView from "./pages/FilteredPagesView";
import RemindersPage from "./pages/RemindersPage";
import NotificationsPage from "./pages/NotificationsPage";
import TemplatesPage from "./pages/TemplatesPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import WorkspaceSettingsPage from "./pages/WorkspaceSettingsPage";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

const PrdBuilderPage = lazy(() => import("./pages/PrdBuilderPage"));
const SuperAdminPage = lazy(() => import("./pages/SuperAdminPage"));
const AboutNyeratPage = lazy(() => import("./pages/AboutNyeratPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/share/:shareToken" element={<PublicShare />} />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute requireOnboarded={false}>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<PageEditor />} />
                <Route path="settings/profile" element={<ProfileSettingsPage />} />
                <Route path=":workspaceSlug" element={<PageEditor />} />
                <Route path=":workspaceSlug/settings" element={<WorkspaceSettingsPage />} />
                <Route path=":workspaceSlug/reminders" element={<RemindersPage />} />
                <Route path=":workspaceSlug/notifications" element={<NotificationsPage />} />
                <Route path=":workspaceSlug/templates" element={<TemplatesPage />} />
                <Route
                  path=":workspaceSlug/prd-builder"
                  element={
                    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading PRD Builder...</div>}>
                      <PrdBuilderPage />
                    </Suspense>
                  }
                />
                <Route
                  path=":workspaceSlug/superadmin"
                  element={
                    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
                      <SuperAdminPage />
                    </Suspense>
                  }
                />
                <Route
                  path=":workspaceSlug/about"
                  element={
                    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
                      <AboutNyeratPage />
                    </Suspense>
                  }
                />
                <Route path=":workspaceSlug/tag/:tagId" element={<FilteredPagesView variant="tag" />} />
                <Route path=":workspaceSlug/notebook/:notebookId" element={<FilteredPagesView variant="notebook" />} />
                <Route path=":workspaceSlug/:pageId" element={<PageEditor />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
