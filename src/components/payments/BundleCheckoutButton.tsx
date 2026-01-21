import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBundleCheckout } from "@/hooks/usePayments";
import { formatCurrency } from "@/lib/stripe";
import { Loader2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

interface BundleCheckoutButtonProps {
  bundleId: string;
  bundleTitle: string;
  priceCents: number;
  currency?: string;
  className?: string;
  variant?: "default" | "hero" | "outline";
  size?: "default" | "sm" | "lg";
}

export function BundleCheckoutButton({
  bundleId,
  bundleTitle,
  priceCents,
  currency = "usd",
  className,
  variant = "default",
  size = "default",
}: BundleCheckoutButtonProps) {
  const { user } = useAuth();
  const { mutate: checkout, isPending } = useBundleCheckout();

  // If not logged in, show login prompt
  if (!user) {
    return (
      <Button variant={variant} size={size} className={className} asChild>
        <Link to={`/login?redirect=/bundles/${bundleId}`}>Sign in to Enroll</Link>
      </Button>
    );
  }

  const handleCheckout = () => {
    checkout({ bundleId });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCheckout}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Enroll for {formatCurrency(priceCents, currency)}
        </>
      )}
    </Button>
  );
}
