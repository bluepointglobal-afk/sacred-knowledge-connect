import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Filter,
  ArrowRight,
  Loader2,
  RefreshCw,
  BookOpen,
  Users,
  Star,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboardingResponses } from "@/hooks/useOnboarding";
import { useTeachers } from "@/hooks/useTeachers";
import { EnrichedTeacherCard, transformToEnrichedTeacher, type EnrichedTeacherData } from "@/components/teacher/EnrichedTeacherCard";
import { matchWithTeachers, getMatchInsights, type MatchResult } from "@/lib/matching";
import type { OnboardingData, PersonaType } from "@/components/onboarding";
import { cn } from "@/lib/utils";

// Helper to convert onboarding responses to OnboardingData
function parseOnboardingResponses(responses: { step_key: string; response: Record<string, unknown> }[]): OnboardingData | null {
  if (!responses || responses.length === 0) return null;
  
  const data: Partial<OnboardingData> = {
    goals: [],
    teachingLanguages: [],
  };
  
  responses.forEach((response) => {
    const r = response.response;
    switch (response.step_key) {
      case "persona":
        data.persona = r.persona as PersonaType;
        break;
      case "path_type": // Legacy key
        data.persona = r.pathType as PersonaType;
        break;
      case "goals":
        data.goals = r.goals as string[] || [];
        break;
      case "learning_goals": // Legacy key
        data.goals = r.goals as string[] || [];
        break;
      case "level":
        data.level = r.level as string;
        break;
      case "learning_style":
        data.learningStyle = r.style as string;
        break;
      case "time_commitment":
        data.timeCommitment = r.commitment as string || r.timeCommitment as string;
        break;
      case "teacher_preferences":
        data.teacherMethodology = r.methodology as string;
        data.teacherGender = r.gender as string || r.teacherGender as string;
        data.interactionStyle = r.interaction as string;
        break;
      case "language_timezone":
        data.preferredLanguage = r.language as string;
        data.timezone = r.timezone as string;
        break;
      case "additional":
        data.additionalNotes = r.notes as string;
        break;
    }
  });
  
  // Ensure required fields have defaults
  return {
    persona: data.persona || "student_of_knowledge",
    goals: data.goals || [],
    level: data.level || "beginner",
    learningStyle: data.learningStyle || "flexible",
    timeCommitment: data.timeCommitment || "moderate",
    teacherMethodology: data.teacherMethodology || "blended",
    teacherGender: data.teacherGender || "any",
    interactionStyle: data.interactionStyle || "flexible",
    preferredLanguage: data.preferredLanguage || "English",
    timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    additionalNotes: data.additionalNotes || "",
  };
}

type SortOption = "match" | "rating" | "price_low" | "price_high" | "experience";

export default function SmartMatching() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: onboardingResponses, isLoading: responsesLoading } = useOnboardingResponses();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  // Parse onboarding data
  const studentProfile = useMemo(() => {
    if (!onboardingResponses) return null;
    return parseOnboardingResponses(onboardingResponses.map(r => ({
      step_key: r.step_key,
      response: r.response as Record<string, unknown>
    })));
  }, [onboardingResponses]);
  
  // Transform and match teachers
  const matchedTeachers = useMemo(() => {
    if (!teachers || !studentProfile) return [];
    
    // Transform to enriched format
    const enrichedTeachers: EnrichedTeacherData[] = teachers.map(transformToEnrichedTeacher);
    
    // Run matching algorithm
    const results = matchWithTeachers(studentProfile, enrichedTeachers, {
      minScore: showAll ? 0 : 40,
      maxResults: 50,
      verifiedOnly,
    });
    
    // Attach teacher data to results
    return results.map(result => ({
      ...result,
      teacher: enrichedTeachers.find(t => t.id === result.teacherId)!,
      insights: getMatchInsights(result),
    }));
  }, [teachers, studentProfile, verifiedOnly, showAll]);
  
  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...matchedTeachers];
    
    switch (sortBy) {
      case "match":
        return sorted.sort((a, b) => b.totalScore - a.totalScore);
      case "rating":
        return sorted.sort((a, b) => b.teacher.rating - a.teacher.rating);
      case "price_low":
        return sorted.sort((a, b) => a.teacher.hourlyRateCents - b.teacher.hourlyRateCents);
      case "price_high":
        return sorted.sort((a, b) => b.teacher.hourlyRateCents - a.teacher.hourlyRateCents);
      case "experience":
        return sorted.sort((a, b) => b.teacher.yearsExperience - a.teacher.yearsExperience);
      default:
        return sorted;
    }
  }, [matchedTeachers, sortBy]);
  
  // Loading state
  const isLoading = authLoading || responsesLoading || teachersLoading;
  
  // Redirect to onboarding if no profile
  useEffect(() => {
    if (!isLoading && user && !studentProfile) {
      navigate("/onboarding");
    }
  }, [isLoading, user, studentProfile, navigate]);
  
  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide max-w-md text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-4">
              Find Your Perfect Teacher Match
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in and complete your profile to get personalized teacher recommendations.
            </p>
            <Button asChild>
              <Link to="/login">Sign In to Continue</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Finding your matches...</p>
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-4">
              <Badge className="bg-primary/10 text-primary px-4 py-1.5 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Matching
              </Badge>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Your Personalized Teacher Matches
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Based on your learning goals, preferences, and availability, we've found teachers who are the best fit for your journey.
            </p>
          </motion.div>
          
          {/* Profile Summary */}
          {studentProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Your Profile</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {studentProfile.persona?.replace(/_/g, " ")}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {studentProfile.level?.replace(/_/g, " ")}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {studentProfile.preferredLanguage}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/onboarding">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Update Preferences
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Filters & Sort */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {sortedResults.length} {sortedResults.length === 1 ? "match" : "matches"} found
              </span>
              <Button
                variant={verifiedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Verified Only
              </Button>
              <Button
                variant={showAll ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                <Users className="h-4 w-4 mr-2" />
                {showAll ? "Showing All" : "Best Matches"}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
          
          {/* Results */}
          <div className="space-y-6">
            {sortedResults.map((result, index) => (
              <motion.div
                key={result.teacherId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                {/* Match Score Banner */}
                <div className="mb-2">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                      result.insights.overall === "excellent" && "bg-green-100 text-green-800",
                      result.insights.overall === "good" && "bg-blue-100 text-blue-800",
                      result.insights.overall === "fair" && "bg-amber-100 text-amber-800",
                      result.insights.overall === "challenging" && "bg-gray-100 text-gray-800"
                    )}>
                      <Sparkles className="h-4 w-4" />
                      {result.totalScore}% Match
                    </div>
                    
                    {/* Match reasons */}
                    <div className="flex flex-wrap gap-2">
                      {result.insights.topStrengths.map((strength, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          {strength}
                        </Badge>
                      ))}
                      {result.insights.considerations.slice(0, 1).map((consideration, i) => (
                        <Badge key={i} variant="outline" className="text-xs text-amber-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {consideration}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Teacher Card */}
                <EnrichedTeacherCard
                  teacher={result.teacher}
                  showMatchScore={false}
                  onBook={(id) => navigate(`/teachers/${id}`)}
                />
              </motion.div>
            ))}
          </div>
          
          {/* No Results */}
          {sortedResults.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-4">
                {verifiedOnly 
                  ? "Try removing the 'Verified Only' filter to see more teachers."
                  : "Try updating your preferences to find more matches."}
              </p>
              <div className="flex justify-center gap-4">
                {verifiedOnly && (
                  <Button variant="outline" onClick={() => setVerifiedOnly(false)}>
                    Show All Teachers
                  </Button>
                )}
                <Button asChild>
                  <Link to="/onboarding">
                    Update Preferences
                  </Link>
                </Button>
              </div>
            </div>
          )}
          
          {/* CTA */}
          {sortedResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-4">
                Want to explore more options?
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/teachers">
                    Browse All Teachers
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/bundles">
                    Explore Courses
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
