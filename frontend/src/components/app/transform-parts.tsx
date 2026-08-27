import { useEffect, useRef, useState } from "react";
import {
  Check,
  CircleDashed,
  FileText,
  Image,
  Loader2,
  Presentation,
  Share2,
  UploadCloud,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./ui-kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { outputTypes } from "@/data/demo";

const categoryIcon = {
  Documents: FileText,
  Social: Share2,
  Presentations: Presentation,
  Visual: Image,
  Video: Video,
} as const;

export type UploadState =
  | "idle"
  | "uploading"
  | "processing"
  | "analysing"
  | "ready"
  | "failed";

export function UploadZone({
  state,
  progress,
  onFiles,
  fileName,
}: {
  state: UploadState;
  progress: number;
  onFiles: (name: string, file?: File) => void;
  fileName?: string | undefined;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const labels: Record<UploadState, string> = {
    idle: "Drop a file or browse",
    uploading: "Uploading…",
    processing: "Processing document…",
    analysing: "Analysing content…",
    ready: "Ready to transform",
    failed: "Upload failed",
  };

  return (
    <GlassCard
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        onFiles(f?.name ?? "Cybersecurity Incident Assessment — Q3.pdf", f);
      }}
      className={cn(
        "flex flex-col items-center justify-center px-6 py-14 text-center transition-all",
        dragging && "border-primary/60 bg-primary/10",
        state === "failed" && "border-destructive/40",
      )}
    >
      <span
        className={cn(
          "grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/30",
          state !== "idle" && state !== "ready" && "animate-pulse",
        )}
      >
        <UploadCloud className="h-6 w-6 text-primary" />
      </span>
      <h3 className="mt-5 text-base font-medium">{labels[state]}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        PDF, DOCX, TXT, PPTX or images · up to 50 MB
      </p>
      {fileName && (
        <p className="mt-3 max-w-full truncate text-sm text-foreground/90">
          {fileName}
        </p>
      )}
      {state !== "idle" && state !== "ready" && state !== "failed" && (
        <Progress value={progress} className="mt-5 h-1.5 w-64 max-w-full" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.docx,.pptx"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFiles(f.name, f);
        }}
      />
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={() => inputRef.current?.click()}>Browse files</Button>
        <Button
          variant="outline"
          onClick={() => onFiles("Cybersecurity Incident Assessment — Q3.pdf")}
        >
          Use demo source
        </Button>
      </div>
    </GlassCard>
  );
}

export function PasteEditor({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <GlassCard className="p-5">
      <h3 className="text-sm font-medium">Paste text</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Paste a report, advisory, incident note or research extract.
      </p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        placeholder="Paste your content here…"
        className="mt-4 resize-none border-border bg-surface"
      />
      <div className="mt-4 flex justify-end">
        <Button onClick={onSubmit} disabled={!value.trim()}>
          Analyse text
        </Button>
      </div>
    </GlassCard>
  );
}

export function OutputSelector({
  selected,
  toggle,
}: {
  selected: string[];
  toggle: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {outputTypes.map((o) => {
        const Icon = categoryIcon[o.category];
        const active = selected.includes(o.id);
        return (
          <button
            key={o.id}
            onClick={() => toggle(o.id)}
            className={cn(
              "glass rounded-2xl p-4 text-left transition-all duration-200",
              active
                ? "border-primary/50 bg-primary/12 ring-1 ring-primary/40"
                : "hover:border-primary/30 hover:bg-surface-strong",
            )}
          >
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                  active ? "bg-primary/25" : "bg-surface-strong",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {o.label}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {o.description}
                </span>
              </span>
              {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function ProcessingTimeline({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={s}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-colors",
              active && "border-primary/40 bg-primary/10",
              !done && !active && "opacity-60",
            )}
          >
            {done ? (
              <Check className="h-4 w-4 shrink-0 text-success" />
            ) : active ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
            ) : (
              <CircleDashed className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="min-w-0 truncate">{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function useSimulatedRun(steps: string[], running: boolean) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!running) return;
    setCurrent(0);
    const t = setInterval(() => {
      setCurrent((c) => {
        if (c >= steps.length) {
          clearInterval(t);
          return c;
        }
        return c + 1;
      });
    }, 900);
    return () => clearInterval(t);
  }, [running, steps.length]);
  return current;
}
