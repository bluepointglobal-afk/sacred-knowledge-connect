import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseCreationWizard } from "@/components/teacher/CourseCreationWizard";

export default function TeacherCourseNew() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-16">
        <div className="container-wide max-w-3xl">
          <CourseCreationWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
