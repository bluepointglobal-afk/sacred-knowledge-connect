import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionCheckout } from "@/hooks/usePayments";
import { formatCurrency } from "@/lib/stripe";
import { Loader2, Calendar as CalendarIcon, Clock, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

interface SessionCheckoutButtonProps {
  teacherId: string;
  teacherName: string;
  hourlyRateCents: number;
  currency?: string;
  className?: string;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

const durationOptions = [
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

export function SessionCheckoutButton({
  teacherId,
  teacherName,
  hourlyRateCents,
  currency = "usd",
  className,
}: SessionCheckoutButtonProps) {
  const { user } = useAuth();
  const { mutate: checkout, isPending } = useSessionCheckout();

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);

  // Calculate price based on duration
  const priceInCents = Math.round((hourlyRateCents * duration) / 60);

  const handleCheckout = () => {
    if (!selectedDate || !selectedTime) return;

    // Combine date and time
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    checkout({
      teacherId,
      scheduledAt: scheduledAt.toISOString(),
      durationMinutes: duration,
      title: `Session with ${teacherName}`,
    });
  };

  // If not logged in, show login prompt
  if (!user) {
    return (
      <Button className={className} asChild>
        <Link to="/login?redirect=/teachers">Sign in to Book</Link>
      </Button>
    );
  }

  const isFormValid = selectedDate && selectedTime;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Book Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session with {teacherName}</DialogTitle>
          <DialogDescription>
            Choose your preferred date, time, and duration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Duration Selection */}
          <div className="space-y-2">
            <Label>Session Duration</Label>
            <Select
              value={String(duration)}
              onValueChange={(v) => setDuration(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              className="rounded-md border"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Select Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Summary */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {duration} min session
              </span>
              <span className="font-medium">
                {formatCurrency(priceInCents, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(priceInCents, currency)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={!isFormValid || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay {formatCurrency(priceInCents, currency)}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment powered by Stripe. Your payment will be held until the session is completed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
