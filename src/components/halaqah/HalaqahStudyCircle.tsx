import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  Clock,
  Globe,
  BookOpen,
  MessageCircle,
  Video,
  Star,
  ChevronRight,
  Shield,
  Sparkles,
  UserPlus,
  CalendarDays,
  GraduationCap,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

// Halaqah status
export type HalaqahStatus = "recruiting" | "in_progress" | "completed" | "paused";

// Halaqah level
export type HalaqahLevel = "beginner" | "intermediate" | "advanced" | "mixed";

// Participant in the halaqah
export interface HalaqahParticipant {
  id: string;
  name: string;
  avatarUrl: string | null;
  joinedAt: string;
  role: "teacher" | "facilitator" | "student";
  isActive: boolean;
}

// Halaqah session/meeting
export interface HalaqahSession {
  id: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  topic: string;
  isCompleted: boolean;
  recordingUrl?: string;
  attendanceCount?: number;
}

// Main Halaqah data structure
export interface Halaqah {
  id: string;
  title: string;
  arabicTitle?: string;
  description: string;
  
  // Subject & curriculum
  subject: string;
  curriculum?: string; // e.g., "Riyad as-Saliheen", "Quran Juz Amma"
  level: HalaqahLevel;
  
  // Status
  status: HalaqahStatus;
  startDate: string;
  endDate?: string;
  totalWeeks: number;
  currentWeek: number;
  
  // Schedule
  meetingDay: string; // "Monday", "Tuesday", etc.
  meetingTime: string; // "19:00"
  timezone: string;
  durationMinutes: number;
  
  // Capacity
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  
  // Participants
  teacher: HalaqahParticipant;
  participants: HalaqahParticipant[];
  
  // Sessions
  upcomingSessions: HalaqahSession[];
  completedSessions: HalaqahSession[];
  
  // Pricing
  priceCents: number;
  currency: string;
  isPricePerSession: boolean;
  
  // Features
  hasRecordings: boolean;
  hasDiscussionForum: boolean;
  hasCertificate: boolean;
  language: string;
  
  // Engagement
  rating: number;
  reviewCount: number;
  tags: string[];
}

interface HalaqahCardProps {
  halaqah: Halaqah;
  variant?: "default" | "compact" | "featured";
  onJoin?: (halaqahId: string) => void;
}

const STATUS_CONFIG: Record<HalaqahStatus, { label: string; color: string; canJoin: boolean }> = {
  recruiting: { label: "Enrolling Now", color: "bg-green-100 text-green-800", canJoin: true },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800", canJoin: true },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-800", canJoin: false },
  paused: { label: "Paused", color: "bg-amber-100 text-amber-800", canJoin: false },
};

const LEVEL_CONFIG: Record<HalaqahLevel, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-emerald-100 text-emerald-800" },
  intermediate: { label: "Intermediate", color: "bg-blue-100 text-blue-800" },
  advanced: { label: "Advanced", color: "bg-purple-100 text-purple-800" },
  mixed: { label: "All Levels", color: "bg-gray-100 text-gray-800" },
};

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatTime(time: string, timezone: string): string {
  try {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    });
  } catch {
    return time;
  }
}

export function HalaqahCard({ halaqah, variant = "default", onJoin }: HalaqahCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const statusInfo = STATUS_CONFIG[halaqah.status];
  const levelInfo = LEVEL_CONFIG[halaqah.level];
  const spotsLeft = halaqah.maxParticipants - halaqah.currentParticipants;
  const progressPercent = (halaqah.currentWeek / halaqah.totalWeeks) * 100;
  
  if (variant === "compact") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{halaqah.title}</h3>
                <Badge className={cn("text-[10px] shrink-0", statusInfo.color)}>
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{halaqah.subject}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {halaqah.meetingDay}s
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {halaqah.currentParticipants}/{halaqah.maxParticipants}
                </span>
              </div>
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
        halaqah.status === "recruiting" && spotsLeft <= 3 && "ring-2 ring-amber-400"
      )}>
        {/* Urgency banner */}
        {halaqah.status === "recruiting" && spotsLeft <= 3 && (
          <div className="bg-amber-50 text-amber-800 text-sm font-medium px-4 py-2 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Only {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left!
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                <Badge variant="outline" className={levelInfo.color}>
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {levelInfo.label}
                </Badge>
              </div>
              <CardTitle className="text-xl">{halaqah.title}</CardTitle>
              {halaqah.arabicTitle && (
                <p className="font-arabic text-muted-foreground" dir="rtl">
                  {halaqah.arabicTitle}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(halaqah.priceCents, halaqah.currency)}
              </div>
              <span className="text-sm text-muted-foreground">
                {halaqah.isPricePerSession ? "/session" : "/course"}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Subject & Curriculum */}
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">{halaqah.subject}</p>
              {halaqah.curriculum && (
                <p className="text-sm text-muted-foreground">
                  Text: {halaqah.curriculum}
                </p>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>{halaqah.meetingDay}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(halaqah.meetingTime, halaqah.timezone)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{halaqah.timezone}</span>
            </div>
          </div>

          {/* Progress (if in progress) */}
          {halaqah.status === "in_progress" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="font-medium">Week {halaqah.currentWeek} of {halaqah.totalWeeks}</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          {/* Teacher */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={halaqah.teacher.avatarUrl || undefined} />
              <AvatarFallback>{halaqah.teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{halaqah.teacher.name}</span>
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Instructor</span>
            </div>
            <Link to={`/teachers/${halaqah.teacher.id}`}>
              <Button variant="ghost" size="sm">
                Profile
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Participants */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {halaqah.participants.slice(0, 5).map((p, i) => (
                  <Avatar key={p.id} className="h-8 w-8 ring-2 ring-background">
                    <AvatarImage src={p.avatarUrl || undefined} />
                    <AvatarFallback className="text-xs">{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {halaqah.currentParticipants > 5 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted ring-2 ring-background text-xs font-medium">
                    +{halaqah.currentParticipants - 5}
                  </div>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {halaqah.currentParticipants} of {halaqah.maxParticipants} students
              </span>
            </div>
            
            {halaqah.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{halaqah.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({halaqah.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {halaqah.hasRecordings && (
              <Badge variant="outline" className="text-xs">
                <Video className="h-3 w-3 mr-1" />
                Recordings
              </Badge>
            )}
            {halaqah.hasDiscussionForum && (
              <Badge variant="outline" className="text-xs">
                <MessageCircle className="h-3 w-3 mr-1" />
                Discussion Forum
              </Badge>
            )}
            {halaqah.hasCertificate && (
              <Badge variant="outline" className="text-xs">
                <GraduationCap className="h-3 w-3 mr-1" />
                Certificate
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              {halaqah.language}
            </Badge>
          </div>

          {/* Tags */}
          {halaqah.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {halaqah.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 py-4 bg-muted/30 flex gap-3">
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{halaqah.title}</DialogTitle>
                <DialogDescription>{halaqah.description}</DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="schedule" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                </TabsList>
                
                <TabsContent value="schedule" className="space-y-4">
                  <h4 className="font-medium">Upcoming Sessions</h4>
                  {halaqah.upcomingSessions.length > 0 ? (
                    <div className="space-y-2">
                      {halaqah.upcomingSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{session.title}</p>
                            <p className="text-sm text-muted-foreground">{session.topic}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p>{new Date(session.scheduledAt).toLocaleDateString()}</p>
                            <p className="text-muted-foreground">{session.durationMinutes} min</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No upcoming sessions scheduled yet
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="curriculum" className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p>{halaqah.description}</p>
                    {halaqah.curriculum && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h5 className="font-medium">Primary Text</h5>
                        <p>{halaqah.curriculum}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="participants" className="space-y-4">
                  <div className="grid gap-3">
                    {halaqah.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Avatar>
                          <AvatarImage src={participant.avatarUrl || undefined} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{participant.role}</p>
                        </div>
                        {participant.isActive && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            Active
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          
          <Button
            className="flex-1"
            onClick={() => onJoin?.(halaqah.id)}
            disabled={!statusInfo.canJoin || spotsLeft === 0}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {spotsLeft === 0 ? "Waitlist" : "Join Halaqah"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Discovery/listing component
interface HalaqahListProps {
  halaqahs: Halaqah[];
  onJoin?: (halaqahId: string) => void;
}

export function HalaqahList({ halaqahs, onJoin }: HalaqahListProps) {
  const [filter, setFilter] = useState<HalaqahStatus | "all">("all");
  const [levelFilter, setLevelFilter] = useState<HalaqahLevel | "all">("all");
  
  const filteredHalaqahs = halaqahs.filter((h) => {
    if (filter !== "all" && h.status !== filter) return false;
    if (levelFilter !== "all" && h.level !== levelFilter) return false;
    return true;
  });
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <div className="flex gap-2">
            {(["all", "recruiting", "in_progress"] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === "all" ? "All" : STATUS_CONFIG[status as HalaqahStatus].label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Level:</span>
          <div className="flex gap-2">
            {(["all", "beginner", "intermediate", "advanced"] as const).map((level) => (
              <Button
                key={level}
                variant={levelFilter === level ? "default" : "outline"}
                size="sm"
                onClick={() => setLevelFilter(level)}
              >
                {level === "all" ? "All Levels" : LEVEL_CONFIG[level as HalaqahLevel].label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredHalaqahs.length} {filteredHalaqahs.length === 1 ? "halaqah" : "halaqahs"} found
      </p>
      
      {/* List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredHalaqahs.map((halaqah) => (
          <HalaqahCard key={halaqah.id} halaqah={halaqah} onJoin={onJoin} />
        ))}
      </div>
      
      {filteredHalaqahs.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No halaqahs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or check back later for new study circles.
          </p>
        </div>
      )}
    </div>
  );
}

// Sample data for demonstration
export const SAMPLE_HALAQAH: Halaqah = {
  id: "halaqah-001",
  title: "Riyad as-Saliheen Study Circle",
  arabicTitle: "حلقة رياض الصالحين",
  description: "A comprehensive study of Imam Nawawi's Riyad as-Saliheen, covering the hadith chapter by chapter with practical applications for daily life.",
  subject: "Hadith Studies",
  curriculum: "Riyad as-Saliheen by Imam Nawawi",
  level: "beginner",
  status: "recruiting",
  startDate: "2026-03-01",
  totalWeeks: 12,
  currentWeek: 0,
  meetingDay: "Saturday",
  meetingTime: "19:00",
  timezone: "America/New_York",
  durationMinutes: 90,
  minParticipants: 5,
  maxParticipants: 15,
  currentParticipants: 8,
  teacher: {
    id: "teacher-001",
    name: "Sheikh Ahmad Ibrahim",
    avatarUrl: null,
    joinedAt: "2025-01-01",
    role: "teacher",
    isActive: true,
  },
  participants: [
    { id: "p1", name: "Ahmad", avatarUrl: null, joinedAt: "2026-02-01", role: "student", isActive: true },
    { id: "p2", name: "Fatima", avatarUrl: null, joinedAt: "2026-02-01", role: "student", isActive: true },
    { id: "p3", name: "Omar", avatarUrl: null, joinedAt: "2026-02-02", role: "student", isActive: true },
    { id: "p4", name: "Aisha", avatarUrl: null, joinedAt: "2026-02-02", role: "student", isActive: true },
    { id: "p5", name: "Yusuf", avatarUrl: null, joinedAt: "2026-02-03", role: "student", isActive: true },
  ],
  upcomingSessions: [
    {
      id: "s1",
      title: "Session 1: Introduction",
      scheduledAt: "2026-03-01T19:00:00-05:00",
      durationMinutes: 90,
      topic: "Introduction to Riyad as-Saliheen and Imam Nawawi",
      isCompleted: false,
    },
    {
      id: "s2",
      title: "Session 2: Chapter of Sincerity",
      scheduledAt: "2026-03-08T19:00:00-05:00",
      durationMinutes: 90,
      topic: "Book of Sincerity (Ikhlas)",
      isCompleted: false,
    },
  ],
  completedSessions: [],
  priceCents: 9900,
  currency: "USD",
  isPricePerSession: false,
  hasRecordings: true,
  hasDiscussionForum: true,
  hasCertificate: true,
  language: "English",
  rating: 4.8,
  reviewCount: 24,
  tags: ["Hadith", "Nawawi", "Beginners Welcome"],
};

export default HalaqahCard;
