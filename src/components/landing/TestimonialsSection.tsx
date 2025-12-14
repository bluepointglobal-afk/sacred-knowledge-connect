import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Fatima Al-Hassan",
    role: "Quran Student",
    avatar: "F",
    content: "After years of searching for a qualified teacher, I finally found one through Sacred Knowledge. Sheikh Ahmad's patience and methodology helped me complete my memorization of Juz Amma in just 6 months.",
    rating: 5,
    subject: "Quran Memorization",
  },
  {
    name: "Omar Abdullah",
    role: "Working Professional",
    avatar: "O",
    content: "The flexibility of scheduling sessions around my work has been incredible. My teacher understands my pace and always connects the hadith teachings to practical life applications.",
    rating: 5,
    subject: "Hadith Studies",
  },
];

export function TestimonialsSection() {
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
            Stories of Transformation
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Hear from students who have embarked on their sacred knowledge journey
          </p>
          <div className="section-divider mt-6" />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-elevated p-8 relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.subject}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
