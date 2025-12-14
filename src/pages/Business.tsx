import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  BookOpen, 
  Building, 
  DollarSign,
  FileText,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  Lock,
  Award,
  Globe
} from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "Halal Product Certification",
    description: "Expert guidance on halal compliance for food, cosmetics, and pharmaceuticals.",
    expertCount: 24,
    startingPrice: 500,
  },
  {
    icon: DollarSign,
    title: "Islamic Finance Advisory",
    description: "Shariah-compliant financial products, sukuk structuring, and banking solutions.",
    expertCount: 18,
    startingPrice: 750,
  },
  {
    icon: BookOpen,
    title: "Educational Curriculum",
    description: "Islamic studies curriculum development for schools and institutions.",
    expertCount: 15,
    startingPrice: 400,
  },
  {
    icon: Building,
    title: "Ethical Business Consulting",
    description: "Faith-aligned business practices, ESG frameworks, and ethical governance.",
    expertCount: 12,
    startingPrice: 600,
  },
  {
    icon: FileText,
    title: "Content & Media Review",
    description: "Scholarly review of publications, media content, and educational materials.",
    expertCount: 20,
    startingPrice: 300,
  },
  {
    icon: Users,
    title: "Workplace Accommodation",
    description: "Muslim employee needs, prayer facilities, and religious accommodation guidance.",
    expertCount: 10,
    startingPrice: 350,
  },
];

const featuredExperts = [
  {
    id: "1",
    name: "Dr. Hassan Al-Rashid",
    title: "Islamic Finance & Banking Expert",
    avatar: "H",
    rating: 4.9,
    reviewCount: 87,
    expertise: ["Islamic Finance", "Sukuk", "Banking"],
    verified: true,
  },
  {
    id: "2",
    name: "Sheikh Abdullah Yusuf",
    title: "Halal Certification Specialist",
    avatar: "A",
    rating: 4.8,
    reviewCount: 124,
    expertise: ["Halal Certification", "Food Industry", "Compliance"],
    verified: true,
  },
  {
    id: "3",
    name: "Dr. Aisha Mohammed",
    title: "Educational Curriculum Advisor",
    avatar: "A",
    rating: 4.9,
    reviewCount: 56,
    expertise: ["Curriculum Design", "Islamic Education", "Teacher Training"],
    verified: true,
  },
];

const trustPillars = [
  {
    icon: Shield,
    title: "Verified Credentials",
    description: "Every expert's qualifications and ijazahs are thoroughly verified.",
  },
  {
    icon: Lock,
    title: "Confidentiality",
    description: "NDA templates and secure communication for sensitive projects.",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "Milestone-based payments and satisfaction guarantee.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Access experts from major Islamic scholarship centers worldwide.",
  },
];

const Business = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Business Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <nav className="container-wide flex h-16 items-center justify-between">
          <Link to="/business" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
              <span className="font-arabic text-xl text-white">ع</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Sacred<span className="text-orange-500">Knowledge</span>
              <span className="text-sm font-normal text-muted-foreground ml-2">Business</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Return to Learning Platform
            </Link>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Request Consultation
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 geometric-pattern opacity-20" />
          <div className="container-wide relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-4xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl">
                Islamic Expertise for Organizations
              </h1>
              <p className="mt-6 text-xl text-primary-foreground/80">
                Verified scholars and consultants in Shariah, halal, ethics, and Islamic education — trusted by global organizations.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" className="bg-orange-500 hover:bg-orange-600">
                  Post a Project
                </Button>
                <Button size="xl" variant="hero-outline" asChild>
                  <Link to="/business/experts">Browse Experts</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
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
                Specialized Services
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Connect with experts across key areas of Islamic knowledge application
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-interactive p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 mb-4">
                    <service.icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {service.expertCount} experts
                    </span>
                    <span className="font-medium text-foreground">
                      From ${service.startingPrice}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
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
                How It Works
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {[
                { step: 1, title: "Post Your Project", description: "Describe your needs, budget, and timeline. Our AI helps you craft the perfect brief." },
                { step: 2, title: "Review Proposals", description: "Receive proposals from verified scholars matched to your requirements." },
                { step: 3, title: "Collaborate Securely", description: "Work through our platform with milestone payments and quality assurance." },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Brief Helper */}
        <section className="py-16 bg-primary">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row items-center gap-8"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 text-primary-foreground mb-4">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">AI-Powered</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl mb-4">
                  Not sure how to describe your project?
                </h2>
                <p className="text-primary-foreground/80 mb-6">
                  Our AI Brief Helper will guide you through creating the perfect project description to attract the right Islamic expertise.
                </p>
                <ul className="space-y-2 text-primary-foreground/80 mb-6">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Suggests project titles and scope
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Recommends budget ranges
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Identifies required expertise
                  </li>
                </ul>
                <Button variant="hero">
                  Try AI Brief Helper
                </Button>
              </div>
              <div className="flex-1 max-w-md">
                <div className="bg-card rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-foreground">AI Brief Helper</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on your inputs, here's a suggested project brief...
                  </p>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded-full w-full" />
                    <div className="h-3 bg-muted rounded-full w-3/4" />
                    <div className="h-3 bg-muted rounded-full w-5/6" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Experts */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
            >
              <h2 className="font-display text-3xl font-bold text-foreground">
                Featured Experts
              </h2>
              <Button variant="outline" asChild>
                <Link to="/business/experts">
                  View All Experts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {featuredExperts.map((expert, index) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-interactive p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white text-xl font-semibold">
                      {expert.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-foreground">
                          {expert.name}
                        </h3>
                        {expert.verified && (
                          <Shield className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{expert.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="font-medium">{expert.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({expert.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {expert.expertise.map((exp) => (
                      <Badge key={exp} variant="secondary" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      View Profile
                    </Button>
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                      Contact
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Pillars */}
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
                Why Organizations Trust Us
              </h2>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trustPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 mx-auto mb-4">
                    <pillar.icon className="h-7 w-7 text-orange-500" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-28 bg-gradient-hero">
          <div className="container-wide text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
                Ready to Connect with Islamic Expertise?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
                Post your project today and get matched with verified scholars who can help your organization succeed.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" className="bg-orange-500 hover:bg-orange-600">
                  Post a Project
                </Button>
                <Button size="xl" variant="hero-outline">
                  Schedule Consultation
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Business Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container-wide text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SacredChain Business. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Business;
