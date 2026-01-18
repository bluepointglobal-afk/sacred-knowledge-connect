import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Search,
  UserCheck,
  Calendar,
  BookOpen,
  MessageSquare,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Teachers & Bundles",
    description:
      "Explore our curated selection of verified Islamic scholars and their learning bundles. Filter by subject, level, and teaching style.",
  },
  {
    icon: UserCheck,
    title: "Complete Your Profile",
    description:
      "Tell us about your learning goals, preferred schedule, and any specific requirements. This helps us personalize your experience.",
  },
  {
    icon: Calendar,
    title: "Schedule Sessions",
    description:
      "Once enrolled, schedule one-on-one sessions with your teacher at times that work for both of you.",
  },
  {
    icon: BookOpen,
    title: "Learn & Progress",
    description:
      "Attend sessions via video call, track your progress, and complete your curriculum at your own pace.",
  },
  {
    icon: MessageSquare,
    title: "Provide Feedback",
    description:
      "After each session, share your feedback to help teachers improve and help other students find the right fit.",
  },
  {
    icon: GraduationCap,
    title: "Achieve Your Goals",
    description:
      "Complete bundles, earn certificates, and continue your journey of sacred knowledge.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-20">
        <div className="container-wide">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
              How SacredChain Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Your journey to authentic Islamic knowledge starts here. Follow
              these simple steps to begin learning with qualified scholars.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-xl border border-border bg-card p-6"
              >
                <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 p-8 lg:p-12"
          >
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join thousands of students on their journey to deeper Islamic
              knowledge with verified scholars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/onboarding">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/teachers">Browse Teachers</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
