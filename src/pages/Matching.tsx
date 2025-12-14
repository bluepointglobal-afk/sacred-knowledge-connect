import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Star, 
  Shield, 
  Clock, 
  BookOpen,
  MessageSquare,
  Zap,
  CheckCircle2
} from "lucide-react";

const matchedTeachers = [
  {
    id: "1",
    name: "Sheikh Ahmad Ibrahim",
    title: "Quran & Tajweed Specialist",
    avatar: "A",
    matchPercentage: 98,
    rating: 4.9,
    reviewCount: 127,
    isVerified: true,
    matchExplanation: "Perfect match for your Quran memorization and tajweed goals",
    matchReasons: [
      { label: "Teaching Style", value: "Visual and methodical, perfect for your learning preferences" },
      { label: "Expertise", value: "Specializes in tajweed and memorization techniques" },
      { label: "Pace", value: "Patient approach for beginners" },
      { label: "Availability", value: "Matches your preferred schedule" },
    ],
    recommendedBundle: {
      title: "Complete Tajweed Mastery",
      price: 299,
      sessions: 24,
    },
  },
  {
    id: "2",
    name: "Ustadha Maryam Hassan",
    title: "Hadith & Islamic Studies",
    avatar: "M",
    matchPercentage: 95,
    rating: 4.8,
    reviewCount: 89,
    isVerified: true,
    matchExplanation: "Excellent for your interest in hadith and spiritual growth",
    matchReasons: [
      { label: "Teaching Style", value: "Interactive discussions with practical applications" },
      { label: "Expertise", value: "Deep knowledge in hadith sciences and spirituality" },
      { label: "Pace", value: "Flexible pacing based on student needs" },
      { label: "Availability", value: "Evening slots match your schedule" },
    ],
    recommendedBundle: {
      title: "40 Hadith of Imam Nawawi",
      price: 199,
      sessions: 16,
    },
  },
  {
    id: "3",
    name: "Sheikh Yusuf Ali",
    title: "Fiqh & Arabic Language",
    avatar: "Y",
    matchPercentage: 92,
    rating: 4.9,
    reviewCount: 156,
    isVerified: true,
    matchExplanation: "Great option if you want to include Arabic language studies",
    matchReasons: [
      { label: "Teaching Style", value: "Structured curriculum with clear milestones" },
      { label: "Expertise", value: "Comprehensive fiqh and classical Arabic" },
      { label: "Pace", value: "Systematic progression suitable for all levels" },
      { label: "Availability", value: "Weekend intensive options available" },
    ],
    recommendedBundle: {
      title: "Foundations of Islamic Jurisprudence",
      price: 349,
      sessions: 32,
    },
  },
];

const studentTags = [
  "Quran Memorization",
  "Tajweed Focus",
  "One-on-one",
  "Visual Learning",
  "Beginner Level",
];

const Matching = () => {
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
              Your Personalized Teacher Matches
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our AI has analyzed your preferences and found the perfect teachers for your journey
            </p>
          </motion.div>

          {/* AI Explanation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 p-6 rounded-xl bg-primary/5 border border-primary/10"
          >
            <div className="flex items-center gap-2 text-primary mb-3">
              <Sparkles className="h-5 w-5" />
              <span className="font-display font-semibold">How Our AI Matching Works</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Our advanced AI analyzes over 50 data points from your preferences, learning style, and goals to find teachers who match your unique needs. We consider teaching style, expertise areas, spiritual approach, and even subtle factors like communication style and pace of instruction.
            </p>
            <div className="flex flex-wrap gap-2">
              {studentTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Match Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Your Top Matches
              </h2>
              <p className="text-sm text-muted-foreground">98% Average Match Rate</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-secondary" />
              <span>AI-powered recommendations</span>
            </div>
          </motion.div>

          {/* Teacher Cards */}
          <div className="space-y-8">
            {matchedTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="card-elevated p-6 lg:p-8"
              >
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* Teacher Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-semibold">
                          {teacher.avatar}
                        </div>
                        <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                          {teacher.matchPercentage}%
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-xl font-semibold text-foreground">
                            {teacher.name}
                          </h3>
                          {teacher.isVerified && (
                            <Badge className="bg-accent text-accent-foreground">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{teacher.title}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-secondary text-secondary" />
                            <span className="font-medium">{teacher.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({teacher.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-primary font-medium mb-4">
                      ✨ {teacher.matchExplanation}
                    </p>

                    {/* Match Reasons */}
                    <div className="p-4 rounded-lg bg-muted/50 mb-4">
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        Why We Matched You
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {teacher.matchReasons.map((reason) => (
                          <div key={reason.label}>
                            <span className="text-sm font-medium text-foreground">
                              {reason.label}:
                            </span>
                            <p className="text-sm text-muted-foreground">{reason.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" asChild>
                        <Link to={`/teachers/${teacher.id}`}>View Full Profile</Link>
                      </Button>
                      <Button asChild>
                        <Link to={`/teachers/${teacher.id}#book`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Book Trial Session
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Recommended Bundle */}
                  <div className="lg:border-l lg:border-border lg:pl-8">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      RECOMMENDED BUNDLE
                    </h4>
                    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {teacher.recommendedBundle.title}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold text-foreground">
                          ${teacher.recommendedBundle.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {teacher.recommendedBundle.sessions} sessions
                        </span>
                      </div>
                      <Button size="sm" variant="secondary" className="w-full">
                        View Bundle
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Not finding what you're looking for?
            </p>
            <Button variant="outline" asChild>
              <Link to="/teachers">Browse All Teachers</Link>
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Matching;
