import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  BookOpen,
  Search,
  Lightbulb,
  ArrowRight,
  Check,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSaveOnboardingResponse, useOnboardingResponses } from "@/hooks/useOnboarding";

type PathType = "student_of_knowledge" | "truth_seeker" | null;

const learningGoals = [
  "Quran Memorization",
  "Quran Tafsir",
  "Tajweed",
  "Hadith Studies",
  "Fiqh",
  "Aqeedah",
  "Arabic Language",
  "Islamic History",
  "Spirituality & Tasawwuf",
  "Contemporary Islamic Issues",
];

const levels = ["Beginner", "Intermediate", "Advanced"];

const preferences = [
  "One-on-one sessions",
  "Small group classes",
  "Self-paced with guidance",
  "Intensive courses",
  "Regular weekly sessions",
  "Flexible scheduling",
  "Text-based learning",
  "Visual/audio learning",
];

const timeCommitments = [
  "Less than 1 hour per week",
  "1-2 hours per week",
  "2-5 hours per week",
  "5+ hours per week",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const saveResponse = useSaveOnboardingResponse();
  const { data: existingResponses, isLoading: responsesLoading } = useOnboardingResponses();

  const [pathType, setPathType] = useState<PathType>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [teacherGender, setTeacherGender] = useState("");
  const [language, setLanguage] = useState("English");
  const [timeCommitment, setTimeCommitment] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing responses if user has already started onboarding
  useEffect(() => {
    if (existingResponses && existingResponses.length > 0) {
      existingResponses.forEach((response) => {
        const data = response.response as Record<string, unknown>;
        switch (response.step_key) {
          case "path_type":
            setPathType(data.pathType as PathType);
            break;
          case "learning_goals":
            setSelectedGoals(data.goals as string[] || []);
            break;
          case "level":
            setLevel(data.level as string || "");
            break;
          case "preferences":
            setSelectedPreferences(data.preferences as string[] || []);
            break;
          case "teacher_preferences":
            setTeacherGender(data.teacherGender as string || "");
            setLanguage(data.language as string || "English");
            break;
          case "time_commitment":
            setTimeCommitment(data.timeCommitment as string || "");
            break;
          case "additional_notes":
            setAdditionalNotes(data.notes as string || "");
            break;
        }
      });
    }
  }, [existingResponses]);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else if (selectedGoals.length < 3) {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const togglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save all responses to database
      await Promise.all([
        saveResponse.mutateAsync({
          stepKey: "path_type",
          response: { pathType },
        }),
        saveResponse.mutateAsync({
          stepKey: "learning_goals",
          response: { goals: selectedGoals },
        }),
        saveResponse.mutateAsync({
          stepKey: "level",
          response: { level },
        }),
        saveResponse.mutateAsync({
          stepKey: "preferences",
          response: { preferences: selectedPreferences },
        }),
        saveResponse.mutateAsync({
          stepKey: "teacher_preferences",
          response: { teacherGender, language },
        }),
        saveResponse.mutateAsync({
          stepKey: "time_commitment",
          response: { timeCommitment },
        }),
        saveResponse.mutateAsync({
          stepKey: "additional_notes",
          response: { notes: additionalNotes },
        }),
      ]);

      // Check for stored redirect URL (from Bundle enrollment flow)
      const redirectUrl = sessionStorage.getItem("redirectAfterOnboarding");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterOnboarding");
        navigate(redirectUrl);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to save onboarding responses:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth
  if (authLoading || responsesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not logged in, show prompt to log in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                Start Your Sacred Knowledge Journey
              </h1>
              <p className="text-muted-foreground mb-8">
                Create an account or sign in to begin your personalized learning journey.
              </p>
              <div className="flex flex-col gap-3">
                <Button size="lg" className="w-full" asChild>
                  <Link to="/login">Sign In or Create Account</Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <Link to="/teachers">Browse Teachers First</Link>
                </Button>
              </div>
            </motion.div>
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
        <div className="container-wide max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Welcome to Your Sacred Knowledge Journey
            </h1>
            <p className="mt-4 text-muted-foreground">
              Tell us about yourself so we can match you with the perfect teachers
            </p>
          </motion.div>

          {/* Path Selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Choose Your Path
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setPathType("student_of_knowledge")}
                className={`card-interactive p-6 text-left transition-all ${
                  pathType === "student_of_knowledge"
                    ? "border-2 border-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Recommended for Muslims
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Student of Knowledge
                </h3>
                <p className="text-sm text-muted-foreground">
                  For Muslims seeking to deepen their understanding of Islamic sciences, Quran, Hadith, and spiritual growth.
                </p>
              </button>

              <button
                onClick={() => setPathType("truth_seeker")}
                className={`card-interactive p-6 text-left transition-all ${
                  pathType === "truth_seeker"
                    ? "border-2 border-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                    <Search className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                    Open to all backgrounds
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Truth Seeker
                </h3>
                <p className="text-sm text-muted-foreground">
                  For those exploring Islamic wisdom, spirituality, and ethics from any background or faith tradition.
                </p>
              </button>
            </div>
          </motion.section>

          {/* Learning Goals */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              What are your primary learning goals?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select up to 3 areas you'd like to focus on
            </p>
            <div className="flex flex-wrap gap-3">
              {learningGoals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedGoals.includes(goal)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {selectedGoals.includes(goal) && <Check className="h-4 w-4" />}
                  {goal}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Current Level */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              What's your current level?
            </h2>
            <div className="flex flex-wrap gap-3">
              {levels.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-lg px-6 py-3 text-sm font-medium transition-all ${
                    level === l
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Learning Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Learning Preferences
            </h2>
            <div className="flex flex-wrap gap-3">
              {preferences.map((pref) => (
                <button
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedPreferences.includes(pref)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {selectedPreferences.includes(pref) && <Check className="h-4 w-4" />}
                  {pref}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Teacher Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Teacher Preferences
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Teacher Gender
                </label>
                <select
                  value={teacherGender}
                  onChange={(e) => setTeacherGender(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">No preference</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Malay">Malay</option>
                  <option value="French">French</option>
                  <option value="Turkish">Turkish</option>
                </select>
              </div>
            </div>
          </motion.section>

          {/* Time Commitment */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Weekly Time Commitment
            </h2>
            <div className="flex flex-wrap gap-3">
              {timeCommitments.map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeCommitment(time)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    timeCommitment === time
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Additional Notes */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Anything else we should know?
            </h2>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Tell us about your learning journey, any specific goals, or questions you have..."
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </motion.section>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <Button size="xl" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Find My Perfect Learning Path
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {/* AI Note */}
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground text-left">
                <span className="font-medium text-foreground">Our AI Matching System</span> — Based on your preferences, our AI will match you with the perfect teachers and create personalized learning bundles tailored to your specific needs, goals, and learning style.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Onboarding;
