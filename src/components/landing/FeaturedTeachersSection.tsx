import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Shield, MessageCircle, Heart, Clock, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featuredTeachers = [
  {
    id: "1",
    name: "Sheikh Ahmad Al-Nouri",
    title: "Quran & Tajweed Specialist",
    avatar: "أ",
    rating: 4.9,
    reviewCount: 127,
    activeStudents: 42,
    totalLessons: 1200,
    specializations: ["Quran Memorization", "Tajweed"],
    languages: ["Arabic (Native)", "English", "Urdu"],
    isVerified: true,
    isSuperTeacher: true,
    hourlyRate: 25,
    bio: "Certified Quran teacher with ijazah in Hafs 'an Asim. 15+ years helping students perfect their recitation...",
    responseTime: "1 hour",
    bookingsThisWeek: 8,
  },
  {
    id: "2",
    name: "Ustadha Maryam Hassan",
    title: "Hadith & Islamic Studies",
    avatar: "م",
    rating: 4.8,
    reviewCount: 89,
    activeStudents: 28,
    totalLessons: 650,
    specializations: ["Hadith", "Fiqh"],
    languages: ["English", "Urdu"],
    isVerified: true,
    isSuperTeacher: false,
    hourlyRate: 20,
    bio: "Graduate of Al-Azhar University with specialization in Hadith sciences. Passionate about making Islamic knowledge accessible...",
    responseTime: "2 hours",
    bookingsThisWeek: 5,
  },
  {
    id: "3",
    name: "Sheikh Yusuf Ali",
    title: "Fiqh & Arabic Language",
    avatar: "ي",
    rating: 4.9,
    reviewCount: 156,
    activeStudents: 35,
    totalLessons: 2100,
    specializations: ["Fiqh", "Arabic"],
    languages: ["Arabic (Native)", "English", "French"],
    isVerified: true,
    isSuperTeacher: true,
    hourlyRate: 30,
    bio: "20 years of teaching experience across multiple countries. Expert in Hanafi and comparative fiqh...",
    responseTime: "1 hour",
    bookingsThisWeek: 11,
  },
];

export function FeaturedTeachersSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="headline-section text-foreground">
            Featured teachers
          </h2>
        </motion.div>

        <div className="space-y-6">
          {featuredTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card-elevated p-6 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Teacher Avatar & Badges */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
                      <span className="font-arabic text-4xl text-primary-foreground/90">
                        {teacher.avatar}
                      </span>
                    </div>
                    {/* Country flag placeholder */}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border-2 border-card shadow flex items-center justify-center text-xs">
                      🇯🇴
                    </div>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="flex-1 min-w-0">
                  {/* Name & Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {teacher.name}
                    </h3>
                    {teacher.isVerified && (
                      <Badge variant="secondary" className="badge-mint text-xs px-2 py-0.5">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {teacher.isSuperTeacher && (
                      <Badge variant="secondary" className="badge-amber text-xs px-2 py-0.5">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Super Teacher
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {teacher.title}
                  </p>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="font-semibold text-foreground">{teacher.rating}</span>
                    </span>
                    <span className="text-muted-foreground">
                      <Users className="h-4 w-4 inline mr-1" />
                      {teacher.activeStudents} active students
                    </span>
                    <span className="text-muted-foreground">
                      {teacher.totalLessons.toLocaleString()} lessons
                    </span>
                  </div>

                  {/* Languages */}
                  <p className="text-sm text-muted-foreground mb-3">
                    🗣️ {teacher.languages.join(", ")}
                  </p>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    "{teacher.bio}"
                    <button className="text-primary hover:underline ml-1">Read more</button>
                  </p>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2">
                    {teacher.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex-shrink-0 flex flex-col gap-3 lg:w-48">
                  <div className="text-right mb-2">
                    <span className="text-2xl font-bold text-foreground">${teacher.hourlyRate}</span>
                    <span className="text-sm text-muted-foreground"> /lesson</span>
                  </div>

                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to={`/teachers/${teacher.id}#book`}>
                      Book trial lesson
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to={`/teachers/${teacher.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send message
                    </Link>
                  </Button>

                  {/* Urgency Indicators */}
                  <div className="text-xs text-muted-foreground space-y-1 mt-2">
                    <div className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-destructive" />
                      <span>Super popular</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Responds in {teacher.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/teachers">
              View all teachers
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}