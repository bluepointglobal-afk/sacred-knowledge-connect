import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const subjects = [
  {
    arabicLetter: "ق",
    title: "Quran",
    description: "Memorization, Tajweed, Tafsir",
    color: "from-primary to-teal-light",
    href: "/bundles?subject=quran",
  },
  {
    arabicLetter: "ح",
    title: "Hadith",
    description: "Collections, Methodology, Explanation",
    color: "from-secondary to-gold-light",
    href: "/bundles?subject=hadith",
  },
  {
    arabicLetter: "ف",
    title: "Fiqh",
    description: "Islamic Jurisprudence, Madhabs",
    color: "from-accent to-emerald-400",
    href: "/bundles?subject=fiqh",
  },
  {
    arabicLetter: "ع",
    title: "Aqeedah",
    description: "Islamic Theology, Creed",
    color: "from-teal-dark to-primary",
    href: "/bundles?subject=aqeedah",
  },
];

export function SubjectsSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Explore Sacred Subjects
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Discover comprehensive learning paths in the core disciplines of Islamic knowledge
          </p>
          <div className="section-divider mt-6" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={subject.href}
                className="group block card-interactive p-6 h-full"
              >
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${subject.color}`}>
                  <span className="font-arabic text-3xl text-primary-foreground">
                    {subject.arabicLetter}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {subject.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {subject.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            View All Subjects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
