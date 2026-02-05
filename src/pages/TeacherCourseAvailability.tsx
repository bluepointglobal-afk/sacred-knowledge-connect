import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AvailabilityCalendar } from "@/components/teacher/AvailabilityCalendar";

export default function TeacherCourseAvailability() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-16">
        <div className="container-wide max-w-3xl">
          {id ? <AvailabilityCalendar courseId={id} /> : <p>Missing course id.</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
