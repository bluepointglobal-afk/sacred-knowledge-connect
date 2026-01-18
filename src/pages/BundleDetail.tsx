import { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Shield,
  Clock,
  Calendar,
  BookOpen,
  Users,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBundle } from "@/hooks/useBundles";
import { useEnrollment, useCreateEnrollment } from "@/hooks/useEnrollments";
import { useOnboardingResponses } from "@/hooks/useOnboarding";

const BundleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const { data: bundle, isLoading: bundleLoading, error: bundleError } = useBundle(id);
  const { data: existingEnrollment, isLoading: enrollmentLoading } = useEnrollment(id);
  const { data: onboardingResponses, isLoading: onboardingLoading } = useOnboardingResponses();
  const createEnrollment = useCreateEnrollment();

  const [enrollError, setEnrollError] = useState<string | null>(null);

  const isLoading = bundleLoading || authLoading;
  const hasCompletedOnboarding = onboardingResponses && onboardingResponses.length > 0;
  const isAlreadyEnrolled = existingEnrollment?.status === "active";

  // Current URL for redirects
  const currentPath = location.pathname;

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!hasCompletedOnboarding) {
      // Store redirect in sessionStorage for onboarding (which is multi-step)
      sessionStorage.setItem("redirectAfterOnboarding", currentPath);
      navigate("/onboarding");
      return;
    }

    if (!id) return;

    setEnrollError(null);

    try {
      await createEnrollment.mutateAsync({ bundleId: id });
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Already enrolled in this bundle") {
          navigate("/dashboard");
        } else {
          setEnrollError(error.message);
        }
      } else {
        setEnrollError("Failed to enroll. Please try again.");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading bundle details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or not found state
  if (bundleError || !bundle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                Bundle Not Found
              </h1>
              <p className="text-muted-foreground mb-8">
                This learning bundle doesn't exist or may have been removed.
              </p>
              <Button asChild>
                <Link to="/bundles">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse All Bundles
                </Link>
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const teacherProfile = bundle.teacher_profiles;
  const profile = teacherProfile?.profiles;
  const teacherName = profile?.full_name || profile?.email?.split("@")[0] || "Teacher";
  const priceUSD = Math.round(bundle.price_cents / 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-16">
        <div className="container-wide">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/bundles">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Bundles
              </Link>
            </Button>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Bundle Header */}
              <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {bundle.category && (
                    <Badge className="bg-primary/10 text-primary">
                      {bundle.category}
                    </Badge>
                  )}
                  <Badge variant="outline">{bundle.level}</Badge>
                  {bundle.is_featured && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {bundle.title}
                </h1>

                {bundle.short_description && (
                  <p className="text-lg text-muted-foreground mb-6">
                    {bundle.short_description}
                  </p>
                )}

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>
                      <strong>{bundle.duration_weeks}</strong> weeks
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>
                      <strong>{bundle.total_sessions}</strong> sessions
                    </span>
                  </div>
                  {bundle.max_students && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>
                        Max <strong>{bundle.max_students}</strong> students
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {bundle.description && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                    About This Bundle
                  </h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="whitespace-pre-line">{bundle.description}</p>
                  </div>
                </div>
              )}

              {/* What's Included */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  What's Included
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {bundle.total_sessions} live sessions with {teacherName}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {bundle.duration_weeks} weeks of structured learning
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Progress tracking and personalized feedback
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Certificate of completion
                    </span>
                  </li>
                </ul>
              </div>

              {/* Tags */}
              {bundle.tags && bundle.tags.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                    Topics Covered
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {bundle.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Enrollment Card */}
              <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    ${priceUSD}
                  </span>
                  <span className="text-muted-foreground"> USD</span>
                </div>

                {enrollError && (
                  <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{enrollError}</p>
                  </div>
                )}

                {isAlreadyEnrolled ? (
                  <>
                    <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-sm text-accent">You are enrolled in this bundle!</p>
                    </div>
                    <Button className="w-full" asChild>
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleEnroll}
                      disabled={createEnrollment.isPending || enrollmentLoading || onboardingLoading}
                    >
                      {createEnrollment.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enrolling...
                        </>
                      ) : !user ? (
                        "Sign In to Enroll"
                      ) : !hasCompletedOnboarding ? (
                        "Complete Profile to Enroll"
                      ) : (
                        "Enroll Now"
                      )}
                    </Button>

                    {!user && (
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        You'll need to sign in or create an account
                      </p>
                    )}

                    {user && !hasCompletedOnboarding && !onboardingLoading && (
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        Complete your learning profile first
                      </p>
                    )}
                  </>
                )}

                {/* Teacher Mini Card */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    Your Teacher
                  </p>
                  <Link
                    to={`/teachers/${teacherProfile?.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                      {teacherName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">
                          {teacherName}
                        </p>
                        {teacherProfile?.is_verified && (
                          <Shield className="h-4 w-4 text-accent shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {teacherProfile?.headline || "Islamic Studies Teacher"}
                      </p>
                      {teacherProfile?.average_rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-secondary text-secondary" />
                          <span className="text-xs text-muted-foreground">
                            {teacherProfile.average_rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Bundle Stats */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">{bundle.duration_weeks} weeks</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-medium text-foreground">{bundle.total_sessions} total</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium text-foreground">{bundle.level}</span>
                  </div>
                  {bundle.total_enrollments > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Enrolled</span>
                      <span className="font-medium text-foreground">{bundle.total_enrollments} students</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BundleDetail;
