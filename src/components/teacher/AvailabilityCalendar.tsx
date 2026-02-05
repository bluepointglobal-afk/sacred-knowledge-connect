import { useEffect, useMemo, useState } from "react";
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

const FALLBACK_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Istanbul",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Dhaka",
  "Asia/Jakarta",
  "Asia/Kuala_Lumpur",
  "Asia/Singapore",
  "Asia/Bangkok",
  "Asia/Manila",
  "Asia/Tokyo",
];

function getDatePartsInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

function getTimeZoneOffsetMs(timeZone: string, date: Date): number {
  // Offset = (date-as-rendered-in-tz) - (actual date)
  const p = getDatePartsInTimeZone(date, timeZone);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUTC - date.getTime();
}

function zonedLocalToUtcDate(opts: {
  timeZone: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}): Date {
  const guess = new Date(Date.UTC(opts.year, opts.month - 1, opts.day, opts.hour, opts.minute, 0));
  const offset = getTimeZoneOffsetMs(opts.timeZone, guess);
  return new Date(guess.getTime() - offset);
}

function parseHHMM(time: string): { hour: number; minute: number } | null {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!m) return null;
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

function nextOccurrenceLocalDateInTz(timeZone: string, targetDow: number): { year: number; month: number; day: number } {
  // Find the next occurrence of targetDow in the given timezone.
  const now = new Date();
  const p = getDatePartsInTimeZone(now, timeZone);

  // Use midday to reduce DST edge cases.
  const currentUtc = zonedLocalToUtcDate({
    timeZone,
    year: p.year,
    month: p.month,
    day: p.day,
    hour: 12,
    minute: 0,
  });

  const currentDowInTz = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(currentUtc);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const currentDow = map[currentDowInTz] ?? 0;

  let daysAhead = (targetDow - currentDow + 7) % 7;
  if (daysAhead === 0) daysAhead = 7; // next occurrence (not today)

  const nextUtc = new Date(currentUtc.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  const nextParts = getDatePartsInTimeZone(nextUtc, timeZone);
  return { year: nextParts.year, month: nextParts.month, day: nextParts.day };
}

export function AvailabilityCalendar({ courseId }: { courseId: string }) {
  const { toast } = useToast();
  const { user } = useAuth();

  const tzOptions = useMemo(() => {
    const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;
    const supported = supportedValuesOf?.("timeZone");
    return supported?.length ? supported : FALLBACK_TIMEZONES;
  }, []);

  const viewerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

  const [dayOfWeek, setDayOfWeek] = useState<string>("1");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("20:00");
  const [timezone, setTimezone] = useState(viewerTimezone);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);

  const selectedLabel = useMemo(
    () => DOW.find((d) => String(d.v) === dayOfWeek)?.label ?? "",
    [dayOfWeek]
  );

  // Default timezone from teacher profile
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const run = async () => {
      setIsLoadingDefaults(true);
      try {
        const teacherTz = await withMockFallback(
          async () => {
            const { data, error } = await supabase
              .from("teacher_profiles")
              .select("timezone")
              .eq("user_id", user.id)
              .maybeSingle();
            if (error) throw error;
            return (data as { timezone?: string } | null)?.timezone ?? null;
          },
          null,
          "AvailabilityCalendar:loadTeacherTimezone"
        );

        if (!cancelled && teacherTz) setTimezone(teacherTz);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setIsLoadingDefaults(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const convertedPreview = useMemo(() => {
    const s = parseHHMM(startTime);
    const e = parseHHMM(endTime);
    if (!s || !e) return null;

    const targetDow = Number(dayOfWeek);
    const next = nextOccurrenceLocalDateInTz(timezone, targetDow);

    const startUtc = zonedLocalToUtcDate({ timeZone: timezone, ...next, hour: s.hour, minute: s.minute });
    const endUtc = zonedLocalToUtcDate({ timeZone: timezone, ...next, hour: e.hour, minute: e.minute });

    const fmt = (d: Date, tz: string) =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d);

    return {
      viewer: `${fmt(startUtc, viewerTimezone)} – ${fmt(endUtc, viewerTimezone)} (${viewerTimezone})`,
      teacher: `${fmt(startUtc, timezone)} – ${fmt(endUtc, timezone)} (${timezone})`,
    };
  }, [dayOfWeek, startTime, endTime, timezone, viewerTimezone]);

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
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "Could not save availability",
        description: err instanceof Error ? err.message : "Please try again.",
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
          Weekly blocks stored with a timezone. Students can view the same times converted into their local timezone.
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
          <Label>Teacher timezone</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {tzOptions.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {isLoadingDefaults
              ? "Loading your timezone…"
              : `Default is your profile timezone (if set). Viewer timezone: ${viewerTimezone}.`}
          </p>
        </div>

        {convertedPreview && timezone !== viewerTimezone && (
          <div className="rounded-md border p-3 text-sm">
            <div className="font-medium">Preview conversion</div>
            <div className="text-muted-foreground">Teacher time: {convertedPreview.teacher}</div>
            <div className="text-muted-foreground">Viewer time: {convertedPreview.viewer}</div>
          </div>
        )}

        <Button onClick={handleAdd} disabled={isSaving}>
          Add availability
        </Button>
      </CardContent>
    </Card>
  );
}
