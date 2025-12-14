import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-hero relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 geometric-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />

      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground mb-6">
            <Sparkles className="h-4 w-4" />
            Start Your Journey Today
          </div>
          
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
            Begin Your Journey to Sacred Knowledge
          </h2>
          
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Connect with qualified teachers and embark on a personalized learning experience that respects your pace and goals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="hero" asChild>
              <Link to="/onboarding">Create an Account</Link>
            </Button>
            <Button size="xl" variant="hero-outline" asChild>
              <Link to="/teachers">Explore Teachers</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
