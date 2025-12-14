import { motion } from "framer-motion";
import { Shield, BookMarked, Heart } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trusted Teachers",
    description: "Learn from verified scholars with proper ijazahs and credentials in Islamic sciences.",
  },
  {
    icon: BookMarked,
    title: "Structured Learning",
    description: "Follow curated learning bundles designed to help you progress systematically in your studies.",
  },
  {
    icon: Heart,
    title: "Respectful Environment",
    description: "Experience learning with proper adab in a space that honors Islamic etiquette and values.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Why Choose Sacred Knowledge
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-interactive p-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <value.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
