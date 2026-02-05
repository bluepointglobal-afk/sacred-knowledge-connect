import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  BookOpen,
  Calendar,
  Globe,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { HalaqahCard, HalaqahList, SAMPLE_HALAQAH, type Halaqah, type HalaqahStatus, type HalaqahLevel } from "@/components/halaqah";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Generate mock halaqahs for demonstration
const MOCK_HALAQAHS: Halaqah[] = [
  SAMPLE_HALAQAH,
  {
    ...SAMPLE_HALAQAH,
    id: "halaqah-002",
    title: "Tajweed Mastery Program",
    arabicTitle: "برنامج إتقان التجويد",
    description: "Learn the rules of Tajweed from basics to advanced, with weekly practice sessions and personalized feedback.",
    subject: "Quran Recitation",
    curriculum: "Al-Jazariyyah",
    level: "intermediate",
    status: "in_progress",
    currentWeek: 4,
    meetingDay: "Tuesday",
    meetingTime: "18:00",
    timezone: "Europe/London",
    currentParticipants: 12,
    maxParticipants: 12,
    priceCents: 14900,
    tags: ["Tajweed", "Quran", "Recitation"],
  },
  {
    ...SAMPLE_HALAQAH,
    id: "halaqah-003",
    title: "Fiqh of Worship",
    arabicTitle: "فقه العبادات",
    description: "A systematic study of the Fiqh of Salah, Zakah, Fasting, and Hajj according to the four schools of thought.",
    subject: "Islamic Jurisprudence",
    curriculum: "Fiqh al-Sunnah by Sayyid Sabiq",
    level: "beginner",
    status: "recruiting",
    meetingDay: "Sunday",
    meetingTime: "20:00",
    timezone: "America/Chicago",
    currentParticipants: 3,
    minParticipants: 8,
    maxParticipants: 20,
    priceCents: 7900,
    tags: ["Fiqh", "Worship", "Comparative"],
  },
  {
    ...SAMPLE_HALAQAH,
    id: "halaqah-004",
    title: "Arabic for Quran Understanding",
    arabicTitle: "العربية لفهم القرآن",
    description: "Learn Quranic Arabic vocabulary and grammar to understand the Quran directly without translation.",
    subject: "Arabic Language",
    curriculum: "Madinah Arabic Course",
    level: "beginner",
    status: "recruiting",
    meetingDay: "Wednesday",
    meetingTime: "17:00",
    timezone: "Asia/Karachi",
    currentParticipants: 6,
    maxParticipants: 15,
    priceCents: 5900,
    language: "Urdu/English",
    tags: ["Arabic", "Quran", "Language"],
  },
  {
    ...SAMPLE_HALAQAH,
    id: "halaqah-005",
    title: "Seerah of the Prophet ﷺ",
    arabicTitle: "السيرة النبوية",
    description: "An in-depth study of the life of Prophet Muhammad ﷺ, drawing lessons for contemporary life.",
    subject: "Islamic History",
    curriculum: "Ar-Raheeq Al-Makhtum",
    level: "mixed",
    status: "recruiting",
    meetingDay: "Friday",
    meetingTime: "21:00",
    timezone: "Asia/Dubai",
    currentParticipants: 10,
    maxParticipants: 25,
    priceCents: 6900,
    tags: ["Seerah", "History", "Prophet"],
  },
  {
    ...SAMPLE_HALAQAH,
    id: "halaqah-006",
    title: "Tafsir Study Circle",
    arabicTitle: "حلقة دراسة التفسير",
    description: "Weekly study of Tafsir Ibn Kathir, covering one Juz per month with contextual analysis.",
    subject: "Quran Tafsir",
    curriculum: "Tafsir Ibn Kathir",
    level: "advanced",
    status: "in_progress",
    currentWeek: 8,
    meetingDay: "Thursday",
    meetingTime: "19:30",
    timezone: "Africa/Cairo",
    currentParticipants: 8,
    maxParticipants: 10,
    priceCents: 12900,
    tags: ["Tafsir", "Quran", "Advanced"],
  },
];

export default function Halaqahs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<HalaqahStatus | "all">("all");
  const [levelFilter, setLevelFilter] = useState<HalaqahLevel | "all">("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  
  // Get unique subjects for filter
  const subjects = [...new Set(MOCK_HALAQAHS.map(h => h.subject))];
  
  // Filter halaqahs
  const filteredHalaqahs = MOCK_HALAQAHS.filter((h) => {
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !h.title.toLowerCase().includes(query) &&
        !h.subject.toLowerCase().includes(query) &&
        !h.description.toLowerCase().includes(query) &&
        !h.tags.some(t => t.toLowerCase().includes(query))
      ) {
        return false;
      }
    }
    
    // Status
    if (statusFilter !== "all" && h.status !== statusFilter) return false;
    
    // Level
    if (levelFilter !== "all" && h.level !== levelFilter) return false;
    
    // Subject
    if (subjectFilter !== "all" && h.subject !== subjectFilter) return false;
    
    return true;
  });
  
  const handleJoin = (halaqahId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join a study circle.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // TODO: Implement actual join logic
    toast({
      title: "Joining study circle",
      description: "Redirecting to enrollment...",
    });
    navigate(`/halaqahs/${halaqahId}/enroll`);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-12 lg:py-16">
        <div className="container-wide">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-primary/10 text-primary px-4 py-1.5 text-sm mb-4">
              <Users className="h-4 w-4 mr-2" />
              Community Learning
            </Badge>
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
              Halaqah Study Circles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Join a community of learners in structured, cohort-based study circles led by qualified scholars. 
              Learn together, grow together.
            </p>
            
            {/* Quick stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>{MOCK_HALAQAHS.reduce((sum, h) => sum + h.currentParticipants, 0)}+ students enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>{MOCK_HALAQAHS.length} active circles</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Multiple timezones</span>
              </div>
            </div>
          </motion.div>
          
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 md:grid-cols-3 mb-12"
          >
            <div className="p-6 rounded-xl bg-muted/50">
              <Sparkles className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Cohort-Based Learning</h3>
              <p className="text-sm text-muted-foreground">
                Learn alongside peers at similar levels, building lasting connections and accountability.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-muted/50">
              <Calendar className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Structured Curriculum</h3>
              <p className="text-sm text-muted-foreground">
                Follow proven classical texts with weekly sessions, assignments, and progress tracking.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-muted/50">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Small Group Interaction</h3>
              <p className="text-sm text-muted-foreground">
                Limited class sizes ensure personalized attention and meaningful discussions.
              </p>
            </div>
          </motion.div>
          
          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by subject, topic, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="recruiting">Enrolling Now</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as typeof levelFilter)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
          
          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground mb-6"
          >
            {filteredHalaqahs.length} {filteredHalaqahs.length === 1 ? "circle" : "circles"} found
          </motion.p>
          
          {/* Halaqah Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredHalaqahs.map((halaqah, index) => (
              <motion.div
                key={halaqah.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <HalaqahCard halaqah={halaqah} onJoin={handleJoin} />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Empty state */}
          {filteredHalaqahs.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No study circles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setLevelFilter("all");
                setSubjectFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center p-8 rounded-2xl bg-primary/5"
          >
            <h2 className="font-display text-2xl font-bold mb-4">
              Want to Lead a Halaqah?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Are you a qualified teacher or scholar? Create your own study circle and share your knowledge with students worldwide.
            </p>
            <Button asChild>
              <a href="/become-teacher">
                Become a Teacher
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
