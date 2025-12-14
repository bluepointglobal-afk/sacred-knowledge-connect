import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

export function BecomeTeacherSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            {/* Image Side */}
            <div className="relative h-64 md:h-auto bg-gradient-to-br from-primary/40 to-primary/80 flex items-center justify-center">
              <div className="text-center text-primary-foreground/80 p-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <span className="font-arabic text-3xl">ش</span>
                </div>
                <p className="text-lg font-medium">Teach what you love</p>
              </div>
            </div>

            {/* Content Side */}
            <div className="bg-primary p-8 md:p-12 lg:p-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Become a teacher
              </h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Share your knowledge with students seeking authentic Islamic education.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Find dedicated students",
                  "Set your own schedule",
                  "Get paid securely",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-primary-foreground/90">
                    <Check className="h-5 w-5 text-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button variant="hero-light" size="lg" asChild>
                <Link to="/become-teacher" className="gap-2">
                  Apply to teach
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}