import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, PageHeader } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import { plans, workspace } from "@/data/demo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & usage — TransformAI" },
      {
        name: "description",
        content:
          "Illustrative Free, Pro and Enterprise plans for the TransformAI content transformation demo.",
      },
      { property: "og:title", content: "Pricing & usage — TransformAI" },
      {
        property: "og:description",
        content: "Free, Pro and Enterprise plans (illustrative demo pricing).",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Usage & plans"
          title="Pricing"
          description="Prices shown are illustrative for this demo workspace."
        />

        <GlassCard className="p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Current plan · {workspace.plan}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {workspace.usage.used} of {workspace.usage.limit} transformations used
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link to="/billing">Manage billing</Link>
            </Button>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-strong">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${(workspace.usage.used / workspace.usage.limit) * 100}%`,
              }}
            />
          </div>
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <GlassCard
              key={p.id}
              className={p.highlighted ? "border-primary/40 bg-primary/8 p-6" : "p-6"}
            >
              <h2 className="text-sm font-medium">{p.name}</h2>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{p.price}</p>
              <p className="text-xs text-muted-foreground">{p.cadence}</p>
              <p className="mt-3 text-sm text-muted-foreground">{p.tagline}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              {p.id === "pro" ? (
                <Button asChild className="mt-6 w-full">
                  <Link to="/billing">{p.cta}</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="mt-6 w-full"
                  onClick={() =>
                    toast.success(
                      p.id === "free"
                        ? "You are already on the demo workspace"
                        : "Sales enquiry noted (demo)",
                    )
                  }
                >
                  {p.cta}
                </Button>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
