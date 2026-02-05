import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { withMockFallback } from "@/lib/mock-data";

const DOW = [
  { v: 0, label: "Sunday" },
  { v: 1, label: "Monday" },
  { v: 2, label: "Tuesday" },
  { v: 3, label: "Wednesday" },
  { v: 4, label: "Thursday" },
  { v: 5, label: "Friday" },
  { v: 6, label: "Saturday" },
];

export function AvailabilityCalendar({ courseId }: { courseId: string }) {
  const { toast } = useToast();

  const [dayOfWeek, setDayOfWeek] = useState<string>("1");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("20:00");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC"
  );

  const [isSaving, setIsSaving] = useState(false);

  const selectedLabel = useMemo(
    () => DOW.find((d) => String(d.v) === dayOfWeek)?.label ?? "",
    [dayOfWeek]
  );

  const handleAdd = async () => {
    if (!courseId) return;
    if (!startTime || !endTime || startTime >= endTime) {
      toast({
        title: "Invalid time range",
        description: "Start time must be before end time.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await withMockFallback(
        async () => {
          const { error } = await supabase.from("schedules").insert({
            course_id: courseId,
            day_of_week: Number(dayOfWeek),
            start_time: startTime,
            end_time: endTime,
            timezone: timezone || "UTC",
          });
          if (error) throw error;
          return true;
        },
        true,
        "AvailabilityCalendar:addSchedule"
      );

      toast({
        title: "Availability added",
        description: `${selectedLabel}: ${startTime}–${endTime} (${timezone})`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Could not save availability",
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
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          MVP weekly schedule blocks (Sprint 3 expands to a full calendar UI).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2">
          <Label>Day of week</Label>
          <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {DOW.map((d) => (
                <SelectItem key={d.v} value={String(d.v)}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start">Start time</Label>
            <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end">End time</Label>
            <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tz">Timezone</Label>
          <Input id="tz" value={timezone} onChange={(e) => setTimezone(e.target.value)} dir="auto" placeholder="e.g., Asia/Riyadh" />
        </div>

        <Button onClick={handleAdd} disabled={isSaving}>
          Add availability
        </Button>
      </CardContent>
    </Card>
  );
}
