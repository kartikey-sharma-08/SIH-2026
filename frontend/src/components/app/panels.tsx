import { useState } from "react";
import { AlertTriangle, Check, FileSearch, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GlassCard } from "./ui-kit";
import { cn } from "@/lib/utils";
import {
  consistencyChecks,
  consistencyComparison,
  groundingClaims,
  groundingSummary,
  primarySource,
  type Claim,
  type Evidence,
} from "@/data/demo";

export function EvidenceDrawer({
  evidence,
  onClose,
  title = "Source evidence",
}: {
  evidence: Evidence | null;
  onClose: () => void;
  title?: string;
}) {
  return (
    <Sheet open={!!evidence} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full border-border bg-background/95 backdrop-blur-xl sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {primarySource.title} · page {evidence?.page}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <GlassCard className="p-4">
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <FileSearch className="h-4 w-4 text-primary" />
              Excerpt from source
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              “{evidence?.excerpt}”
            </p>
          </GlassCard>
          <p className="mt-4 text-xs text-muted-foreground">
            Demo excerpt from a fictional source document.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function claimIcon(status: Claim["status"]) {
  if (status === "Supported")
    return <Check className="h-4 w-4 shrink-0 text-success" />;
  if (status === "Needs Review")
    return <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />;
  return <X className="h-4 w-4 shrink-0 text-destructive" />;
}

export function GroundingPanel() {
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  return (
    <GlassCard className="p-5">
      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Grounding check
      </h3>
      <div className="mt-4 space-y-2 text-sm">
        <p className="flex items-center gap-2">
          <Check className="h-4 w-4 text-success" />
          {groundingSummary.supported} claims supported
        </p>
        <p className="flex items-center gap-2">
          <Check className="h-4 w-4 text-success" />
          {groundingSummary.statistics} statistics verified
        </p>
        <p className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          {groundingSummary.review} statement requires review
        </p>
      </div>
      <div className="mt-5 space-y-2">
        {groundingClaims.map((c) => (
          <button
            key={c.id}
            onClick={() => setEvidence(c.evidence)}
            className="flex w-full items-start gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40"
          >
            {claimIcon(c.status)}
            <span className="min-w-0 flex-1">
              <span className="block">{c.text}</span>
              <span
                className={cn(
                  "mt-0.5 block text-xs",
                  c.status === "Supported"
                    ? "text-muted-foreground"
                    : "text-warning",
                )}
              >
                {c.status} · view evidence
              </span>
            </span>
          </button>
        ))}
      </div>
      <EvidenceDrawer evidence={evidence} onClose={() => setEvidence(null)} />
    </GlassCard>
  );
}

export function ConsistencyPanel() {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className="p-5">
      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Cross-output consistency
      </h3>
      <p className="mt-3 text-3xl font-semibold tracking-tight">96%</p>
      <p className="text-xs text-muted-foreground">consistent across 6 outputs</p>
      <div className="mt-5 space-y-2">
        {consistencyChecks.map((c) => {
          const warn = c.status === "warn";
          const Comp = warn ? "button" : "div";
          return (
            <Comp
              key={c.label}
              {...(warn ? { onClick: () => setOpen(true) } : {})}
              className={cn(
                "flex w-full items-start gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-left text-sm",
                warn && "border-warning/40 transition-colors hover:bg-warning/10",
              )}
            >
              {warn ? (
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
              ) : (
                <Check className="h-4 w-4 shrink-0 text-success" />
              )}
              <span className="min-w-0">
                <span className="block">{c.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {c.note}
                </span>
              </span>
            </Comp>
          );
        })}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full border-border bg-background/95 backdrop-blur-xl sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Consistency comparison</SheetTitle>
            <SheetDescription>{consistencyComparison.claim}</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4">
            {consistencyComparison.variants.map((v) => (
              <GlassCard key={v.artifact} className="p-4">
                <p className="text-xs text-muted-foreground">{v.artifact}</p>
                <p className="mt-1 text-sm">{v.value}</p>
              </GlassCard>
            ))}
            <p className="text-xs text-muted-foreground">
              Suggested fix: align the social post with the medium residual risk
              wording used in the summary and advisory.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </GlassCard>
  );
}
