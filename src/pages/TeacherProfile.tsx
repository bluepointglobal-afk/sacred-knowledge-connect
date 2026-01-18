import { useParams, Link } from "react-router-dom";
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
  GraduationCap,
} from "lucide-react";
import { useTeacher } from "@/hooks/useTeachers";
import { useBundlesByTeacher } from "@/hooks/useBundles";

const TeacherProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: teacher, isLoading: teacherLoading, error: teacherError } = useTeacher(id);
  const { data: bundles, isLoading: bundlesLoading } = useBundlesByTeacher(id);

  const isLoading = teacherLoading || bundlesLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading teacher profile...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or not found state
  if (teacherError || !teacher) {
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
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                Teacher Not Found
              </h1>
              <p className="text-muted-foreground mb-8">
                This teacher profile doesn't exist or may have been removed.
              </p>
              <Button asChild>
                <Link to="/teachers">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse All Teachers
                </Link>
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const profile = teacher.profiles;
  const teacherName = profile?.full_name || profile?.email?.split("@")[0] || "Teacher";

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
              <Link to="/teachers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Teachers
              </Link>
            </Button>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Profile Header */}
              <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground text-4xl font-semibold shrink-0">
                    {teacherName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="font-display text-2xl font-bold text-foreground">
                        {teacherName}
                      </h1>
                      {teacher.is_verified && (
                        <Shield className="h-5 w-5 text-accent" />
                      )}
                      {teacher.is_featured && (
                        <Badge className="bg-secondary text-secondary-foreground">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground mb-4">
                      {teacher.headline || "Islamic Studies Teacher"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      {teacher.average_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="font-medium">{teacher.average_rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">
                            ({teacher.total_sessions} sessions)
                          </span>
                        </div>
                      )}
                      {teacher.years_experience > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          {teacher.years_experience} years experience
                        </div>
                      )}
                      {teacher.total_students > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {teacher.total_students} students
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {teacher.bio && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                    About
                  </h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {teacher.bio}
                  </p>
                </div>
              )}

              {/* Specializations */}
              {teacher.specializations && teacher.specializations.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                    Specializations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-sm">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Qualifications */}
              {teacher.qualifications && teacher.qualifications.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                    Qualifications
                  </h2>
                  <ul className="space-y-2">
                    {teacher.qualifications.map((qual, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4 mt-1 shrink-0 text-primary" />
                        {qual}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Teacher's Bundles */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Learning Bundles by {teacherName.split(" ")[0]}
                </h2>

                {bundles && bundles.length > 0 ? (
                  <div className="space-y-4">
                    {bundles.map((bundle) => (
                      <div
                        key={bundle.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {bundle.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {bundle.short_description || bundle.description}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {bundle.duration_weeks} weeks
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {bundle.total_sessions} sessions
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {bundle.level}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-foreground">
                            ${Math.round(bundle.price_cents / 100)}
                          </span>
                          <Button size="sm" asChild>
                            <Link to={`/bundles/${bundle.id}`}>View Bundle</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No bundles available from this teacher yet.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Quick Contact Card */}
              <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Book a Session
                </h3>

                {teacher.hourly_rate_cents > 0 && (
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">
                      ${Math.round(teacher.hourly_rate_cents / 100)}
                    </span>
                    <span className="text-muted-foreground"> / hour</span>
                  </div>
                )}

                <Button className="w-full mb-3" asChild>
                  <Link to={bundles && bundles.length > 0 ? `/bundles/${bundles[0].id}` : "/bundles"}>
                    {bundles && bundles.length > 0 ? "View First Bundle" : "Browse Bundles"}
                  </Link>
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Start with a bundle to begin learning
                </p>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Sessions</span>
                    <span className="font-medium text-foreground">{teacher.total_sessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Students</span>
                    <span className="font-medium text-foreground">{teacher.total_students}</span>
                  </div>
                  {teacher.average_rating > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Average Rating</span>
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 fill-secondary text-secondary" />
                        {teacher.average_rating.toFixed(1)}
                      </span>
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

export default TeacherProfile;
