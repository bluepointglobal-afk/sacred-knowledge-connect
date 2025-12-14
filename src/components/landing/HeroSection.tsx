import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-sage-warm">
      <div className="container-wide py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left"
          >
            <h1 className="headline-hero text-foreground">
              Learn sacred
              <br />
              knowledge with
              <br />
              your perfect teacher.
            </h1>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="xl" variant="hero" asChild>
                <Link to="/onboarding" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Find your teacher
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-muted-foreground">
              Or{" "}
              <Link to="/teachers" className="text-foreground underline underline-offset-4 hover:text-primary">
                choose from 50+ verified scholars
              </Link>
            </p>
          </motion.div>

          {/* Right Content - Photo Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main Teacher Photo */}
            <div className="relative">
              {/* Background layers for depth */}
              <div className="absolute -top-4 -left-4 w-64 h-80 sm:w-80 sm:h-96 rounded-3xl bg-primary/10 -z-10" />
              <div className="absolute -top-2 -left-2 w-64 h-80 sm:w-80 sm:h-96 rounded-3xl bg-primary/20 -z-5" />
              
              {/* Main photo placeholder */}
              <div className="w-64 h-80 sm:w-80 sm:h-96 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center overflow-hidden shadow-xl">
                <div className="text-center text-primary-foreground/80">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4">
                    <span className="font-arabic text-4xl">م</span>
                  </div>
                  <p className="text-sm font-medium">Verified Teacher</p>
                </div>
              </div>

              {/* Overlay - Student video call */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-8 w-32 h-40 sm:w-40 sm:h-48 rounded-2xl bg-card shadow-lg border border-border overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-2">
                      <span className="font-arabic text-lg text-primary">ط</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </div>
                {/* Video call indicator */}
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </motion.div>

              {/* Rating badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="absolute -top-2 right-4 sm:right-8 bg-card shadow-lg rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-border"
              >
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-semibold text-foreground">4.9</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Social Proof Bar */}
      <div className="border-t border-border bg-background">
        <div className="container-wide py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="stat-card">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Students</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">50+</span>
              <span className="stat-label">Verified Teachers</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">15+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-secondary text-secondary" />
                <span className="stat-number">4.9</span>
              </div>
              <span className="stat-label">Student Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}