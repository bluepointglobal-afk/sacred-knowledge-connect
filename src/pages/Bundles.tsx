import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Clock,
  Calendar,
  BookOpen,
  Award,
  Loader2
} from "lucide-react";
import { useBundles } from "@/hooks/useBundles";
import type { BundleWithTeacher } from "@/types/database";

// Helper to transform database bundle to UI format
interface BundleUI {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionLength: number;
  price: number;
  teacher: {
    name: string;
    avatar: string;
    rating: number;
  };
  isFeatured: boolean;
}

function transformBundle(bundle: BundleWithTeacher): BundleUI {
  const teacherProfile = bundle.teacher_profiles;
  const profile = teacherProfile?.profiles;
  const teacherName = profile?.full_name || profile?.email?.split("@")[0] || "Teacher";

  return {
    id: bundle.id,
    title: bundle.title,
    description: bundle.description || bundle.short_description || "",
    subject: bundle.category || "Islamic Studies",
    level: bundle.level || "All Levels",
    durationWeeks: bundle.duration_weeks || 0,
    sessionsPerWeek: Math.ceil((bundle.total_sessions || 0) / Math.max(bundle.duration_weeks || 1, 1)),
    sessionLength: 60, // Default - could be stored in bundle_items
    price: Math.round((bundle.price_cents || 0) / 100),
    teacher: {
      name: teacherName,
      avatar: teacherName.charAt(0).toUpperCase(),
      rating: teacherProfile?.average_rating || 0,
    },
    isFeatured: bundle.is_featured,
  };
}

// Mock data for development fallback (shown when no bundles in DB)
const mockBundles: BundleUI[] = [
  {
    id: "mock-1",
    title: "Complete Tajweed Mastery",
    description: "Master the art of Quranic recitation with proper pronunciation and rules of tajweed from the basics to advanced levels.",
    subject: "Quran",
    level: "All Levels",
    durationWeeks: 12,
    sessionsPerWeek: 3,
    sessionLength: 45,
    price: 299,
    teacher: {
      name: "Sheikh Ahmad Ibrahim",
      avatar: "A",
      rating: 4.9,
    },
    isFeatured: true,
  },
  {
    id: "mock-2",
    title: "40 Hadith of Imam Nawawi",
    description: "Deep dive into the foundational 40 hadith compiled by Imam Nawawi, understanding their meanings and practical applications.",
    subject: "Hadith",
    level: "Intermediate",
    durationWeeks: 8,
    sessionsPerWeek: 2,
    sessionLength: 60,
    price: 199,
    teacher: {
      name: "Ustadha Maryam Hassan",
      avatar: "M",
      rating: 4.8,
    },
    isFeatured: true,
  },
  {
    id: "mock-3",
    title: "Foundations of Islamic Jurisprudence",
    description: "Learn the principles of fiqh and understand how Islamic rulings are derived from primary sources.",
    subject: "Fiqh",
    level: "Beginner",
    durationWeeks: 16,
    sessionsPerWeek: 2,
    sessionLength: 60,
    price: 349,
    teacher: {
      name: "Sheikh Yusuf Ali",
      avatar: "Y",
      rating: 4.9,
    },
    isFeatured: true,
  },
  {
    id: "mock-4",
    title: "Juz Amma Memorization",
    description: "Memorize the 30th Juz of the Quran with proper tajweed and understanding of the verses.",
    subject: "Quran",
    level: "Beginner",
    durationWeeks: 10,
    sessionsPerWeek: 3,
    sessionLength: 30,
    price: 199,
    teacher: {
      name: "Sheikh Ahmad Ibrahim",
      avatar: "A",
      rating: 4.9,
    },
    isFeatured: false,
  },
  {
    id: "mock-5",
    title: "Islamic Creed Essentials",
    description: "Understand the fundamental beliefs of Islam through classical texts and contemporary explanations.",
    subject: "Aqeedah",
    level: "All Levels",
    durationWeeks: 6,
    sessionsPerWeek: 2,
    sessionLength: 45,
    price: 149,
    teacher: {
      name: "Ustadh Omar Farooq",
      avatar: "O",
      rating: 4.7,
    },
    isFeatured: false,
  },
  {
    id: "mock-6",
    title: "Purification of the Soul",
    description: "A journey into the science of tasawwuf and spiritual development according to the Quran and Sunnah.",
    subject: "Spirituality",
    level: "Intermediate",
    durationWeeks: 12,
    sessionsPerWeek: 1,
    sessionLength: 90,
    price: 249,
    teacher: {
      name: "Sheikh Ibrahim Mohammed",
      avatar: "I",
      rating: 4.8,
    },
    isFeatured: false,
  },
];

const subjectColors: Record<string, string> = {
  Quran: "bg-primary/10 text-primary",
  Hadith: "bg-secondary/20 text-secondary-foreground",
  Fiqh: "bg-accent/10 text-accent",
  Aqeedah: "bg-teal-dark/10 text-teal-dark",
  Spirituality: "bg-gold/20 text-secondary-foreground",
};

const Bundles = () => {
  // Fetch bundles from Supabase
  const { data: dbBundles, isLoading, error } = useBundles({ limit: 50 });

  // Transform DB bundles or use mock data as fallback
  const allBundles = useMemo(() => {
    if (dbBundles && dbBundles.length > 0) {
      return dbBundles.map(transformBundle);
    }
    // Return mock data when no bundles in DB
    return mockBundles;
  }, [dbBundles]);

  const featuredBundles = allBundles.filter((b) => b.isFeatured);
  const regularBundles = allBundles.filter((b) => !b.isFeatured);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading bundles...</p>
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
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-16 lg:py-20">
          <div className="container-wide text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl"
            >
              Learning Bundles
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto"
            >
              Structured learning paths designed by qualified teachers to help you progress systematically in your Islamic studies.
            </motion.p>
          </div>
        </section>

        <div className="container-wide py-12 lg:py-16">
          {usingMockData && (
            <div className="mb-8 rounded-lg border border-border bg-muted/40 p-4 text-sm">
              <p className="text-foreground">
                Showing <span className="font-medium">demo bundles</span> because Supabase is unreachable in this environment.
              </p>
              <p className="mt-1 text-muted-foreground">
                To disable demo fallback, set <code className="px-1 py-0.5 rounded bg-background border">VITE_USE_MOCK_DATA=false</code>.
              </p>
            </div>
          )}

          {/* Featured Bundles */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-secondary" />
              Featured Bundles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="card-interactive p-6 border-2 border-secondary/20 relative"
                >
                  <div className="absolute -top-3 -right-3">
                    <Badge className="bg-secondary text-secondary-foreground">
                      Featured
                    </Badge>
                  </div>
                  
                  <Badge className={`mb-3 ${subjectColors[bundle.subject] || "bg-muted"}`}>
                    {bundle.subject}
                  </Badge>
                  
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {bundle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {bundle.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {bundle.durationWeeks} weeks
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {bundle.sessionsPerWeek}x/week
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {bundle.sessionLength} min
                    </div>
                  </div>

                  <Badge variant="outline" className="mb-4">
                    {bundle.level}
                  </Badge>

                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {bundle.teacher.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{bundle.teacher.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-secondary text-secondary" />
                        <span className="text-xs text-muted-foreground">{bundle.teacher.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">${bundle.price}</span>
                      <span className="text-sm text-muted-foreground"> / bundle</span>
                    </div>
                    <Button asChild>
                      <Link to={`/bundles/${bundle.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* All Bundles */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              All Learning Bundles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regularBundles.map((bundle) => (
                <div key={bundle.id} className="card-interactive p-6">
                  <Badge className={`mb-3 ${subjectColors[bundle.subject] || "bg-muted"}`}>
                    {bundle.subject}
                  </Badge>
                  
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {bundle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {bundle.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {bundle.durationWeeks} weeks
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {bundle.sessionsPerWeek}x/week
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {bundle.teacher.avatar}
                    </div>
                    <p className="text-sm text-foreground">{bundle.teacher.name}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xl font-bold text-foreground">${bundle.price}</span>
                    <Button size="sm" asChild>
                      <Link to={`/bundles/${bundle.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Ready to Begin Your Learning Journey?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Create an account to access personalized recommendations and book your first session.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/onboarding">Create an Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/teachers">Browse Teachers</Link>
              </Button>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bundles;
