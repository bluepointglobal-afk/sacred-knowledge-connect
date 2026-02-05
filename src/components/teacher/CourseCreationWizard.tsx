import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { withMockFallback } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";

export function CourseCreationWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pricePerSession, setPricePerSession] = useState<string>("");
  const [maxStudents, setMaxStudents] = useState<string>("1");

  const [isSaving, setIsSaving] = useState(false);

  const priceCents = useMemo(() => {
    const n = Number(pricePerSession);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.round(n * 100);
  }, [pricePerSession]);

  const handleCreate = async () => {
    if (!user) {
      toast({ title: "Please log in", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      // Find teacher_profile id for current user
      const teacherProfile = await withMockFallback(
        async () => {
          const { data, error } = await supabase
            .from("teacher_profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        { id: "mock-teacher-onboarded" } as any,
        "CourseCreationWizard:getTeacherProfile"
      );

      if (!teacherProfile?.id) {
        toast({
          title: "Teacher profile missing",
          description: "Please complete teacher onboarding first.",
          variant: "destructive",
        });
        navigate("/become-teacher");
        return;
      }

      const created = await withMockFallback(
        async () => {
          const { data, error } = await supabase
            .from("courses")
            .insert({
              teacher_id: teacherProfile.id,
              title: title.trim(),
              description: description.trim() || null,
              category: category.trim() || null,
              price_per_session_cents: priceCents,
              currency: "USD",
              max_students: Math.max(1, Number(maxStudents) || 1),
              status: "draft",
            })
            .select("*")
            .single();
          if (error) throw error;
          return data;
        },
        {
          id: "mock-course-1",
          teacher_id: teacherProfile.id,
          title,
          description,
          category,
          price_per_session_cents: priceCents,
          currency: "USD",
          max_students: Math.max(1, Number(maxStudents) || 1),
          status: "draft",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any,
        "CourseCreationWizard:createCourse"
      );

      toast({
        title: "Course created",
        description: "Next: set availability.",
      });

      navigate(`/teacher/courses/${(created as any).id}/availability`);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Could not create course",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your first course</CardTitle>
        <CardDescription>Minimal MVP course object (Sprint 2 builds a full wizard).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} dir="auto" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} dir="auto" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} dir="auto" placeholder="e.g., Tajweed" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price per session (USD)</Label>
          <Input id="price" value={pricePerSession} onChange={(e) => setPricePerSession(e.target.value)} inputMode="decimal" placeholder="e.g., 25" dir="auto" />
          <p className="text-xs text-muted-foreground">Stored as cents: {priceCents}</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="max">Max students</Label>
          <Input id="max" value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} inputMode="numeric" dir="auto" />
        </div>

        <Button onClick={handleCreate} disabled={isSaving}>
          Create course
        </Button>
      </CardContent>
    </Card>
  );
}
