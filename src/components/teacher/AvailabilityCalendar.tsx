import { useMemo, useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";

const DOW = [
  { v: 0, label: "Sunday" },
  { v: 1, label: "Monday" },
  { v: 2, label: "Tuesday" },
  { v: 3, label: "Wednesday" },
  { v: 4, label: "Thursday" },
  { v: 5, label: "Friday" },
  { v: 6, label: "Saturday" },
];

/**
 * Convert local time (HH:MM) in a given timezone to UTC time (HH:MM).
 * This is a simplified conversion for MVP; production would use proper date-time libraries.
 */
function convertToUTC(localTime: string, timezone: string): string {
  try {
    // Create a date object in the teacher's timezone
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const localDateTimeStr = `${dateStr}T${localTime}:00`;
    
    // Parse in local timezone and convert to UTC
    const localDate = new Date(localDateTimeStr + getTimezoneOffset(timezone));
    const utcTime = localDate.toISOString().substring(11, 16); // HH:MM
    return utcTime;
  } catch {
    // Fallback: return original time if conversion fails
    return localTime;
  }
}

/**
 * Get timezone offset string for Date constructor (e.g., "+05:30" or "-08:00")
 * Simplified for MVP - in production, use Intl or date-fns-tz
 */
function getTimezoneOffset(timezone: string): string {
  try {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset);
    const minutes = Math.round((absOffset - hours) * 60);
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  } catch {
    return '+00:00';
  }
}

export function AvailabilityCalendar({ courseId }: { courseId: string }) {
  const { toast } = useToast();
  const { user } = useAuth();

  const [dayOfWeek, setDayOfWeek] = useState<string>("1");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("20:00");
  const [teacherTimezone, setTeacherTimezone] = useState<string>("UTC");
  const [isSaving, setIsSaving] = useState(false);

  const selectedLabel = useMemo(
    () => DOW.find((d) => String(d.v) === dayOfWeek)?.label ?? "",
    [dayOfWeek]
  );

  // Fetch teacher's timezone on mount
  useEffect(() => {
    if (!user) return;
    
    const fetchTeacherTimezone = async () => {
      try {
        const result = await withMockFallback(
          async () => {
            const { data, error } = await supabase
              .from("teacher_profiles")
              .select("timezone")
              .eq("user_id", user.id)
              .single();
            
            if (error) throw error;
            return data;
          },
          { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC" },
          "AvailabilityCalendar:fetchTimezone"
        );
        
        if (result?.timezone) {
          setTeacherTimezone(result.timezone);
        }
      } catch (err) {
        console.error("Could not fetch teacher timezone:", err);
      }
    };
    
    fetchTeacherTimezone();
  }, [user]);

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

    // Convert local times to UTC for storage
    const startTimeUTC = convertToUTC(startTime, teacherTimezone);
    const endTimeUTC = convertToUTC(endTime, teacherTimezone);

    setIsSaving(true);
    try {
      await withMockFallback(
        async () => {
          const { error } = await supabase.from("schedules").insert({
            course_id: courseId,
            day_of_week: Number(dayOfWeek),
            start_time: startTimeUTC, // Store in UTC
            end_time: endTimeUTC,     // Store in UTC
            timezone: teacherTimezone,
          });
          if (error) throw error;
          return true;
        },
        true,
        "AvailabilityCalendar:addSchedule"
      );

      toast({
        title: "Availability added",
        description: `${selectedLabel}: ${startTime}–${endTime} (${teacherTimezone}) → stored as UTC ${startTimeUTC}–${endTimeUTC}`,
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
          Set your weekly availability. Times are in your timezone and automatically converted to UTC for global scheduling.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-md bg-muted p-3 text-sm">
          <strong>Your timezone:</strong> {teacherTimezone}
          <p className="text-xs text-muted-foreground mt-1">
            Students in other timezones will see your availability converted to their local time.
          </p>
        </div>

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
            <Label htmlFor="start">Start time ({teacherTimezone})</Label>
            <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end">End time ({teacherTimezone})</Label>
            <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <Button onClick={handleAdd} disabled={isSaving}>
          Add availability
        </Button>
      </CardContent>
    </Card>
  );
}
