/**
 * SacredChain Smart Matching Algorithm v1
 * 
 * Matches students with teachers based on:
 * - Language compatibility
 * - Timezone compatibility
 * - Learning style alignment
 * - Expertise/level match
 * - Specialization overlap
 * - Availability compatibility
 */

import type { OnboardingData } from "@/components/onboarding/DualTrackOnboardingQuiz";
import type { EnrichedTeacherData, TeachingMethodology, StudentLevel } from "@/components/teacher/EnrichedTeacherCard";

// Scoring weights (total = 100)
const WEIGHTS = {
  language: 25,
  timezone: 20,
  learningStyle: 15,
  methodology: 15,
  specialization: 15,
  level: 10,
};

// Timezone compatibility matrix (hours difference -> score)
function getTimezoneCompatibilityScore(studentTz: string, teacherTz: string): number {
  // Get UTC offset difference
  try {
    const now = new Date();
    const studentOffset = getTimezoneOffset(studentTz, now);
    const teacherOffset = getTimezoneOffset(teacherTz, now);
    const hoursDiff = Math.abs(studentOffset - teacherOffset) / 60;
    
    // Score based on hours difference
    if (hoursDiff <= 2) return 100; // Excellent - same region
    if (hoursDiff <= 4) return 85;  // Good - nearby regions
    if (hoursDiff <= 6) return 70;  // Acceptable - some overlap
    if (hoursDiff <= 8) return 50;  // Challenging - limited overlap
    if (hoursDiff <= 10) return 30; // Difficult - early/late sessions
    return 15; // Very difficult - significant time difference
  } catch {
    return 50; // Default if timezone parsing fails
  }
}

function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    return (utcDate.getTime() - tzDate.getTime()) / (1000 * 60);
  } catch {
    return 0;
  }
}

// Language compatibility
function getLanguageScore(studentLanguage: string, teacherLanguages: string[]): number {
  const normalizedStudent = studentLanguage.toLowerCase().trim();
  const normalizedTeacher = teacherLanguages.map(l => l.toLowerCase().trim());
  
  // Exact match
  if (normalizedTeacher.includes(normalizedStudent)) {
    return 100;
  }
  
  // Partial matches (e.g., "arabic" matches "classical arabic")
  const hasPartialMatch = normalizedTeacher.some(l => 
    l.includes(normalizedStudent) || normalizedStudent.includes(l)
  );
  if (hasPartialMatch) {
    return 75;
  }
  
  // Common lingua franca available
  if (normalizedTeacher.includes("english") || normalizedTeacher.includes("arabic")) {
    return 50;
  }
  
  return 20;
}

// Learning style to methodology mapping
const STYLE_TO_METHODOLOGY: Record<string, TeachingMethodology[]> = {
  structured: ["traditional", "blended"],
  flexible: ["modern", "blended"],
  intensive: ["traditional", "blended"],
  casual: ["modern", "blended"],
};

function getMethodologyScore(
  studentStyle: string,
  studentMethodologyPref: string,
  teacherMethodology: TeachingMethodology
): number {
  // Direct preference match
  if (studentMethodologyPref === teacherMethodology) {
    return 100;
  }
  
  // Blended matches everything well
  if (teacherMethodology === "blended") {
    return 85;
  }
  
  // Learning style alignment
  const compatibleMethods = STYLE_TO_METHODOLOGY[studentStyle] || ["blended"];
  if (compatibleMethods.includes(teacherMethodology)) {
    return 75;
  }
  
  return 40;
}

// Level compatibility
const LEVEL_COMPATIBILITY: Record<string, StudentLevel[]> = {
  // Student of Knowledge levels
  mubtadi: ["beginner", "all_levels"],
  mutawassit: ["intermediate", "all_levels"],
  mutaqaddim: ["advanced", "all_levels"],
  talib_ijazah: ["advanced", "all_levels"],
  // Truth Seeker levels
  curious: ["beginner", "all_levels"],
  engaged: ["beginner", "intermediate", "all_levels"],
  dedicated: ["intermediate", "advanced", "all_levels"],
};

function getLevelScore(studentLevel: string, teacherLevels: StudentLevel[]): number {
  const compatible = LEVEL_COMPATIBILITY[studentLevel] || ["all_levels"];
  
  // Check if any compatible level matches
  const hasMatch = compatible.some(level => teacherLevels.includes(level));
  if (hasMatch) {
    // Perfect match on exact level
    if (teacherLevels.includes(compatible[0] as StudentLevel)) {
      return 100;
    }
    return 80;
  }
  
  // All levels is always somewhat compatible
  if (teacherLevels.includes("all_levels")) {
    return 70;
  }
  
  return 30;
}

// Specialization overlap
function getSpecializationScore(studentGoals: string[], teacherSpecializations: string[]): number {
  if (studentGoals.length === 0 || teacherSpecializations.length === 0) {
    return 50; // Neutral if no data
  }
  
  // Normalize for comparison
  const normalizedGoals = studentGoals.map(g => g.toLowerCase().replace(/_/g, " "));
  const normalizedSpecs = teacherSpecializations.map(s => s.toLowerCase());
  
  // Count matches (including partial)
  let exactMatches = 0;
  let partialMatches = 0;
  
  for (const goal of normalizedGoals) {
    for (const spec of normalizedSpecs) {
      if (spec === goal || spec.includes(goal) || goal.includes(spec)) {
        exactMatches++;
        break;
      } else if (spec.split(" ").some(word => goal.includes(word)) ||
                 goal.split(" ").some(word => spec.includes(word))) {
        partialMatches++;
        break;
      }
    }
  }
  
  const totalGoals = studentGoals.length;
  const matchRatio = (exactMatches + partialMatches * 0.5) / totalGoals;
  
  return Math.min(100, Math.round(matchRatio * 100));
}

// Interaction style compatibility
function getInteractionScore(studentPref: string, teacherAvailability: string): number {
  // This is a simplified version - would be enhanced with actual availability data
  const teacherSupports: Record<string, string[]> = {
    one_on_one: ["one_on_one", "flexible"],
    small_group: ["small_group", "cohort", "flexible"],
    cohort: ["cohort", "small_group", "flexible"],
    flexible: ["one_on_one", "small_group", "cohort", "flexible"],
  };
  
  const supported = teacherSupports[studentPref] || ["flexible"];
  return supported.includes(teacherAvailability) ? 100 : 50;
}

export interface MatchResult {
  teacherId: string;
  totalScore: number;
  scores: {
    language: number;
    timezone: number;
    learningStyle: number;
    methodology: number;
    specialization: number;
    level: number;
  };
  reasons: string[];
  warnings: string[];
}

/**
 * Calculate match score between a student and a teacher
 */
export function calculateMatchScore(
  student: OnboardingData,
  teacher: EnrichedTeacherData
): MatchResult {
  const reasons: string[] = [];
  const warnings: string[] = [];
  
  // Calculate individual scores
  const languageScore = getLanguageScore(student.preferredLanguage, teacher.teachingLanguages);
  const timezoneScore = getTimezoneCompatibilityScore(student.timezone, teacher.timezone);
  const methodologyScore = getMethodologyScore(
    student.learningStyle,
    student.teacherMethodology,
    teacher.methodology
  );
  const levelScore = getLevelScore(student.level, teacher.studentLevels);
  const specializationScore = getSpecializationScore(student.goals, teacher.specializations);
  const interactionScore = getInteractionScore(student.interactionStyle, "flexible"); // TODO: Get from teacher
  
  // Generate reasons and warnings
  if (languageScore >= 90) {
    reasons.push(`Teaches in ${student.preferredLanguage}`);
  } else if (languageScore < 50) {
    warnings.push("Limited language overlap");
  }
  
  if (timezoneScore >= 85) {
    reasons.push("Excellent timezone compatibility");
  } else if (timezoneScore < 50) {
    warnings.push("Significant timezone difference - may require early/late sessions");
  }
  
  if (methodologyScore >= 90) {
    reasons.push(`${teacher.methodology} teaching approach matches your preference`);
  }
  
  if (specializationScore >= 80) {
    reasons.push("Strong match for your learning goals");
  }
  
  if (teacher.isVerified) {
    reasons.push("Verified teacher");
  }
  
  if (teacher.hasIjazah && student.teacherMethodology === "traditional") {
    reasons.push("Has ijazah (chain of authorization)");
  }
  
  // Calculate weighted total
  const totalScore = Math.round(
    (languageScore * WEIGHTS.language +
     timezoneScore * WEIGHTS.timezone +
     methodologyScore * WEIGHTS.methodology +
     levelScore * WEIGHTS.level +
     specializationScore * WEIGHTS.specialization +
     interactionScore * WEIGHTS.learningStyle) / 100
  );
  
  return {
    teacherId: teacher.id,
    totalScore,
    scores: {
      language: languageScore,
      timezone: timezoneScore,
      learningStyle: interactionScore,
      methodology: methodologyScore,
      specialization: specializationScore,
      level: levelScore,
    },
    reasons,
    warnings,
  };
}

/**
 * Match a student with multiple teachers and rank them
 */
export function matchWithTeachers(
  student: OnboardingData,
  teachers: EnrichedTeacherData[],
  options?: {
    minScore?: number;
    maxResults?: number;
    mustHaveIjazah?: boolean;
    verifiedOnly?: boolean;
  }
): MatchResult[] {
  const {
    minScore = 40,
    maxResults = 20,
    mustHaveIjazah = false,
    verifiedOnly = false,
  } = options || {};
  
  // Filter teachers
  let filteredTeachers = teachers;
  
  if (mustHaveIjazah) {
    filteredTeachers = filteredTeachers.filter(t => t.hasIjazah);
  }
  
  if (verifiedOnly) {
    filteredTeachers = filteredTeachers.filter(t => t.isVerified);
  }
  
  // Calculate scores
  const results = filteredTeachers
    .map(teacher => calculateMatchScore(student, teacher))
    .filter(result => result.totalScore >= minScore)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, maxResults);
  
  return results;
}

/**
 * Get match insights for display
 */
export function getMatchInsights(result: MatchResult): {
  overall: "excellent" | "good" | "fair" | "challenging";
  topStrengths: string[];
  considerations: string[];
} {
  let overall: "excellent" | "good" | "fair" | "challenging";
  
  if (result.totalScore >= 85) {
    overall = "excellent";
  } else if (result.totalScore >= 70) {
    overall = "good";
  } else if (result.totalScore >= 55) {
    overall = "fair";
  } else {
    overall = "challenging";
  }
  
  // Extract top strengths (scores >= 80)
  const topStrengths: string[] = [];
  if (result.scores.language >= 80) topStrengths.push("Language compatibility");
  if (result.scores.timezone >= 80) topStrengths.push("Great scheduling overlap");
  if (result.scores.methodology >= 80) topStrengths.push("Teaching style match");
  if (result.scores.specialization >= 80) topStrengths.push("Subject expertise alignment");
  if (result.scores.level >= 80) topStrengths.push("Appropriate for your level");
  
  // Considerations (scores < 60)
  const considerations: string[] = [];
  if (result.scores.timezone < 60) considerations.push("May need flexible scheduling");
  if (result.scores.language < 60) considerations.push("Consider language support needs");
  if (result.scores.specialization < 60) considerations.push("Explore specialization fit");
  
  return {
    overall,
    topStrengths: topStrengths.slice(0, 3),
    considerations: result.warnings.concat(considerations).slice(0, 2),
  };
}

export default matchWithTeachers;
