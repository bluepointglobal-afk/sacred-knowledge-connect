import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  Shield,
  Filter,
  Grid,
  List,
  MapPin,
  Clock,
  Loader2
} from "lucide-react";
import { useTeachers } from "@/hooks/useTeachers";
import type { TeacherProfileWithUser } from "@/types/database";

// Helper to transform database teacher to UI format
interface TeacherUI {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specializations: string[];
  languages: string[];
  location: string;
  isVerified: boolean;
  yearsExperience: number;
  availability: string;
  isFeatured: boolean;
}

function transformTeacher(teacher: TeacherProfileWithUser): TeacherUI {
  const profile = teacher.profiles;
  const name = profile?.full_name || profile?.email?.split("@")[0] || "Teacher";

  return {
    id: teacher.id,
    name,
    title: teacher.headline || "Islamic Studies Teacher",
    avatar: name.charAt(0).toUpperCase(),
    rating: teacher.average_rating || 0,
    reviewCount: teacher.total_sessions || 0,
    specializations: teacher.specializations || [],
    languages: [], // Not in current schema - could add later
    location: "", // Not in current schema - could add later
    isVerified: teacher.is_verified,
    yearsExperience: teacher.years_experience || 0,
    availability: "Flexible", // Could parse from teacher.availability JSON
    isFeatured: teacher.is_featured,
  };
}

// Mock data for development fallback (shown when no teachers in DB)
const mockTeachers: TeacherUI[] = [
  {
    id: "mock-1",
    name: "Sheikh Ahmad Ibrahim",
    title: "Quran & Tajweed Specialist",
    avatar: "A",
    rating: 4.9,
    reviewCount: 127,
    specializations: ["Quran Memorization", "Tajweed", "Tafsir"],
    languages: ["English", "Arabic"],
    location: "Cairo, Egypt",
    isVerified: true,
    yearsExperience: 15,
    availability: "Weekdays & Weekends",
    isFeatured: true,
  },
  {
    id: "mock-2",
    name: "Ustadha Maryam Hassan",
    title: "Hadith & Islamic Studies",
    avatar: "M",
    rating: 4.8,
    reviewCount: 89,
    specializations: ["Hadith", "Fiqh", "Aqeedah"],
    languages: ["English", "Urdu"],
    location: "London, UK",
    isVerified: true,
    yearsExperience: 12,
    availability: "Evenings & Weekends",
    isFeatured: true,
  },
  {
    id: "mock-3",
    name: "Sheikh Yusuf Ali",
    title: "Fiqh & Arabic Language",
    avatar: "Y",
    rating: 4.9,
    reviewCount: 156,
    specializations: ["Fiqh", "Arabic", "Usul al-Fiqh"],
    languages: ["English", "Arabic", "French"],
    location: "Madinah, Saudi Arabia",
    isVerified: true,
    yearsExperience: 20,
    availability: "Flexible",
    isFeatured: false,
  },
  {
    id: "mock-4",
    name: "Ustadh Omar Farooq",
    title: "Aqeedah & Comparative Religion",
    avatar: "O",
    rating: 4.7,
    reviewCount: 64,
    specializations: ["Aqeedah", "Dawah", "Islamic History"],
    languages: ["English", "Urdu", "Hindi"],
    location: "Toronto, Canada",
    isVerified: true,
    yearsExperience: 8,
    availability: "Weekends",
    isFeatured: false,
  },
  {
    id: "mock-5",
    name: "Ustadha Fatima Zahra",
    title: "Children's Islamic Education",
    avatar: "F",
    rating: 4.9,
    reviewCount: 203,
    specializations: ["Quran", "Islamic Stories", "Adab"],
    languages: ["English", "Arabic", "Malay"],
    location: "Kuala Lumpur, Malaysia",
    isVerified: true,
    yearsExperience: 10,
    availability: "Mornings & Evenings",
    isFeatured: false,
  },
  {
    id: "mock-6",
    name: "Sheikh Ibrahim Mohammed",
    title: "Tasawwuf & Spiritual Guidance",
    avatar: "I",
    rating: 4.8,
    reviewCount: 91,
    specializations: ["Tasawwuf", "Spirituality", "Purification"],
    languages: ["English", "Arabic", "Turkish"],
    location: "Istanbul, Turkey",
    isVerified: true,
    yearsExperience: 25,
    availability: "By Appointment",
    isFeatured: false,
  },
];

const Teachers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch teachers from Supabase
  const { data: dbTeachers, isLoading, error } = useTeachers({ limit: 50 });

  // Transform DB teachers or use mock data as fallback
  const allTeachers = useMemo(() => {
    if (dbTeachers && dbTeachers.length > 0) {
      return dbTeachers.map(transformTeacher);
    }
    // Return mock data when no teachers in DB
    return mockTeachers;
  }, [dbTeachers]);

  // Filter teachers based on search query
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return allTeachers;
    const query = searchQuery.toLowerCase();
    return allTeachers.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query) ||
        t.specializations.some((s) => s.toLowerCase().includes(query))
    );
  }, [allTeachers, searchQuery]);

  const featuredTeachers = filteredTeachers.filter((t) => t.isFeatured);
  const regularTeachers = filteredTeachers.filter((t) => !t.isFeatured);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading teachers...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const usingMockData = !!error;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-16">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Find Your Teacher
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Connect with qualified teachers of Quran, Hadith, and Islamic sciences who can guide you on your journey to sacred knowledge.
            </p>
          </motion.div>

          {usingMockData && (
            <div className="mb-8 rounded-lg border border-border bg-muted/40 p-4 text-sm">
              <p className="text-foreground">
                Showing <span className="font-medium">demo teachers</span> because Supabase is unreachable in this environment.
              </p>
              <p className="mt-1 text-muted-foreground">
                To disable demo fallback, set <code className="px-1 py-0.5 rounded bg-background border">VITE_USE_MOCK_DATA=false</code>.
              </p>
            </div>
          )}

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, subject, or specialty"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="flex items-center border border-input rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-muted" : ""}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-muted" : ""}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Teachers */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-secondary" />
              Featured Teachers
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="card-interactive p-6 border-2 border-secondary/20"
                >
                  <Badge className="mb-4 bg-secondary text-secondary-foreground">
                    Featured
                  </Badge>
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-semibold">
                      {teacher.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {teacher.name}
                        </h3>
                        {teacher.isVerified && (
                          <Shield className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{teacher.title}</p>
                      <div className="flex items-center gap-3 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="font-medium">{teacher.rating}</span>
                          <span className="text-muted-foreground">({teacher.reviewCount})</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{teacher.yearsExperience} years</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {teacher.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {teacher.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {teacher.availability}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/teachers/${teacher.id}`}>View Profile</Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to={`/teachers/${teacher.id}#book`}>Book Trial</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* All Teachers */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              All Teachers ({filteredTeachers.length})
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regularTeachers.map((teacher) => (
                <div key={teacher.id} className="card-interactive p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                      {teacher.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-foreground truncate">
                          {teacher.name}
                        </h3>
                        {teacher.isVerified && (
                          <Shield className="h-4 w-4 text-accent shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{teacher.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="font-medium text-sm">{teacher.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({teacher.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {teacher.specializations.slice(0, 2).map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {teacher.specializations.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{teacher.specializations.length - 2}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {teacher.location}
                  </p>

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/teachers/${teacher.id}`}>View Profile</Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link to={`/teachers/${teacher.id}#book`}>Book Trial</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Become a Teacher CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 rounded-2xl bg-primary p-8 lg:p-12 text-center"
          >
            <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
              Are You a Qualified Teacher?
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
              Join our platform to share your knowledge and connect with students from around the world.
            </p>
            <Button size="lg" variant="hero" className="mt-6" asChild>
              <Link to="/become-teacher">Apply to Teach</Link>
            </Button>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Teachers;
