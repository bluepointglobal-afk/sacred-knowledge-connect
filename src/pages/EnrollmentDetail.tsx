import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  Shield,
  Clock,
  Calendar,
  BookOpen,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Video,
  Plus,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollmentById } from "@/hooks/useEnrollments";
import {
  useSessionsByEnrollment,
  useCreateSession,
  useUpdateSession,
  useCreateFeedback,
} from "@/hooks/useSessions";
import { useProfile } from "@/hooks/useProfile";

const EnrollmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile } = useProfile();

  const {
    data: enrollment,
    isLoading: enrollmentLoading,
    error: enrollmentError,
  } = useEnrollmentById(id);
  const { data: sessions, isLoading: sessionsLoading } =
    useSessionsByEnrollment(id);

  // Mutations
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const createFeedback = useCreateFeedback();

  // Modal states
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [zoomLinkOpen, setZoomLinkOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  // Form states
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState(60);
  const [zoomLink, setZoomLink] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

  const isLoading = authLoading || enrollmentLoading;

  // Check if current user is the teacher for this bundle
  const isTeacher = useMemo(() => {
    if (!enrollment || !profile) return false;
    return (
      enrollment.bundles.teacher_profiles.user_id === user?.id ||
      profile.role === "teacher"
    );
  }, [enrollment, profile, user?.id]);

  // Separate sessions into upcoming and past
  const { upcomingSessions, pastSessions } = useMemo(() => {
    if (!sessions)
      return { upcomingSessions: [], pastSessions: [] };

    const now = new Date();
    const upcoming = sessions.filter(
      (s) => new Date(s.scheduled_at) > now && s.status === "scheduled"
    );
    const past = sessions.filter(
      (s) => new Date(s.scheduled_at) <= now || s.status !== "scheduled"
    );

    return {
      upcomingSessions: upcoming.sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime()
      ),
      pastSessions: past.sort(
        (a, b) =>
          new Date(b.scheduled_at).getTime() -
          new Date(a.scheduled_at).getTime()
      ),
    };
  }, [sessions]);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    navigate("/login");
    return null;
  }

  // Loading state
  if (isLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading enrollment...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (enrollmentError || !enrollment) {
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
                Enrollment Not Found
              </h1>
              <p className="text-muted-foreground mb-8">
                This enrollment doesn't exist or you don't have access.
              </p>
              <Button asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const bundle = enrollment.bundles;
  const teacherProfile = bundle.teacher_profiles;
  const teacherUser = teacherProfile.profiles;
  const teacherName =
    teacherUser?.full_name || teacherUser?.email?.split("@")[0] || "Teacher";

  // Handlers
  const handleScheduleSession = async () => {
    if (!scheduleDate || !scheduleTime) return;

    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();

    try {
      await createSession.mutateAsync({
        enrollmentId: enrollment.id,
        teacherId: teacherProfile.id,
        bundleId: bundle.id,
        scheduledAt,
        durationMinutes: scheduleDuration,
      });
      setScheduleOpen(false);
      setScheduleDate("");
      setScheduleTime("");
    } catch (error) {
      console.error("Failed to schedule session:", error);
    }
  };

  const handleAddZoomLink = async () => {
    if (!selectedSessionId || !zoomLink) return;

    try {
      await updateSession.mutateAsync({
        sessionId: selectedSessionId,
        meetingUrl: zoomLink,
      });
      setZoomLinkOpen(false);
      setZoomLink("");
      setSelectedSessionId(null);
    } catch (error) {
      console.error("Failed to add zoom link:", error);
    }
  };

  const handleMarkComplete = async (sessionId: string) => {
    try {
      await updateSession.mutateAsync({
        sessionId,
        status: "completed",
      });
    } catch (error) {
      console.error("Failed to mark session complete:", error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSessionId) return;

    try {
      await createFeedback.mutateAsync({
        sessionId: selectedSessionId,
        teacherId: teacherProfile.user_id,
        rating: feedbackRating,
        reviewText: feedbackText || undefined,
      });
      setFeedbackOpen(false);
      setFeedbackRating(5);
      setFeedbackText("");
      setSelectedSessionId(null);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

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
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
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
                  <Badge
                    variant={
                      enrollment.status === "active" ? "default" : "secondary"
                    }
                  >
                    {enrollment.status}
                  </Badge>
                  {bundle.category && (
                    <Badge className="bg-primary/10 text-primary">
                      {bundle.category}
                    </Badge>
                  )}
                  <Badge variant="outline">{bundle.level}</Badge>
                </div>

                <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {bundle.title}
                </h1>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {enrollment.progress_percent}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${enrollment.progress_percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {enrollment.sessions_completed} of {bundle.total_sessions}{" "}
                    sessions completed
                  </p>
                </div>

                {/* Teacher Info */}
                <Link
                  to={`/teachers/${teacherProfile.id}`}
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
                      {teacherProfile.is_verified && (
                        <Shield className="h-4 w-4 text-accent shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {teacherProfile.headline || "Islamic Studies Teacher"}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Upcoming Sessions */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Sessions
                  </h2>
                  {!isTeacher && enrollment.status === "active" && (
                    <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule a Session</DialogTitle>
                          <DialogDescription>
                            Choose a date and time for your next session with{" "}
                            {teacherName}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={scheduleDuration}
                              onChange={(e) =>
                                setScheduleDuration(Number(e.target.value))
                              }
                              min={15}
                              max={180}
                              step={15}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setScheduleOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleScheduleSession}
                            disabled={
                              createSession.isPending ||
                              !scheduleDate ||
                              !scheduleTime
                            }
                          >
                            {createSession.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Scheduling...
                              </>
                            ) : (
                              "Schedule Session"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {formatDate(session.scheduled_at)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(session.scheduled_at)} •{" "}
                            {session.duration_minutes} min
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.meeting_url ? (
                            <Button size="sm" asChild>
                              <a
                                href={session.meeting_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Join Session
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          ) : isTeacher ? (
                            <Dialog
                              open={zoomLinkOpen && selectedSessionId === session.id}
                              onOpenChange={(open) => {
                                setZoomLinkOpen(open);
                                if (open) setSelectedSessionId(session.id);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Video className="h-4 w-4 mr-1" />
                                  Add Zoom Link
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Meeting Link</DialogTitle>
                                  <DialogDescription>
                                    Paste your Zoom or meeting link for this
                                    session.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Label htmlFor="zoomLink">Meeting URL</Label>
                                  <Input
                                    id="zoomLink"
                                    type="url"
                                    placeholder="https://zoom.us/j/..."
                                    value={zoomLink}
                                    onChange={(e) => setZoomLink(e.target.value)}
                                    className="mt-2"
                                  />
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setZoomLinkOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleAddZoomLink}
                                    disabled={
                                      updateSession.isPending || !zoomLink
                                    }
                                  >
                                    {updateSession.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Save Link"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Waiting for link
                            </Badge>
                          )}
                          {isTeacher && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleMarkComplete(session.id)}
                              disabled={updateSession.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No upcoming sessions scheduled
                    </p>
                    {!isTeacher && enrollment.status === "active" && (
                      <Button
                        className="mt-4"
                        onClick={() => setScheduleOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Schedule Your First Session
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Past Sessions */}
              {pastSessions.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Past Sessions
                  </h2>
                  <div className="space-y-4">
                    {pastSessions.map((session) => {
                      const hasFeedback =
                        session.feedback && session.feedback.length > 0;
                      const canLeaveFeedback =
                        !isTeacher &&
                        session.status === "completed" &&
                        !hasFeedback;

                      return (
                        <div
                          key={session.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-foreground">
                                {formatDate(session.scheduled_at)}
                              </p>
                              <Badge
                                variant={
                                  session.status === "completed"
                                    ? "default"
                                    : session.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {session.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(session.scheduled_at)} •{" "}
                              {session.duration_minutes} min
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasFeedback ? (
                              <div className="flex items-center gap-1 text-sm">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < (session.feedback?.[0]?.rating || 0)
                                        ? "fill-secondary text-secondary"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : canLeaveFeedback ? (
                              <Dialog
                                open={
                                  feedbackOpen &&
                                  selectedSessionId === session.id
                                }
                                onOpenChange={(open) => {
                                  setFeedbackOpen(open);
                                  if (open) setSelectedSessionId(session.id);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Leave Feedback
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Session Feedback</DialogTitle>
                                    <DialogDescription>
                                      Rate your session and share your
                                      experience.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>Rating</Label>
                                      <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                              setFeedbackRating(star)
                                            }
                                            className="p-1"
                                          >
                                            <Star
                                              className={`h-8 w-8 transition-colors ${
                                                star <= feedbackRating
                                                  ? "fill-secondary text-secondary"
                                                  : "text-muted-foreground hover:text-secondary"
                                              }`}
                                            />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="feedbackText">
                                        Your Review (optional)
                                      </Label>
                                      <textarea
                                        id="feedbackText"
                                        value={feedbackText}
                                        onChange={(e) =>
                                          setFeedbackText(e.target.value)
                                        }
                                        placeholder="Share your experience..."
                                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setFeedbackOpen(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleSubmitFeedback}
                                      disabled={createFeedback.isPending}
                                    >
                                      {createFeedback.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        "Submit Feedback"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
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
              {/* Bundle Stats Card */}
              <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Bundle Details
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">
                      {bundle.duration_weeks} weeks
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Sessions</span>
                    <span className="font-medium text-foreground">
                      {bundle.total_sessions}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium text-foreground">
                      {enrollment.sessions_completed}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium text-foreground">
                      {bundle.level}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Started</span>
                    <span className="font-medium text-foreground">
                      {new Date(enrollment.started_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button className="w-full" variant="outline" asChild>
                    <Link to={`/bundles/${bundle.id}`}>View Bundle Details</Link>
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Your Progress
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-primary">
                      {upcomingSessions.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-accent">
                      {pastSessions.filter((s) => s.status === "completed").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
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

export default EnrollmentDetail;
