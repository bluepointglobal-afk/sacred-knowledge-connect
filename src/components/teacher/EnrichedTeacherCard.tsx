import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  Shield,
  Clock,
  Globe,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  ChevronRight,
  Award,
  MessageCircle,
  Video,
  Verified,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeacherProfileWithUser } from "@/types/database";

// Teaching methodology types
export type TeachingMethodology = "traditional" | "modern" | "blended";

// Student levels the teacher can accommodate
export type StudentLevel = "beginner" | "intermediate" | "advanced" | "all_levels";

// Availability status
export type AvailabilityStatus = "available" | "limited" | "booked" | "on_break";

export interface EnrichedTeacherData {
  id: string;
  name: string;
  headline: string;
  avatarUrl: string | null;
  bio: string | null;
  
  // Core metrics
  rating: number;
  reviewCount: number;
  totalStudents: number;
  totalSessions: number;
  yearsExperience: number;
  isVerified: boolean;
  isFeatured: boolean;
  
  // Specializations & qualifications
  specializations: string[];
  qualifications: string[];
  
  // NEW: Methodology & Expertise
  methodology: TeachingMethodology;
  studentLevels: StudentLevel[];
  teachingLanguages: string[];
  
  // NEW: Availability
  availabilityStatus: AvailabilityStatus;
  nextAvailable: string | null; // ISO date string
  weeklyAvailability: {
    day: string;
    slots: number;
  }[];
  timezone: string;
  
  // NEW: Regional/Cultural context
  regionalSpecialization: string | null;
  countryOfResidence: string | null;
  
  // Pricing
  hourlyRateCents: number;
  currency: string;
  
  // Isnad/Ijazah chain (for traditional scholars)
  hasIjazah: boolean;
  ijazahChain: string[]; // Names in the chain
}

interface EnrichedTeacherCardProps {
  teacher: EnrichedTeacherData;
  variant?: "default" | "compact" | "featured";
  showMatchScore?: boolean;
  matchScore?: number;
  onBook?: (teacherId: string) => void;
}

// Helper to transform database teacher to enriched format
export function transformToEnrichedTeacher(
  teacher: TeacherProfileWithUser
): EnrichedTeacherData {
  const profile = teacher.profiles;
  const name = profile?.full_name || profile?.email?.split("@")[0] || "Teacher";
  
  // Parse availability from JSON (mock structure for now)
  const availability = teacher.availability as Record<string, unknown> || {};
  const weeklySlots = (availability.weekly_slots as { day: string; slots: number }[]) || [];
  
  return {
    id: teacher.id,
    name,
    headline: teacher.headline || "Islamic Studies Teacher",
    avatarUrl: profile?.avatar_url || null,
    bio: teacher.bio,
    
    rating: teacher.average_rating || 0,
    reviewCount: teacher.total_sessions || 0,
    totalStudents: teacher.total_students || 0,
    totalSessions: teacher.total_sessions || 0,
    yearsExperience: teacher.years_experience || 0,
    isVerified: teacher.is_verified,
    isFeatured: teacher.is_featured,
    
    specializations: teacher.specializations || [],
    qualifications: teacher.qualifications || [],
    
    // Methodology - default to blended if not specified
    methodology: (availability.methodology as TeachingMethodology) || "blended",
    studentLevels: (availability.student_levels as StudentLevel[]) || ["all_levels"],
    teachingLanguages: teacher.teaching_languages || ["English", "Arabic"],
    
    // Availability
    availabilityStatus: weeklySlots.length > 0 ? "available" : "limited",
    nextAvailable: (availability.next_available as string) || null,
    weeklyAvailability: weeklySlots,
    timezone: teacher.timezone || "UTC",
    
    // Regional
    regionalSpecialization: teacher.regional_specialization || null,
    countryOfResidence: teacher.country_of_residence || null,
    
    // Pricing
    hourlyRateCents: teacher.hourly_rate_cents || 5000,
    currency: teacher.currency || "USD",
    
    // Ijazah (mock - would come from separate table)
    hasIjazah: teacher.qualifications?.some(q => q.toLowerCase().includes("ijazah")) || false,
    ijazahChain: [], // Would be populated from ijazah_chains table
  };
}

const METHODOLOGY_LABELS: Record<TeachingMethodology, { label: string; color: string }> = {
  traditional: { label: "Traditional", color: "bg-amber-100 text-amber-800" },
  modern: { label: "Modern", color: "bg-blue-100 text-blue-800" },
  blended: { label: "Blended", color: "bg-purple-100 text-purple-800" },
};

const LEVEL_LABELS: Record<StudentLevel, string> = {
  beginner: "Beginners",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all_levels: "All Levels",
};

const AVAILABILITY_CONFIG: Record<AvailabilityStatus, { label: string; color: string; icon: typeof Clock }> = {
  available: { label: "Available", color: "text-green-600", icon: Clock },
  limited: { label: "Limited Slots", color: "text-amber-600", icon: Clock },
  booked: { label: "Fully Booked", color: "text-red-600", icon: Clock },
  on_break: { label: "On Break", color: "text-gray-600", icon: Clock },
};

export function EnrichedTeacherCard({
  teacher,
  variant = "default",
  showMatchScore = false,
  matchScore,
  onBook,
}: EnrichedTeacherCardProps) {
  const [showAvailability, setShowAvailability] = useState(false);
  
  const methodologyInfo = METHODOLOGY_LABELS[teacher.methodology];
  const availabilityInfo = AVAILABILITY_CONFIG[teacher.availabilityStatus];
  const AvailabilityIcon = availabilityInfo.icon;
  
  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={teacher.avatarUrl || undefined} />
              <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{teacher.name}</h3>
                {teacher.isVerified && (
                  <Verified className="h-4 w-4 text-primary shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{teacher.headline}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium">{teacher.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({teacher.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-primary">
                {formatPrice(teacher.hourlyRateCents, teacher.currency)}
              </div>
              <span className="text-xs text-muted-foreground">/hour</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "overflow-hidden hover:shadow-lg transition-all",
        teacher.isFeatured && "ring-2 ring-primary"
      )}>
        {/* Featured Badge */}
        {teacher.isFeatured && (
          <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 text-center">
            ⭐ Featured Teacher
          </div>
        )}
        
        {/* Match Score */}
        {showMatchScore && matchScore !== undefined && (
          <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-2 flex items-center justify-center gap-2">
            <Verified className="h-4 w-4" />
            {matchScore}% Match
          </div>
        )}

        <CardContent className="p-6">
          {/* Header: Avatar, Name, Core Info */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-16 w-16 ring-2 ring-muted">
              <AvatarImage src={teacher.avatarUrl || undefined} />
              <AvatarFallback className="text-xl">{teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-semibold text-lg">{teacher.name}</h3>
                {teacher.isVerified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Shield className="h-5 w-5 text-primary" />
                      </TooltipTrigger>
                      <TooltipContent>Verified Teacher</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {teacher.hasIjazah && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Award className="h-5 w-5 text-amber-500" />
                      </TooltipTrigger>
                      <TooltipContent>Has Ijazah (Chain of Authorization)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              <p className="text-muted-foreground text-sm">{teacher.headline}</p>
              
              {/* Rating & Stats */}
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{teacher.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({teacher.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{teacher.totalStudents} students</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>{teacher.yearsExperience}+ years</span>
                </div>
              </div>
            </div>
            
            {/* Price */}
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(teacher.hourlyRateCents, teacher.currency)}
              </div>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
          </div>

          {/* Methodology & Student Levels */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={cn("text-xs", methodologyInfo.color)} variant="secondary">
              {methodologyInfo.label} Approach
            </Badge>
            {teacher.studentLevels.map((level) => (
              <Badge key={level} variant="outline" className="text-xs">
                <GraduationCap className="h-3 w-3 mr-1" />
                {LEVEL_LABELS[level]}
              </Badge>
            ))}
          </div>

          {/* Specializations */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {teacher.specializations.slice(0, 4).map((spec) => (
                <Badge key={spec} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {teacher.specializations.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{teacher.specializations.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Languages & Location */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{teacher.teachingLanguages.slice(0, 3).join(", ")}</span>
            </div>
            {teacher.countryOfResidence && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{teacher.countryOfResidence}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{teacher.timezone}</span>
            </div>
          </div>

          {/* Availability Status */}
          <div className="bg-muted/50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className={cn("flex items-center gap-2", availabilityInfo.color)}>
                <AvailabilityIcon className="h-4 w-4" />
                <span className="font-medium text-sm">{availabilityInfo.label}</span>
              </div>
              
              <Dialog open={showAvailability} onOpenChange={setShowAvailability}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    View Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Weekly Availability</DialogTitle>
                    <DialogDescription>
                      {teacher.name}'s typical weekly schedule (times shown in {teacher.timezone})
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    {teacher.weeklyAvailability.length > 0 ? (
                      teacher.weeklyAvailability.map((day) => (
                        <div key={day.day} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="font-medium">{day.day}</span>
                          <Badge variant={day.slots > 0 ? "default" : "secondary"}>
                            {day.slots} {day.slots === 1 ? "slot" : "slots"} available
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Schedule not yet configured. Contact the teacher for availability.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {teacher.nextAvailable && (
              <p className="text-xs text-muted-foreground mt-2">
                Next available: {new Date(teacher.nextAvailable).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Bio Preview */}
          {teacher.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {teacher.bio}
            </p>
          )}
        </CardContent>

        <CardFooter className="px-6 py-4 bg-muted/30 flex gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link to={`/teachers/${teacher.id}`}>
              View Profile
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button
            className="flex-1"
            onClick={() => onBook?.(teacher.id)}
            disabled={teacher.availabilityStatus === "booked" || teacher.availabilityStatus === "on_break"}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Book Session
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default EnrichedTeacherCard;
