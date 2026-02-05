import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const PAYOUT_METHODS = ["wise", "paypal", "iban"] as const;
const REGIONAL_SPECIALIZATIONS = [
  { value: "north_africa", label: "North Africa (Egypt, Tunisia, Morocco, Algeria)" },
  { value: "south_asia", label: "South Asia (Pakistan, Bangladesh, India)" },
  { value: "middle_east", label: "Middle East (Saudi Arabia, UAE, Lebanon, Syria)" },
  { value: "western_diaspora", label: "Western Diaspora (US, UK, Canada, Europe)" },
] as const;

type PayoutMethod = (typeof PAYOUT_METHODS)[number];
type RegionalSpecialization = typeof REGIONAL_SPECIALIZATIONS[number]["value"];

function normalizeIban(input: string): string {
  return input.replace(/\s+/g, "").toUpperCase();
}

function isValidIban(input: string): boolean {
  const iban = normalizeIban(input);
  // IBAN format: 2-letter country code + 2 check digits + 11-30 alphanumeric characters
  // Total length: 15-34 characters
  return /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban) && iban.length >= 15 && iban.length <= 34;
}

function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

const FALLBACK_TIMEZONES = [
  "UTC",
  "Africa/Cairo",
  "Africa/Tunis",
  "Africa/Casablanca",
  "Asia/Karachi",
  "Asia/Dhaka",
  "Asia/Jakarta",
  "Asia/Kuala_Lumpur",
  "Asia/Dubai",
  "Asia/Bangkok",
  "Europe/London",
  "Europe/Paris",
  "Europe/Istanbul",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
];

const BANK_COUNTRIES = [
  "Egypt",
  "Tunisia",
  "Morocco",
  "Algeria",
  "Pakistan",
  "Bangladesh",
  "Indonesia",
  "Malaysia",
  "Saudi Arabia",
  "UAE",
  "Turkey",
  "Lebanon",
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

const TEACHING_LANGUAGES = [
  { id: "arabic", label: "Arabic (العربية)" },
  { id: "english", label: "English" },
  { id: "urdu", label: "Urdu (اردو)" },
  { id: "french", label: "French" },
  { id: "turkish", label: "Turkish" },
  { id: "bahasa", label: "Bahasa Indonesia/Malay" },
  { id: "other", label: "Other" },
];

export function TeacherOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUpWithEmail } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);

  // Account fields (for logged-out users)
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [awaitingEmailVerification, setAwaitingEmailVerification] = useState(false);

  // Step 1: Basic info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Payout method
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod | "">("");
  const [wiseId, setWiseId] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [ibanNumber, setIbanNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [countryOfBank, setCountryOfBank] = useState("");

  // Step 3: Timezone
  const tzOptions = useMemo(() => {
    const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;
    const supported = supportedValuesOf?.("timeZone");
    return supported?.length ? supported : FALLBACK_TIMEZONES;
  }, []);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC"
  );

  // Step 4: Regional specialization
  const [regionalSpecialization, setRegionalSpecialization] = useState<RegionalSpecialization | "">("");
  const [countryOfResidence, setCountryOfResidence] = useState("");

  // Step 5: Teaching languages
  const [teachingLanguages, setTeachingLanguages] = useState<string[]>([]);

  // Additional fields (optional bio/experience for step 6 review)
  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAccount = async () => {
    setIsSubmitting(true);
    try {
      const res = (await signUpWithEmail(signupEmail, signupPassword)) as unknown as {
        error: { message?: string } | null;
        autoLoggedIn?: boolean;
      };
      const { error, autoLoggedIn } = res;
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Step 1: Basic info
        if (!fullName.trim()) {
          toast({ title: "Full name is required", variant: "destructive" });
          return false;
        }
        if (!email.trim() || !isValidEmail(email)) {
          toast({ title: "Valid email is required", variant: "destructive" });
          return false;
        }
        if (!phone.trim()) {
          toast({ title: "Phone number is required", variant: "destructive" });
          return false;
        }
        return true;

      case 1: // Step 2: Payout method
        if (!payoutMethod) {
          toast({ title: "Please select a payout method", variant: "destructive" });
          return false;
        }
        if (payoutMethod === "wise" && !wiseId.trim()) {
          toast({ title: "Wise ID is required", variant: "destructive" });
          return false;
        }
        if (payoutMethod === "paypal") {
          if (!paypalEmail.trim() || !isValidEmail(paypalEmail)) {
            toast({ title: "Valid PayPal email is required", variant: "destructive" });
            return false;
          }
        }
        if (payoutMethod === "iban") {
          if (!ibanNumber.trim()) {
            toast({ title: "IBAN is required", variant: "destructive" });
            return false;
          }
          if (!isValidIban(ibanNumber)) {
            toast({
              title: "Invalid IBAN format",
              description: "IBAN must be 15-34 characters and start with a country code (e.g., PK, EG, TN).",
              variant: "destructive",
            });
            return false;
          }
          if (!accountHolderName.trim()) {
            toast({ title: "Account holder name is required", variant: "destructive" });
            return false;
          }
          if (!countryOfBank.trim()) {
            toast({ title: "Country of bank is required", variant: "destructive" });
            return false;
          }
        }
        return true;

      case 2: // Step 3: Timezone
        if (!timezone) {
          toast({ title: "Please select your timezone", variant: "destructive" });
          return false;
        }
        return true;

      case 3: // Step 4: Regional specialization
        if (!regionalSpecialization) {
          toast({ title: "Please select your regional specialization", variant: "destructive" });
          return false;
        }
        if (!countryOfResidence.trim()) {
          toast({ title: "Country of residence is required", variant: "destructive" });
          return false;
        }
        return true;

      case 4: // Step 5: Teaching languages
        if (teachingLanguages.length === 0) {
          toast({ title: "Please select at least one teaching language", variant: "destructive" });
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
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

    // Final validation
    for (let i = 0; i <= 4; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return;
      }
    }

    const ibanOrAccountNumber =
      payoutMethod === "iban"
        ? normalizeIban(ibanNumber)
        : payoutMethod === "paypal"
          ? paypalEmail.trim()
          : wiseId.trim();

    setIsSubmitting(true);

    try {
      // Check for duplicate teacher profile
      const { data: existingProfile } = await withMockFallback(
        async () => {
          return await supabase
            .from("teacher_profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();
        },
        { data: null },
        "TeacherOnboarding:checkDuplicate"
      );

      if (existingProfile?.data) {
        toast({
          title: "Profile already exists",
          description: "You already have a teacher profile. Redirecting to course creation...",
        });
        navigate("/teacher/courses/new");
        return;
      }

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
              specializations: specialization.trim() ? specialization.split(",").map(s => s.trim()).filter(Boolean) : [],
              phone: phone.trim(),
              timezone,
              payout_method: payoutMethod,
              iban_or_account_number: ibanOrAccountNumber || null,
              country_of_bank: payoutMethod === "iban" ? (countryOfBank.trim() || null) : null,
              payout_account_holder_name: payoutMethod === "iban" ? accountHolderName.trim() : fullName.trim(),
              country_of_residence: countryOfResidence.trim(),
              regional_specialization: regionalSpecialization,
              teaching_languages: teachingLanguages,
            })
            .select("*")
            .single();

          if (error) {
            // Check for duplicate key error
            if (error.code === "23505") {
              throw new Error("Teacher profile already exists for this user.");
            }
            throw error;
          }
          return data;
        },
        {
          ...MOCK_TEACHERS[0],
          id: "mock-teacher-onboarded",
          user_id: user.id,
          bio,
          timezone,
          payout_method: payoutMethod,
          iban_or_account_number: ibanOrAccountNumber,
          country_of_bank: countryOfBank,
          payout_account_holder_name: accountHolderName || fullName,
          country_of_residence: countryOfResidence,
          regional_specialization: regionalSpecialization,
          teaching_languages: teachingLanguages,
        } as any,
        "TeacherOnboarding:createTeacherProfile"
      );

      toast({
        title: "✅ Teacher profile created!",
        description: "Next: create your first course.",
      });

      // Redirect to course creation flow
      navigate("/teacher/courses/new", { state: { teacherProfileId: (teacherProfile as any)?.id } });
    } catch (err: any) {
      console.error("Submit error:", err);
      toast({
        title: "Could not submit profile",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = (langId: string) => {
    setTeachingLanguages((prev) =>
      prev.includes(langId) ? prev.filter((l) => l !== langId) : [...prev, langId]
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step - 1 < currentStep
                ? "bg-primary text-primary-foreground"
                : step - 1 === currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {step - 1 < currentStep ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 6 && (
            <div
              className={`w-8 h-0.5 ${step - 1 < currentStep ? "bg-primary" : "bg-muted"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Step 1: Basic info
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Basic Information</h2>
              <p className="text-muted-foreground mt-1">
                Let's start with your contact details.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Ustadh Ahmad Al-Masri"
                dir="auto"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@example.com"
                dir="auto"
              />
              <p className="text-xs text-muted-foreground">
                Used for login and communication with students.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 123 4567"
                dir="auto"
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +20 for Egypt, +92 for Pakistan).
              </p>
            </div>
          </div>
        );

      case 1: // Step 2: Payout method
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Payout Method</h2>
              <p className="text-muted-foreground mt-1">
                Choose how you'd like to receive payments from students.
              </p>
            </div>

            <div className="grid gap-4">
              <Label>Select Payout Method *</Label>
              <RadioGroup value={payoutMethod} onValueChange={(v) => setPayoutMethod(v as PayoutMethod)}>
                <div className="flex items-start space-x-3 border rounded-lg p-4">
                  <RadioGroupItem value="wise" id="wise" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="wise" className="font-semibold cursor-pointer">
                      Wise (formerly TransferWise)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Fast international transfers, low fees. Popular in Egypt, Pakistan, Tunisia.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 border rounded-lg p-4">
                  <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="paypal" className="font-semibold cursor-pointer">
                      PayPal
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Widely accepted, instant transfers. Available in most countries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 border rounded-lg p-4">
                  <RadioGroupItem value="iban" id="iban" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="iban" className="font-semibold cursor-pointer">
                      Bank IBAN
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Direct bank transfer via IBAN. Best for SEPA countries and MENA region.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {payoutMethod === "wise" && (
              <div className="grid gap-2 border rounded-lg p-4 bg-muted/30">
                <Label htmlFor="wiseId">Wise ID / Email *</Label>
                <Input
                  id="wiseId"
                  value={wiseId}
                  onChange={(e) => setWiseId(e.target.value)}
                  placeholder="your-email@wise.com or Wise account ID"
                  dir="auto"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the email or ID associated with your Wise account.
                </p>
              </div>
            )}

            {payoutMethod === "paypal" && (
              <div className="grid gap-2 border rounded-lg p-4 bg-muted/30">
                <Label htmlFor="paypalEmail">PayPal Email *</Label>
                <Input
                  id="paypalEmail"
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="paypal@example.com"
                  dir="auto"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send payments to this PayPal email address.
                </p>
              </div>
            )}

            {payoutMethod === "iban" && (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                <div className="grid gap-2">
                  <Label htmlFor="ibanNumber">IBAN Number *</Label>
                  <Input
                    id="ibanNumber"
                    value={ibanNumber}
                    onChange={(e) => setIbanNumber(e.target.value)}
                    placeholder="PK36 SCBL 0000 0011 2345 6702"
                    dir="auto"
                  />
                  <p className="text-xs text-muted-foreground">
                    International Bank Account Number (15-34 characters, starts with country code).
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                  <Input
                    id="accountHolderName"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="Name as it appears on bank account"
                    dir="auto"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Country of Bank *</Label>
                  <Select value={countryOfBank} onValueChange={setCountryOfBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANK_COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Step 3: Timezone
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Timezone</h2>
              <p className="text-muted-foreground mt-1">
                Select your local timezone for accurate session scheduling.
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Your Timezone *</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {tzOptions.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Your availability will be shown to students converted to their local timezone.
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="text-sm font-medium mb-2">Current Selection:</p>
              <p className="text-sm text-muted-foreground">
                Timezone: <strong>{timezone}</strong>
                <br />
                Current time: <strong>{new Date().toLocaleString("en-US", { timeZone: timezone })}</strong>
              </p>
            </div>
          </div>
        );

      case 3: // Step 4: Regional specialization
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Regional Specialization</h2>
              <p className="text-muted-foreground mt-1">
                Which region do you primarily focus on for teaching?
              </p>
            </div>

            <div className="grid gap-3">
              <Label>Regional Focus *</Label>
              <RadioGroup
                value={regionalSpecialization}
                onValueChange={(v) => setRegionalSpecialization(v as RegionalSpecialization)}
              >
                {REGIONAL_SPECIALIZATIONS.map((region) => (
                  <div key={region.value} className="flex items-start space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value={region.value} id={region.value} className="mt-1" />
                    <Label htmlFor={region.value} className="cursor-pointer flex-1">
                      {region.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>Country of Residence *</Label>
              <Select value={countryOfResidence} onValueChange={setCountryOfResidence}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {BANK_COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Required for compliance and regional course recommendations.
              </p>
            </div>
          </div>
        );

      case 4: // Step 5: Teaching languages
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Teaching Languages</h2>
              <p className="text-muted-foreground mt-1">
                Select all languages you can teach in (at least one required).
              </p>
            </div>

            <div className="space-y-3">
              <Label>Languages *</Label>
              {TEACHING_LANGUAGES.map((lang) => (
                <div key={lang.id} className="flex items-center space-x-3 border rounded-lg p-4">
                  <Checkbox
                    id={lang.id}
                    checked={teachingLanguages.includes(lang.id)}
                    onCheckedChange={() => toggleLanguage(lang.id)}
                  />
                  <Label htmlFor={lang.id} className="cursor-pointer flex-1">
                    {lang.label}
                  </Label>
                </div>
              ))}
            </div>

            {teachingLanguages.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-sm font-medium mb-2">Selected Languages:</p>
                <p className="text-sm text-muted-foreground">
                  {teachingLanguages
                    .map((id) => TEACHING_LANGUAGES.find((l) => l.id === id)?.label)
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        );

      case 5: // Step 6: Review + submit
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Review & Submit</h2>
              <p className="text-muted-foreground mt-1">
                Please review your information before submitting.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Basic Information</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Name:</strong> {fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {phone}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Payout Details</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Method:</strong>{" "}
                    {payoutMethod === "wise"
                      ? "Wise"
                      : payoutMethod === "paypal"
                        ? "PayPal"
                        : "Bank IBAN"}
                  </p>
                  {payoutMethod === "wise" && (
                    <p>
                      <strong>Wise ID:</strong> {wiseId}
                    </p>
                  )}
                  {payoutMethod === "paypal" && (
                    <p>
                      <strong>PayPal Email:</strong> {paypalEmail}
                    </p>
                  )}
                  {payoutMethod === "iban" && (
                    <>
                      <p>
                        <strong>IBAN:</strong> {ibanNumber}
                      </p>
                      <p>
                        <strong>Account Holder:</strong> {accountHolderName}
                      </p>
                      <p>
                        <strong>Bank Country:</strong> {countryOfBank}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Schedule & Region</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Timezone:</strong> {timezone}
                  </p>
                  <p>
                    <strong>Regional Focus:</strong>{" "}
                    {REGIONAL_SPECIALIZATIONS.find((r) => r.value === regionalSpecialization)?.label}
                  </p>
                  <p>
                    <strong>Country of Residence:</strong> {countryOfResidence}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Teaching Languages</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    {teachingLanguages
                      .map((id) => TEACHING_LANGUAGES.find((l) => l.id === id)?.label)
                      .join(", ")}
                  </p>
                </div>
              </div>

              {/* Optional: Bio and specialization */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Additional Info (Optional)</h3>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio / Introduction</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell students about your background and teaching style..."
                      dir="auto"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="specialization">Specializations (comma-separated)</Label>
                    <Input
                      id="specialization"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g., Tajweed, Hifz, Fiqh, Tafsir"
                      dir="auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
              Complete the onboarding process to start teaching on SacredChain.
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

          {user && (
            <Card>
              <CardHeader>
                <CardTitle>Teacher Onboarding</CardTitle>
                <CardDescription>Complete all steps to activate your teacher profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderStepIndicator()}
                {renderStep()}

                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isSubmitting}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>

                  {currentStep < 5 ? (
                    <Button onClick={handleNext} disabled={isSubmitting}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitProfile} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit & Continue"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
