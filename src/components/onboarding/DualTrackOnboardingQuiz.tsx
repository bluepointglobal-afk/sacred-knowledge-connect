import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Heart,
  GraduationCap,
  Clock,
  Globe,
  Users,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  BookMarked,
  Compass,
  Lightbulb,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSaveOnboardingResponse, useOnboardingResponses } from "@/hooks/useOnboarding";
import { cn } from "@/lib/utils";

// Persona Types
export type PersonaType = "student_of_knowledge" | "truth_seeker";

// Learning preferences differ by persona
const STUDENT_OF_KNOWLEDGE_GOALS = [
  { id: "quran_memorization", label: "Quran Memorization (Hifz)", icon: BookMarked },
  { id: "quran_tafsir", label: "Quran Tafsir & Commentary", icon: BookOpen },
  { id: "tajweed", label: "Tajweed & Recitation", icon: Star },
  { id: "hadith_studies", label: "Hadith Sciences", icon: BookMarked },
  { id: "fiqh", label: "Islamic Jurisprudence (Fiqh)", icon: GraduationCap },
  { id: "aqeedah", label: "Aqeedah & Theology", icon: Lightbulb },
  { id: "arabic_classical", label: "Classical Arabic", icon: Globe },
  { id: "usul_fiqh", label: "Principles of Fiqh", icon: Compass },
  { id: "tasawwuf", label: "Spirituality & Tasawwuf", icon: Heart },
  { id: "islamic_history", label: "Islamic History & Seerah", icon: BookOpen },
];

const TRUTH_SEEKER_GOALS = [
  { id: "intro_islam", label: "Introduction to Islam", icon: BookOpen },
  { id: "comparative_religion", label: "Comparative Religion", icon: Compass },
  { id: "islamic_ethics", label: "Islamic Ethics & Values", icon: Heart },
  { id: "quran_basics", label: "Reading the Quran (Basics)", icon: BookMarked },
  { id: "arabic_conversational", label: "Conversational Arabic", icon: Globe },
  { id: "muslim_culture", label: "Understanding Muslim Culture", icon: Users },
  { id: "spirituality", label: "Islamic Spirituality", icon: Star },
  { id: "philosophy", label: "Islamic Philosophy", icon: Lightbulb },
  { id: "mindfulness", label: "Islamic Mindfulness Practices", icon: Heart },
  { id: "history_civilization", label: "Islamic Civilization History", icon: GraduationCap },
];

// Student of Knowledge - levels based on traditional Islamic education
const STUDENT_LEVELS = [
  { id: "mubtadi", label: "Mubtadi (Beginner)", description: "New to formal Islamic studies" },
  { id: "mutawassit", label: "Mutawassit (Intermediate)", description: "Some foundational texts completed" },
  { id: "mutaqaddim", label: "Mutaqaddim (Advanced)", description: "Multiple classical texts studied" },
  { id: "talib_ijazah", label: "Talib Ijazah", description: "Seeking formal certification/ijazah" },
];

// Truth Seeker - simpler levels
const SEEKER_LEVELS = [
  { id: "curious", label: "Curious Explorer", description: "Just beginning my exploration" },
  { id: "engaged", label: "Engaged Learner", description: "Some prior exposure to Islam" },
  { id: "dedicated", label: "Dedicated Student", description: "Committed to deeper understanding" },
];

// Learning styles
const LEARNING_STYLES = [
  { id: "structured", label: "Structured Curriculum", description: "Follow a defined syllabus step by step" },
  { id: "flexible", label: "Flexible Topics", description: "Explore based on interest and need" },
  { id: "intensive", label: "Intensive Programs", description: "Deep dive into specific subjects" },
  { id: "casual", label: "Casual Exploration", description: "Learn at a relaxed pace" },
];

// Time commitments
const TIME_COMMITMENTS = [
  { id: "minimal", label: "1-2 hours/week", description: "Light commitment" },
  { id: "moderate", label: "3-5 hours/week", description: "Moderate commitment" },
  { id: "dedicated", label: "6-10 hours/week", description: "Dedicated study" },
  { id: "intensive", label: "10+ hours/week", description: "Intensive immersion" },
];

// Teacher preferences
const TEACHER_PREFERENCES = {
  methodology: [
    { id: "traditional", label: "Traditional (Classical texts & Ijazah chain)" },
    { id: "modern", label: "Modern (Contemporary approaches)" },
    { id: "blended", label: "Blended (Both traditional & modern)" },
  ],
  gender: [
    { id: "any", label: "No preference" },
    { id: "male", label: "Male teacher preferred" },
    { id: "female", label: "Female teacher preferred" },
  ],
  interaction: [
    { id: "one_on_one", label: "One-on-one sessions" },
    { id: "small_group", label: "Small group (2-5 students)" },
    { id: "cohort", label: "Cohort-based halaqah" },
    { id: "flexible", label: "Flexible / Mixed" },
  ],
};

// Languages
const LANGUAGES = [
  "English",
  "Arabic",
  "Urdu",
  "French",
  "Turkish",
  "Bahasa Indonesia",
  "Bahasa Malay",
  "Spanish",
  "German",
  "Other",
];

// Timezones grouped by region
const TIMEZONE_REGIONS = [
  { region: "Americas", zones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Toronto"] },
  { region: "Europe", zones: ["Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Istanbul"] },
  { region: "Middle East", zones: ["Asia/Dubai", "Asia/Riyadh", "Asia/Jerusalem", "Asia/Baghdad"] },
  { region: "Africa", zones: ["Africa/Cairo", "Africa/Tunis", "Africa/Casablanca", "Africa/Lagos"] },
  { region: "South Asia", zones: ["Asia/Karachi", "Asia/Kolkata", "Asia/Dhaka", "Asia/Colombo"] },
  { region: "Southeast Asia", zones: ["Asia/Jakarta", "Asia/Kuala_Lumpur", "Asia/Singapore", "Asia/Bangkok"] },
  { region: "East Asia", zones: ["Asia/Tokyo", "Asia/Shanghai", "Asia/Seoul"] },
  { region: "Oceania", zones: ["Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland"] },
];

interface DualTrackOnboardingQuizProps {
  onComplete?: (data: OnboardingData) => void;
  redirectUrl?: string;
}

export interface OnboardingData {
  persona: PersonaType;
  goals: string[];
  level: string;
  learningStyle: string;
  timeCommitment: string;
  teacherMethodology: string;
  teacherGender: string;
  interactionStyle: string;
  preferredLanguage: string;
  timezone: string;
  additionalNotes: string;
}

const TOTAL_STEPS = 7;

export function DualTrackOnboardingQuiz({ onComplete, redirectUrl }: DualTrackOnboardingQuizProps) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const saveResponse = useSaveOnboardingResponse();
  const { data: existingResponses, isLoading: responsesLoading } = useOnboardingResponses();

  // Quiz state
  const [currentStep, setCurrentStep] = useState(1);
  const [persona, setPersona] = useState<PersonaType | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  const [teacherMethodology, setTeacherMethodology] = useState("");
  const [teacherGender, setTeacherGender] = useState("");
  const [interactionStyle, setInteractionStyle] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [timezone, setTimezone] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect timezone
  useEffect(() => {
    if (!timezone) {
      try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(detected);
      } catch {
        setTimezone("UTC");
      }
    }
  }, [timezone]);

  // Load existing responses
  useEffect(() => {
    if (existingResponses && existingResponses.length > 0) {
      existingResponses.forEach((response) => {
        const data = response.response as Record<string, unknown>;
        switch (response.step_key) {
          case "persona":
            setPersona(data.persona as PersonaType);
            break;
          case "goals":
            setSelectedGoals(data.goals as string[] || []);
            break;
          case "level":
            setLevel(data.level as string || "");
            break;
          case "learning_style":
            setLearningStyle(data.style as string || "");
            break;
          case "time_commitment":
            setTimeCommitment(data.commitment as string || "");
            break;
          case "teacher_preferences":
            setTeacherMethodology(data.methodology as string || "");
            setTeacherGender(data.gender as string || "");
            setInteractionStyle(data.interaction as string || "");
            break;
          case "language_timezone":
            setPreferredLanguage(data.language as string || "English");
            setTimezone(data.timezone as string || "");
            break;
          case "additional":
            setAdditionalNotes(data.notes as string || "");
            break;
        }
      });
    }
  }, [existingResponses]);

  const goals = persona === "student_of_knowledge" ? STUDENT_OF_KNOWLEDGE_GOALS : TRUTH_SEEKER_GOALS;
  const levels = persona === "student_of_knowledge" ? STUDENT_LEVELS : SEEKER_LEVELS;

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goalId));
    } else if (selectedGoals.length < 3) {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return persona !== null;
      case 2: return selectedGoals.length > 0;
      case 3: return level !== "";
      case 4: return learningStyle !== "" && timeCommitment !== "";
      case 5: return teacherMethodology !== "" && interactionStyle !== "";
      case 6: return preferredLanguage !== "" && timezone !== "";
      case 7: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const onboardingData: OnboardingData = {
        persona: persona!,
        goals: selectedGoals,
        level,
        learningStyle,
        timeCommitment,
        teacherMethodology,
        teacherGender,
        interactionStyle,
        preferredLanguage,
        timezone,
        additionalNotes,
      };

      // Save all responses
      await Promise.all([
        saveResponse.mutateAsync({
          stepKey: "persona",
          response: { persona },
        }),
        saveResponse.mutateAsync({
          stepKey: "goals",
          response: { goals: selectedGoals },
        }),
        saveResponse.mutateAsync({
          stepKey: "level",
          response: { level },
        }),
        saveResponse.mutateAsync({
          stepKey: "learning_style",
          response: { style: learningStyle },
        }),
        saveResponse.mutateAsync({
          stepKey: "time_commitment",
          response: { commitment: timeCommitment },
        }),
        saveResponse.mutateAsync({
          stepKey: "teacher_preferences",
          response: { methodology: teacherMethodology, gender: teacherGender, interaction: interactionStyle },
        }),
        saveResponse.mutateAsync({
          stepKey: "language_timezone",
          response: { language: preferredLanguage, timezone },
        }),
        saveResponse.mutateAsync({
          stepKey: "additional",
          response: { notes: additionalNotes },
        }),
      ]);

      if (onComplete) {
        onComplete(onboardingData);
      }

      // Redirect
      const redirect = redirectUrl || sessionStorage.getItem("redirectAfterOnboarding") || "/matching";
      sessionStorage.removeItem("redirectAfterOnboarding");
      navigate(redirect);
    } catch (error) {
      console.error("Failed to save onboarding responses:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading || responsesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Step {currentStep} of {TOTAL_STEPS}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Persona Selection */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Choose Your Path
              </h2>
              <p className="text-muted-foreground">
                Tell us about your journey so we can personalize your experience
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setPersona("student_of_knowledge")}
                className={cn(
                  "relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg",
                  persona === "student_of_knowledge"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50"
                )}
              >
                {persona === "student_of_knowledge" && (
                  <div className="absolute top-4 right-4">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Student of Knowledge
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For Muslims seeking to deepen their understanding through traditional Islamic sciences.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Quran & Hadith
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Fiqh & Aqeedah
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Ijazah Path
                  </span>
                </div>
              </button>

              <button
                onClick={() => setPersona("truth_seeker")}
                className={cn(
                  "relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg",
                  persona === "truth_seeker"
                    ? "border-secondary bg-secondary/5 shadow-md"
                    : "border-border hover:border-secondary/50"
                )}
              >
                {persona === "truth_seeker" && (
                  <div className="absolute top-4 right-4">
                    <Check className="h-5 w-5 text-secondary" />
                  </div>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 mb-4">
                  <Search className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Truth Seeker
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For those exploring Islamic wisdom from any background or faith tradition.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                    Introduction to Islam
                  </span>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                    Ethics & Values
                  </span>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                    Open Exploration
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Learning Goals */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                What would you like to learn?
              </h2>
              <p className="text-muted-foreground">
                Select up to 3 areas you'd like to focus on
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    disabled={!isSelected && selectedGoals.length >= 3}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                      !isSelected && selectedGoals.length >= 3 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{goal.label}</span>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 3: Experience Level */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                What's your current level?
              </h2>
              <p className="text-muted-foreground">
                This helps us match you with the right teachers
              </p>
            </div>

            <RadioGroup value={level} onValueChange={setLevel} className="space-y-3">
              {levels.map((lvl) => (
                <label
                  key={lvl.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    level === lvl.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={lvl.id} />
                  <div>
                    <div className="font-medium">{lvl.label}</div>
                    <div className="text-sm text-muted-foreground">{lvl.description}</div>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </motion.div>
        )}

        {/* Step 4: Learning Style & Time */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                How do you like to learn?
              </h2>
              <p className="text-muted-foreground">
                Tell us about your preferred learning approach
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-3">Learning Style</h3>
              <RadioGroup value={learningStyle} onValueChange={setLearningStyle} className="space-y-3">
                {LEARNING_STYLES.map((style) => (
                  <label
                    key={style.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      learningStyle === style.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={style.id} />
                    <div>
                      <div className="font-medium">{style.label}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-3">Time Commitment</h3>
              <RadioGroup value={timeCommitment} onValueChange={setTimeCommitment} className="space-y-3">
                {TIME_COMMITMENTS.map((time) => (
                  <label
                    key={time.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all",
                      timeCommitment === time.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={time.id} />
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{time.label}</span>
                      <span className="text-sm text-muted-foreground">— {time.description}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        )}

        {/* Step 5: Teacher Preferences */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Teacher Preferences
              </h2>
              <p className="text-muted-foreground">
                Help us find teachers that match your style
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-3">Teaching Methodology</h3>
              <RadioGroup value={teacherMethodology} onValueChange={setTeacherMethodology} className="space-y-3">
                {TEACHER_PREFERENCES.methodology.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all",
                      teacherMethodology === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={method.id} />
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-3">Teacher Gender</h3>
              <RadioGroup value={teacherGender} onValueChange={setTeacherGender} className="space-y-3">
                {TEACHER_PREFERENCES.gender.map((g) => (
                  <label
                    key={g.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all",
                      teacherGender === g.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={g.id} />
                    <span className="font-medium">{g.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-3">Interaction Style</h3>
              <RadioGroup value={interactionStyle} onValueChange={setInteractionStyle} className="space-y-3">
                {TEACHER_PREFERENCES.interaction.map((style) => (
                  <label
                    key={style.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all",
                      interactionStyle === style.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={style.id} />
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{style.label}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        )}

        {/* Step 6: Language & Timezone */}
        {currentStep === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Language & Timezone
              </h2>
              <p className="text-muted-foreground">
                For optimal scheduling and communication
              </p>
            </div>

            <div>
              <Label className="font-medium">Preferred Language for Instruction</Label>
              <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-medium">Your Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_REGIONS.map((region) => (
                    <div key={region.region}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted">
                        {region.region}
                      </div>
                      {region.zones.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                <Globe className="h-4 w-4 inline mr-1" />
                Auto-detected: {timezone || "Not detected"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 7: Additional Notes & Review */}
        {currentStep === 7 && (
          <motion.div
            key="step7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Almost There!
              </h2>
              <p className="text-muted-foreground">
                Anything else you'd like us to know?
              </p>
            </div>

            <div>
              <Label className="font-medium">Additional Notes (Optional)</Label>
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any specific requirements, questions, or things you'd like your teacher to know..."
                className="mt-2 min-h-[120px]"
              />
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-medium">Your Profile Summary</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Path:</span>
                  <span className="font-medium capitalize">{persona?.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Focus Areas:</span>
                  <span className="font-medium">{selectedGoals.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span className="font-medium capitalize">{level.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{TIME_COMMITMENTS.find(t => t.id === timeCommitment)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="font-medium">{preferredLanguage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="font-medium">{timezone}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep < TOTAL_STEPS ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Complete & Find Teachers
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default DualTrackOnboardingQuiz;
