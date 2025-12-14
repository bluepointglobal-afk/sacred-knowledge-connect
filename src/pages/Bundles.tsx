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
  Award
} from "lucide-react";

const bundles = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
    id: "6",
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
  const featuredBundles = bundles.filter((b) => b.isFeatured);
  const regularBundles = bundles.filter((b) => !b.isFeatured);

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
