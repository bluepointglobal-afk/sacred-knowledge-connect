import { motion } from "framer-motion";

interface StepCardProps {
  number: number;
  color: "mint" | "amber" | "sky";
  title: string;
  description: string;
  children?: React.ReactNode;
}

function StepCard({ number, color, title, description, children }: StepCardProps) {
  const colorClasses = {
    mint: "bg-accent-mint text-[hsl(160,84%,20%)]",
    amber: "bg-accent-amber text-[hsl(48,60%,20%)]",
    sky: "bg-accent-sky text-[hsl(199,89%,20%)]",
  };

  return (
    <div className="card-elevated p-8 h-full flex flex-col">
      <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center text-sm font-bold mb-6`}>
        {number}
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
        {description}
      </p>
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}

export function ValuePropsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="headline-section text-foreground">
            How Sacred Knowledge works:
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <StepCard
              number={1}
              color="mint"
              title="Find your teacher."
              description="We'll match you with a verified scholar who understands your goals, learning style, and schedule."
            >
              {/* Mini teacher cards preview */}
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                    <div className="flex-1">
                      <div className="h-2 w-20 bg-muted-foreground/20 rounded" />
                      <div className="h-2 w-14 bg-muted-foreground/10 rounded mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </StepCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StepCard
              number={2}
              color="amber"
              title="Start learning."
              description="Your teacher tailors each lesson to your goals. One-on-one sessions focused on what matters to you."
            >
              {/* Video preview mockup */}
              <div className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-card shadow-md flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-primary border-b-[6px] border-b-transparent ml-1" />
                </div>
              </div>
            </StepCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StepCard
              number={3}
              color="sky"
              title="Make progress every week."
              description="Build a consistent routine and watch your knowledge grow with personalized guidance and tracking."
            >
              {/* Progress mockup */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Quran Memorization</span>
                  <span>75%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tajweed</span>
                  <span>60%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/5 bg-secondary rounded-full" />
                </div>
              </div>
            </StepCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}