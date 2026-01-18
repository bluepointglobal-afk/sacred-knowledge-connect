import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Settings,
  User,
  ChevronRight,
  Loader2,
  Clock,
  Target,
  Star,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useOnboardingResponses } from "@/hooks/useOnboarding";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useUpcomingSessions } from "@/hooks/useSessions";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: onboardingResponses, isLoading: onboardingLoading } = useOnboardingResponses();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: upcomingSessions, isLoading: sessionsLoading } = useUpcomingSessions(3);

  // Extract learning goals from onboarding responses
  const learningGoals = useMemo(() => {
    if (!onboardingResponses) return [];
    const goalsResponse = onboardingResponses.find((r) => r.step_key === "learning_goals");
    if (goalsResponse) {
      const data = goalsResponse.response as Record<string, unknown>;
      return (data.goals as string[]) || [];
    }
    return [];
  }, [onboardingResponses]);

  // Check if user has completed onboarding
  const hasCompletedOnboarding = onboardingResponses && onboardingResponses.length > 0;

  // Compute stats from real data
  const stats = useMemo(() => {
    if (!enrollments) return { enrolled: 0, completed: 0, sessionsCompleted: 0 };

    const activeEnrollments = enrollments.filter((e) => e.status === "active");
    const completedEnrollments = enrollments.filter((e) => e.status === "completed");
    const totalSessionsCompleted = enrollments.reduce((acc, e) => acc + (e.sessions_completed || 0), 0);

    return {
      enrolled: activeEnrollments.length,
      completed: completedEnrollments.length,
      sessionsCompleted: totalSessionsCompleted,
    };
  }, [enrollments]);

  const isLoading = authLoading || profileLoading || onboardingLoading || enrollmentsLoading || sessionsLoading;

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    navigate("/login?redirect=/dashboard");
    return null;
  }

  // Redirect to onboarding if not completed (after onboarding data loads)
  if (!onboardingLoading && !hasCompletedOnboarding && user) {
    navigate("/onboarding");
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-16">
        <div className="container-wide">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Continue your journey of sacred knowledge
            </p>
          </motion.div>

          {/* Onboarding Prompt (if not completed) */}
          {!hasCompletedOnboarding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 p-6 lg:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Complete Your Learning Profile
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Tell us about your learning goals so we can personalize your experience
                  </p>
                </div>
                <Button asChild>
                  <Link to="/onboarding">
                    Get Started
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10"
          >
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Enrolled Bundles</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.enrolled}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                  <Calendar className="h-5 w-5 text-secondary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Sessions Done</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.sessionsCompleted}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Hours Learned</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{Math.round(stats.sessionsCompleted * 0.75)}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                  <GraduationCap className="h-5 w-5 text-gold" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Completed</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Learning Goals */}
              {learningGoals.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Your Learning Goals
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {learningGoals.map((goal) => (
                      <Badge key={goal} variant="secondary" className="text-sm">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-4" asChild>
                    <Link to="/onboarding">Update Goals</Link>
                  </Button>
                </div>
              )}

              {/* My Enrollments - Real Data */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  My Learning Bundles
                </h2>

                {enrollments && enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => {
                      const bundle = enrollment.bundles;
                      const teacherProfile = bundle?.teacher_profiles;
                      const teacherUser = teacherProfile?.profiles;
                      const teacherName = teacherUser?.full_name || teacherUser?.email?.split("@")[0] || "Teacher";

                      return (
                        <div
                          key={enrollment.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                              <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground mb-1 truncate">
                                {bundle?.title || "Bundle"}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                  {teacherName.charAt(0).toUpperCase()}
                                </div>
                                <span>{teacherName}</span>
                                {teacherProfile?.is_verified && (
                                  <Shield className="h-3 w-3 text-accent" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <Badge
                                  variant={enrollment.status === "active" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {enrollment.status}
                                </Badge>
                                <span className="text-muted-foreground">
                                  {enrollment.progress_percent || 0}% complete
                                </span>
                                <span className="text-muted-foreground">
                                  {enrollment.sessions_completed || 0}/{bundle?.total_sessions || 0} sessions
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/enrollments/${enrollment.id}`}>
                              Continue
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      You haven't enrolled in any bundles yet
                    </p>
                    <Button asChild>
                      <Link to="/bundles">Browse Bundles</Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Upcoming Sessions - Real Data */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-secondary" />
                  Upcoming Sessions
                </h2>
                {upcomingSessions && upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => {
                      const teacherProfile = session.teacher_profiles;
                      const teacherUser = teacherProfile?.profiles;
                      const teacherName = teacherUser?.full_name || teacherUser?.email?.split("@")[0] || "Teacher";
                      const sessionDate = new Date(session.scheduled_at);

                      return (
                        <div
                          key={session.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
                              <Calendar className="h-6 w-6 text-secondary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground mb-1 truncate">
                                {session.bundles?.title || "Session"}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-1">
                                with {teacherName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {sessionDate.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })} at {sessionDate.toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          {session.meeting_url ? (
                            <Button size="sm" asChild>
                              <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                                Join
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Link pending
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      No upcoming sessions scheduled
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/bundles">Browse Bundles</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {profile?.full_name || "Set your name"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{profile?.role || "Student"}</Badge>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/teachers">
                      <User className="h-4 w-4 mr-2" />
                      Browse Teachers
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/bundles">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explore Bundles
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/onboarding">
                      <Target className="h-4 w-4 mr-2" />
                      Update Preferences
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Featured Teacher Preview */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-secondary" />
                  Featured Teacher
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Sheikh Ahmad Ibrahim</p>
                    <p className="text-xs text-muted-foreground">Quran & Tajweed</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link to="/teachers">View All Teachers</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
