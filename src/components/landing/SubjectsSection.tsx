import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const subjects = [
  {
    icon: "🕌",
    title: "Quran Studies",
    teacherCount: 127,
    href: "/bundles?subject=quran",
  },
  {
    icon: "📿",
    title: "Hadith Sciences",
    teacherCount: 43,
    href: "/bundles?subject=hadith",
  },
  {
    icon: "⚖️",
    title: "Fiqh",
    teacherCount: 38,
    href: "/bundles?subject=fiqh",
  },
  {
    icon: "🌙",
    title: "Aqeedah",
    teacherCount: 31,
    href: "/bundles?subject=aqeedah",
  },
  {
    icon: "🌿",
    title: "Tazkiyah",
    teacherCount: 25,
    href: "/bundles?subject=tazkiyah",
  },
  {
    icon: "📖",
    title: "Arabic",
    teacherCount: 52,
    href: "/bundles?subject=arabic",
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
          className="mb-10"
        >
          <h2 className="headline-section text-foreground">
            Explore subjects
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={subject.href}
                className="group flex items-center justify-between p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{subject.icon}</span>
                  <div>
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {subject.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {subject.teacherCount} teachers
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            + Show more
          </Link>
        </motion.div>
      </div>
    </section>
  );
}