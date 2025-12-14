import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featuredTeachers = [
  {
    id: "1",
    name: "Sheikh Ahmad Ibrahim",
    title: "Quran & Tajweed Specialist",
    avatar: "A",
    rating: 4.9,
    reviewCount: 127,
    specializations: ["Quran Memorization", "Tajweed", "Tafsir"],
    languages: ["English", "Arabic"],
    isVerified: true,
    yearsExperience: 15,
  },
  {
    id: "2",
    name: "Ustadha Maryam Hassan",
    title: "Hadith & Islamic Studies",
    avatar: "M",
    rating: 4.8,
    reviewCount: 89,
    specializations: ["Hadith", "Fiqh", "Aqeedah"],
    languages: ["English", "Urdu"],
    isVerified: true,
    yearsExperience: 12,
  },
  {
    id: "3",
    name: "Sheikh Yusuf Ali",
    title: "Fiqh & Arabic Language",
    avatar: "Y",
    rating: 4.9,
    reviewCount: 156,
    specializations: ["Fiqh", "Arabic", "Usul al-Fiqh"],
    languages: ["English", "Arabic", "French"],
    isVerified: true,
    yearsExperience: 20,
  },
];

export function FeaturedTeachersSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Featured Teachers
            </h2>
            <p className="mt-2 text-muted-foreground">
              Learn from our top-rated and verified scholars
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/teachers">
              View All Teachers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-interactive p-6"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
                  {teacher.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold text-foreground">
                      {teacher.name}
                    </h3>
                    {teacher.isVerified && (
                      <Shield className="h-4 w-4 text-accent" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{teacher.title}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="font-medium text-foreground">{teacher.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({teacher.reviewCount} reviews)
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {teacher.yearsExperience} years
                </span>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-2 mb-4">
                {teacher.specializations.map((spec) => (
                  <Badge key={spec} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>

              {/* Languages */}
              <p className="text-sm text-muted-foreground mb-4">
                Languages: {teacher.languages.join(", ")}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/teachers/${teacher.id}`}>View Profile</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link to={`/teachers/${teacher.id}#book`}>Book Trial</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
