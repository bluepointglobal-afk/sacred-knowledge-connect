import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wallet,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  CreditCard,
  Building,
  History,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useTeacherProfile } from "@/hooks/useProfile";
import {
  useEarningsSummary,
  useTeacherEarnings,
  useTeacherPayouts,
  useRequestPayout,
  useStripeConnect,
} from "@/hooks/usePayments";
import { formatCurrency, MINIMUM_PAYOUT_CENTS, centsToUSD } from "@/lib/stripe";

const TeacherEarnings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: teacherProfile, isLoading: teacherLoading } = useTeacherProfile();
  const { data: summary, isLoading: summaryLoading } = useEarningsSummary();
  const { data: earnings, isLoading: earningsLoading } = useTeacherEarnings();
  const { data: payouts, isLoading: payoutsLoading } = useTeacherPayouts();

  const { mutate: requestPayout, isPending: isPayoutPending } = useRequestPayout();
  const { mutate: connectStripe, isPending: isConnectPending } = useStripeConnect();

  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);

  const isLoading = authLoading || profileLoading || teacherLoading || summaryLoading;

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate("/login?redirect=/teacher/earnings");
    return null;
  }

  // Check if user is a teacher
  if (!teacherLoading && !teacherProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide max-w-lg text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
              <Shield className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Teacher Access Required
            </h1>
            <p className="text-muted-foreground mb-8">
              This page is only available for verified teachers.
            </p>
            <Button asChild>
              <Link to="/become-teacher">Apply to Become a Teacher</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container-wide flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading earnings...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isConnected = teacherProfile?.stripe_onboarded && teacherProfile?.stripe_payouts_enabled;
  const canRequestPayout = isConnected && (summary?.available_balance_cents || 0) >= MINIMUM_PAYOUT_CENTS;

  const handleRequestPayout = () => {
    const amountCents = Math.round(parseFloat(payoutAmount) * 100);
    if (amountCents >= MINIMUM_PAYOUT_CENTS && amountCents <= (summary?.available_balance_cents || 0)) {
      requestPayout(
        { amountCents },
        {
          onSuccess: () => {
            setPayoutDialogOpen(false);
            setPayoutAmount("");
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 lg:py-16">
        <div className="container-wide">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Teacher Earnings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track your earnings and request payouts
            </p>
          </motion.div>

          {/* Stripe Connect Setup Banner */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/20">
                  <Building className="h-7 w-7 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Complete Your Payout Setup
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Connect your bank account via Stripe to receive payouts
                  </p>
                </div>
                <Button onClick={() => connectStripe()} disabled={isConnectPending}>
                  {isConnectPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Setup Payouts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Balance Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10"
          >
            {/* Available Balance */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Available</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(summary?.available_balance_cents || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
            </div>

            {/* Pending Balance */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Pending</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(summary?.pending_balance_cents || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">In escrow (24h hold)</p>
            </div>

            {/* Total Earned */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Total Earned</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(summary?.total_earned_cents || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </div>

            {/* Total Paid Out */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Paid Out</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(summary?.total_paid_out_cents || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Transferred to bank</p>
            </div>
          </motion.div>

          {/* Request Payout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10"
          >
            <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" disabled={!canRequestPayout}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Payout</DialogTitle>
                  <DialogDescription>
                    Enter the amount you'd like to withdraw. Minimum payout is ${MINIMUM_PAYOUT_CENTS / 100}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Amount (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        className="pl-7"
                        min={MINIMUM_PAYOUT_CENTS / 100}
                        max={centsToUSD(summary?.available_balance_cents || 0)}
                        step="0.01"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Available: {formatCurrency(summary?.available_balance_cents || 0)}
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleRequestPayout}
                    disabled={
                      isPayoutPending ||
                      !payoutAmount ||
                      parseFloat(payoutAmount) * 100 < MINIMUM_PAYOUT_CENTS ||
                      parseFloat(payoutAmount) * 100 > (summary?.available_balance_cents || 0)
                    }
                  >
                    {isPayoutPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Request ${payoutAmount || "0.00"}
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {!canRequestPayout && (
              <p className="text-sm text-muted-foreground mt-2">
                {!isConnected
                  ? "Complete Stripe setup to request payouts"
                  : `Minimum payout is $${MINIMUM_PAYOUT_CENTS / 100}. Available: ${formatCurrency(summary?.available_balance_cents || 0)}`}
              </p>
            )}
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Earnings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Earnings
                </h2>

                {earningsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : earnings && earnings.length > 0 ? (
                  <div className="space-y-4">
                    {earnings.slice(0, 5).map((earning) => (
                      <div
                        key={earning.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            earning.status === "available"
                              ? "bg-green-500/10 text-green-600"
                              : earning.status === "pending"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-blue-500/10 text-blue-600"
                          }`}>
                            {earning.status === "available" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : earning.status === "pending" ? (
                              <Clock className="h-4 w-4" />
                            ) : (
                              <DollarSign className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {earning.bundle?.title || earning.session?.title || "Session Payment"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(earning.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {formatCurrency(earning.amount_cents)}
                          </p>
                          <Badge
                            variant={
                              earning.status === "available"
                                ? "default"
                                : earning.status === "pending"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {earning.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No earnings yet</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Payout History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Payout History
                </h2>

                {payoutsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : payouts && payouts.length > 0 ? (
                  <div className="space-y-4">
                    {payouts.map((payout) => (
                      <div
                        key={payout.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            payout.status === "completed"
                              ? "bg-green-500/10 text-green-600"
                              : payout.status === "failed"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}>
                            {payout.status === "completed" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : payout.status === "failed" ? (
                              <AlertCircle className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Payout Request
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payout.requested_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {formatCurrency(payout.amount_cents)}
                          </p>
                          <Badge
                            variant={
                              payout.status === "completed"
                                ? "default"
                                : payout.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {payout.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payouts yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 rounded-xl border border-border bg-muted/50 p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">How Earnings Work</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Student Pays</p>
                  <p className="text-xs text-muted-foreground">
                    Payment is held securely in escrow
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Session Completes</p>
                  <p className="text-xs text-muted-foreground">
                    24-hour hold period starts
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Funds Available</p>
                  <p className="text-xs text-muted-foreground">
                    Request payout (min ${MINIMUM_PAYOUT_CENTS / 100})
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherEarnings;
