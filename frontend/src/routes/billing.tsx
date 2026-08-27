import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, PageHeader, StatusBadge } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { billingHistory, plans, workspace } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing — TransformAI Demo Workspace" },
      {
        name: "description",
        content:
          "Plan, usage, subscription status and billing history for the TransformAI demo workspace.",
      },
      { property: "og:title", content: "Billing — TransformAI" },
      {
        property: "og:description",
        content: "Manage the demo plan, usage and invoices.",
      },
    ],
  }),
  component: BillingPage,
});

function BillingPage() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"choose" | "summary" | "redirect">("choose");
  const [plan, setPlan] = useState("pro");

  const selected = plans.find((p) => p.id === plan)!;

  const reset = () => {
    setOpen(false);
    setTimeout(() => setStep("choose"), 250);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Billing"
          title="Billing & subscription"
          description="Frontend-only simulation. No payment provider is connected."
          actions={
            <Button
              onClick={() => {
                setOpen(true);
                setStep("choose");
              }}
            >
              Upgrade plan
            </Button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Current plan
            </p>
            <p className="mt-3 text-2xl font-semibold">{workspace.plan}</p>
            <div className="mt-3">
              <StatusBadge status="ready" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Renews 01 Sep 2026 · billed monthly
            </p>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Usage
            </p>
            <p className="mt-3 text-2xl font-semibold">
              {workspace.usage.used} / {workspace.usage.limit}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-strong">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${(workspace.usage.used / workspace.usage.limit) * 100}%`,
                }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Transformations this billing period
            </p>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Payment method
            </p>
            <p className="mt-3 text-sm">Razorpay (demo)</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Subscription managed through Razorpay in production.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => toast.success("Payment method updated (demo)")}
            >
              Update method
            </Button>
          </GlassCard>
        </div>

        <GlassCard className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-medium">Billing history</h2>
          </div>
          {billingHistory.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-5 py-4 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm">{b.id}</p>
                <p className="text-xs text-muted-foreground">
                  {b.date} · {b.plan}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm">{b.amount}</span>
                <StatusBadge status="ready" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.success("Invoice downloaded (demo)")}
                >
                  Invoice
                </Button>
              </div>
            </div>
          ))}
        </GlassCard>
      </div>

      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : reset())}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {step === "choose"
                ? "Choose plan"
                : step === "summary"
                  ? "Order summary"
                  : "Continue to Razorpay"}
            </DialogTitle>
            <DialogDescription>
              Simulated checkout — no Razorpay integration is connected.
            </DialogDescription>
          </DialogHeader>

          {step === "choose" && (
            <div className="space-y-2">
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={cn(
                    "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-left",
                    plan === p.id && "border-primary/50 bg-primary/10",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{p.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {p.tagline}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm">{p.price}</span>
                </button>
              ))}
            </div>
          )}

          {step === "summary" && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-border bg-surface p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>{selected.name} plan</span>
                  <span>{selected.price}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-muted-foreground">
                  <span>GST (illustrative)</span>
                  <span>Included</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-medium">
                  <span>Total due today</span>
                  <span>{selected.price}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Billed monthly. Cancel anytime in the demo workspace.
              </p>
            </div>
          )}

          {step === "redirect" && (
            <div className="flex flex-col items-center py-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="mt-4 text-sm">Preparing a secure Razorpay checkout…</p>
              <p className="mt-1 text-xs text-muted-foreground">
                This demo stops here — no payment is taken.
              </p>
            </div>
          )}

          <DialogFooter>
            {step !== "redirect" ? (
              <>
                <Button variant="outline" onClick={reset}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (step === "choose") setStep("summary");
                    else {
                      setStep("redirect");
                      setTimeout(() => {
                        reset();
                        toast.success("Checkout simulation complete");
                      }, 1800);
                    }
                  }}
                >
                  {step === "choose" ? "Continue" : "Continue to Razorpay"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={reset}>
                <Check className="mr-2 h-4 w-4" /> Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
