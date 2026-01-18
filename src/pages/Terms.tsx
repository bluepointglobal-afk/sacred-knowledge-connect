import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-20">
        <div className="container-wide max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-4xl font-bold text-foreground mb-8">
              Terms of Service
            </h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: January 2026
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground">
                  By accessing or using SacredChain, you agree to be bound by these Terms
                  of Service. If you do not agree to these terms, please do not use our
                  services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  2. Description of Service
                </h2>
                <p className="text-muted-foreground">
                  SacredChain is an online platform connecting students with qualified
                  Islamic scholars for personalized learning experiences. We facilitate
                  the connection but are not directly responsible for the content taught
                  by individual teachers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  3. User Accounts
                </h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must be at least 13 years old to use our services</li>
                  <li>One person may not maintain more than one account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  4. Teacher Verification
                </h2>
                <p className="text-muted-foreground">
                  We verify teachers through a comprehensive review process including
                  credential verification and background checks. However, students should
                  exercise their own judgment when selecting teachers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  5. Payments and Refunds
                </h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Payments are processed securely through third-party providers</li>
                  <li>Refund requests must be submitted within 14 days of enrollment</li>
                  <li>Refunds are prorated based on sessions completed</li>
                  <li>Teachers set their own pricing for bundles</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  6. Code of Conduct
                </h2>
                <p className="text-muted-foreground mb-4">Users agree to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Treat all users with respect and dignity</li>
                  <li>Not engage in harassment or discriminatory behavior</li>
                  <li>Not share inappropriate or harmful content</li>
                  <li>Attend scheduled sessions or provide timely cancellation notice</li>
                  <li>Provide honest feedback and reviews</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  7. Intellectual Property
                </h2>
                <p className="text-muted-foreground">
                  All content on SacredChain, including but not limited to text, graphics,
                  logos, and software, is the property of SacredChain or its licensors
                  and is protected by intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  SacredChain is provided "as is" without warranties of any kind. We are
                  not liable for any indirect, incidental, or consequential damages
                  arising from your use of our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  9. Changes to Terms
                </h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. We will notify
                  users of significant changes via email or platform notification.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  10. Contact
                </h2>
                <p className="text-muted-foreground">
                  For questions about these Terms, contact us at{" "}
                  <a href="mailto:legal@sacredchain.com" className="text-primary hover:underline">
                    legal@sacredchain.com
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
