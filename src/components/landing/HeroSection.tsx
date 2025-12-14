import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Sparkles, BookOpen, Users } from "lucide-react";

const learningGoals = [
  "Memorize Quran",
  "Perfect Tajweed",
  "Understand Hadith",
  "Explore Spirituality",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-28">
      {/* Decorative Elements */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary-foreground/5 blur-3xl" />
      
      <div className="container-wide relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Connect to{" "}
              <span className="relative">
                Sacred Knowledge
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="hsl(43, 65%, 52%)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl mx-auto lg:mx-0">
              Learn Quran, Hadith, and Islamic sciences from trusted teachers in a respectful, focused environment tailored to your journey.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="xl" variant="hero" asChild>
                <Link to="/onboarding">
                  Begin Your Journey
                </Link>
              </Button>
              <Button size="xl" variant="hero-outline" asChild>
                <Link to="/teachers">
                  Meet Our Teachers
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">500+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">50+ Teachers</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Goal Selector Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl bg-card p-8 shadow-lg">
              <div className="flex items-center gap-2 text-primary mb-6">
                <Sparkles className="h-5 w-5" />
                <span className="font-display font-semibold">What's Your Goal?</span>
              </div>
              
              <div className="space-y-3">
                {learningGoals.map((goal, index) => (
                  <motion.div
                    key={goal}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group flex items-center gap-3 rounded-xl border-2 border-transparent bg-muted/50 p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/30 group-hover:border-primary group-hover:bg-primary">
                      <Check className="h-4 w-4 text-transparent group-hover:text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{goal}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">New to Islamic studies?</span>{" "}
                  Try our Spiritual Explorer Mode
                </p>
              </div>
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 rounded-xl bg-secondary/95 p-4 shadow-lg max-w-[200px] hidden lg:block"
            >
              <p className="text-sm font-medium text-secondary-foreground">
                ✨ Personalized Learning
              </p>
              <p className="text-xs text-secondary-foreground/80 mt-1">
                Matched with teachers who understand your goals
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
