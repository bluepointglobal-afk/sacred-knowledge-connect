import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { withMockFallback, MOCK_TEACHERS } from "@/lib/mock-data";

const EXPERIENCE_LEVELS = ["beginner", "intermediate", "expert"] as const;
const PAYOUT_METHODS = ["wise", "paypal", "iban"] as const;

type PayoutMethod = (typeof PAYOUT_METHODS)[number];

function normalizeSpecializations(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeIban(input: string): string {
  return input.replace(/\s+/g, "").toUpperCase();
}

function isValidIban(input: string): boolean {
  const iban = normalizeIban(input);
  // Lightweight client-side validation (format only). Server-side validation can be stricter.
  return /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban);
}

function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

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

const BANK_COUNTRIES = [
  "Morocco",
  "Algeria",
  "Tunisia",
  "Egypt",
  "Pakistan",
  "Bangladesh",
  "Indonesia",
  "Malaysia",
  "Turkey",
  "United Kingdom",
  "United States",
  "Canada",
  "Germany",
  "France",
  "Netherlands",
  "Spain",
  "Italy",
  "Other",
];

export function TeacherOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUpWithEmail } = useAuth();

  // Account fields (for logged-out users)
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [awaitingEmailVerification, setAwaitingEmailVerification] = useState(false);

  // Teacher profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<(typeof EXPERIENCE_LEVELS)[number] | "">("");
  const [credentialsUrl, setCredentialsUrl] = useState("");
  const [availabilityPref, setAvailabilityPref] = useState("");

  // Global payout + scheduling fields
  const tzOptions = useMemo(() => {
    const supported = (Intl as any).supportedValuesOf?.("timeZone") as string[] | undefined;
    return supported?.length ? supported : FALLBACK_TIMEZONES;
  }, []);

  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC"
  );

  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod | "">("");
  const [payoutAccountHolderName, setPayoutAccountHolderName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankCountry, setBankCountry] = useState("");
  const [ibanNumber, setIbanNumber] = useState("");
  const [wiseAccount, setWiseAccount] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const specializationTags = useMemo(() => normalizeSpecializations(specialization), [specialization]);

  const handleCreateAccount = async () => {
    setIsSubmitting(true);
    try {
      const { error, autoLoggedIn } = (await signUpWithEmail(signupEmail, signupPassword)) as any;
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message ?? "Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!autoLoggedIn) {
        setAwaitingEmailVerification(true);
        toast({
          title: "Check your email",
          description: "Please confirm your email address, then come back to complete your teacher profile.",
        });
      } else {
        toast({
          title: "Account created",
          description: "Now complete your teacher profile to go live.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitProfile = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "Create an account or log in to become a teacher.",
        variant: "destructive",
      });
      return;
    }

    if (!fullName.trim()) {
      toast({ title: "Full name is required", variant: "destructive" });
      return;
    }

    if (!timezone) {
      toast({ title: "Timezone is required", description: "Select your timezone for scheduling.", variant: "destructive" });
      return;
    }

    if (!payoutMethod) {
      toast({
        title: "Payout method is required",
        description: "Select how you want to receive payouts (you can update later).",
        variant: "destructive",
      });
      return;
    }

    if (!payoutAccountHolderName.trim()) {
      toast({ title: "Account holder name is required", variant: "destructive" });
      return;
    }

    if (payoutMethod === "paypal") {
      if (!paypalEmail.trim() || !isValidEmail(paypalEmail)) {
        toast({ title: "Valid PayPal email is required", variant: "destructive" });
        return;
      }
    }

    if (payoutMethod === "wise") {
      if (!wiseAccount.trim()) {
        toast({ title: "Wise account is required", description: "Enter the email/identifier used for your Wise account.", variant: "destructive" });
        return;
      }
    }

    if (payoutMethod === "iban") {
      if (!bankCountry.trim()) {
        toast({ title: "Bank country is required", variant: "destructive" });
        return;
      }
      if (!ibanNumber.trim() || !isValidIban(ibanNumber)) {
        toast({ title: "Valid IBAN is required", description: "Please check the IBAN format.", variant: "destructive" });
        return;
      }
    }

    const ibanOrAccountNumber =
      payoutMethod === "iban"
        ? normalizeIban(ibanNumber)
        : payoutMethod === "paypal"
          ? paypalEmail.trim()
          : wiseAccount.trim();

    setIsSubmitting(true);

    try {
      // 1) Update base profile (name + role)
      await withMockFallback(
        async () => {
          const { error } = await supabase
            .from("profiles")
            .update({
              full_name: fullName.trim(),
              role: "teacher",
            })
            .eq("id", user.id);

          if (error) throw error;
          return true;
        },
        true,
        "TeacherOnboarding:updateProfile"
      );

      // 2) Create teacher_profiles row
      const teacherProfile = await withMockFallback(
        async () => {
          const { data, error } = await supabase
            .from("teacher_profiles")
            .insert({
              user_id: user.id,
              bio: bio.trim() || null,
              specializations: specializationTags,
              experience_level: experienceLevel || null,
              phone: phone.trim() || null,
              credentials_url: credentialsUrl.trim() || null,
              availability: {
                preference: availabilityPref.trim() || null,
              },
              timezone,
              payout_method: payoutMethod,
              iban_or_account_number: ibanOrAccountNumber || null,
              country_of_bank: payoutMethod === "iban" ? (bankCountry.trim() || null) : null,
              payout_account_holder_name: payoutAccountHolderName.trim() || null,
            })
            .select("*")
            .single();

          if (error) throw error;
          return data;
        },
        {
          ...MOCK_TEACHERS[0],
          id: "mock-teacher-onboarded",
          user_id: user.id,
          bio,
          specializations: specializationTags,
          timezone,
          payout_method: payoutMethod,
          iban_or_account_number: ibanOrAccountNumber,
          country_of_bank: bankCountry,
          payout_account_holder_name: payoutAccountHolderName,
        } as any,
        "TeacherOnboarding:createTeacherProfile"
      );

      toast({
        title: "Teacher profile created",
        description: "Next: create your first course.",
      });

      // Redirect to course creation flow
      navigate("/teacher/courses/new", { state: { teacherProfileId: (teacherProfile as any)?.id } });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Could not submit profile",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-16">
        <div className="container-wide max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Become a Teacher</h1>
            <p className="text-muted-foreground mt-2">
              Create your teacher profile and publish your first course.
            </p>
          </div>

          {!user && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Already have an account?{" "}
                  <Link className="underline" to="/login">
                    Log in
                  </Link>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="teacher@example.com"
                    dir="auto"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    dir="auto"
                  />
                </div>
                <Button
                  onClick={handleCreateAccount}
                  disabled={isSubmitting || !signupEmail || !signupPassword}
                >
                  Create account
                </Button>
                {awaitingEmailVerification && (
                  <p className="text-sm text-muted-foreground">
                    Email confirmation required. After confirming, log in and return to this page.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Teacher profile</CardTitle>
              <CardDescription>Arabic and English input supported (dir=auto).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Ustadh Ahmad"
                  dir="auto"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +1 555 123 4567"
                  dir="auto"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell students about your background and teaching style"
                  dir="auto"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="specialization">Specialization (comma-separated)</Label>
                <Input
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g., Tajweed, Hifz, Fiqh"
                  dir="auto"
                />
                <p className="text-xs text-muted-foreground">
                  Saved as tags: {specializationTags.length ? specializationTags.join(", ") : "(none)"}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Experience level</Label>
                <Select value={experienceLevel} onValueChange={(v) => setExperienceLevel(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="credentialsUrl">Credentials (optional link)</Label>
                <Input
                  id="credentialsUrl"
                  value={credentialsUrl}
                  onChange={(e) => setCredentialsUrl(e.target.value)}
                  placeholder="https://..."
                  dir="auto"
                />
              </div>

              <div className="grid gap-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timezone" />
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
                  This is used to convert your availability for students in other timezones.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="availabilityPref">Availability preference (optional)</Label>
                <Textarea
                  id="availabilityPref"
                  value={availabilityPref}
                  onChange={(e) => setAvailabilityPref(e.target.value)}
                  placeholder={`Example: Weekdays 6–9pm (${timezone}), weekends flexible`}
                  dir="auto"
                />
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Payout details</h3>
                  <p className="text-sm text-muted-foreground">
                    Global payouts: choose the method that works best in your country.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label>Payout method</Label>
                  <Select value={payoutMethod} onValueChange={(v) => setPayoutMethod(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payout method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wise">Wise</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="iban">Bank IBAN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="holder">Account holder name</Label>
                  <Input
                    id="holder"
                    value={payoutAccountHolderName}
                    onChange={(e) => setPayoutAccountHolderName(e.target.value)}
                    placeholder="Name on the account"
                    dir="auto"
                  />
                </div>

                {payoutMethod === "paypal" && (
                  <div className="grid gap-2">
                    <Label htmlFor="paypal">PayPal email</Label>
                    <Input
                      id="paypal"
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="paypal@example.com"
                      dir="auto"
                    />
                  </div>
                )}

                {payoutMethod === "wise" && (
                  <div className="grid gap-2">
                    <Label htmlFor="wise">Wise account (email or identifier)</Label>
                    <Input
                      id="wise"
                      value={wiseAccount}
                      onChange={(e) => setWiseAccount(e.target.value)}
                      placeholder="wise@example.com"
                      dir="auto"
                    />
                  </div>
                )}

                {payoutMethod === "iban" && (
                  <>
                    <div className="grid gap-2">
                      <Label>Bank country</Label>
                      <Select value={bankCountry} onValueChange={setBankCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank country" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANK_COUNTRIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="iban">IBAN number</Label>
                      <Input
                        id="iban"
                        value={ibanNumber}
                        onChange={(e) => setIbanNumber(e.target.value)}
                        placeholder="e.g., GB82 WEST 1234 5698 7654 32"
                        dir="auto"
                      />
                      <p className="text-xs text-muted-foreground">
                        We accept spaces — they’ll be removed automatically.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleSubmitProfile} disabled={isSubmitting}>
                  Submit & continue
                </Button>
                {!user && (
                  <span className="text-sm text-muted-foreground">Please create an account first.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
