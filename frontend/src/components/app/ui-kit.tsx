import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";
import { AlertTriangle, Inbox } from "lucide-react";

export function GlassCard({
  className,
  children,
  hover,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "glass rounded-3xl",
        hover &&
          "transition-all duration-300 hover:border-primary/40 hover:bg-surface-strong",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <GlassCard hover className="p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
    </GlassCard>
  );
}

const statusStyles: Record<string, string> = {
  ready: "bg-success/15 text-success border-success/30",
  completed: "bg-success/15 text-success border-success/30",
  supported: "bg-success/15 text-success border-success/30",
  processing: "bg-warning/15 text-warning border-warning/30",
  "needs review": "bg-warning/15 text-warning border-warning/30",
  draft: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/15 text-destructive border-destructive/30",
  unsupported: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[key] ?? "bg-surface text-muted-foreground border-border",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-strong">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <GlassCard className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-strong">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-medium">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </GlassCard>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <GlassCard className="flex flex-col items-center justify-center border-destructive/30 px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-destructive/15">
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </div>
      <h3 className="mt-4 text-base font-medium">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </GlassCard>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <GlassCard className="space-y-3 p-5">
      <Skeleton className="h-4 w-1/3 bg-surface-strong" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full bg-surface-strong" />
      ))}
    </GlassCard>
  );
}
