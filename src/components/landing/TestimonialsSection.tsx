import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Fatima Al-Hassan",
    subject: "Quran Memorization",
    content: "After years of searching for a qualified teacher, I finally found one through Sacred Knowledge. Sheikh Ahmad's patience and methodology helped me complete my memorization of Juz Amma in just 6 months.",
    rating: 5,
  },
  {
    name: "Omar Abdullah",
    subject: "Hadith Studies",
    content: "The flexibility of scheduling sessions around my work has been incredible. My teacher understands my pace and always connects the hadith teachings to practical life applications.",
    rating: 5,
  },
  {
    name: "Aisha Rahman",
    subject: "Tajweed",
    content: "I was nervous about my pronunciation, but Ustadha Maryam was so encouraging. Now I can recite with confidence, and my family notices the improvement in every prayer.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
            Thousands of students. Hundreds of scholars.
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Journeys that transform.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 z-10 rounded-full hidden md:flex"
            onClick={prev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 z-10 rounded-full hidden md:flex"
            onClick={next}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Testimonial Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="card-elevated p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Photo Stack */}
              <div className="relative flex-shrink-0">
                <div className="photo-stack">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
                    <span className="font-arabic text-3xl md:text-4xl text-primary-foreground/80">
                      {testimonials[currentIndex].name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                <div>
                  <p className="font-semibold text-foreground">
                    — {testimonials[currentIndex].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].subject}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}