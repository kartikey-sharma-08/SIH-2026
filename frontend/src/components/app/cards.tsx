import { Link } from "@tanstack/react-router";
import { FileText, Image, Presentation, Share2, Video } from "lucide-react";
import { GlassCard, StatusBadge } from "./ui-kit";
import type { Artifact, Source, Transformation } from "@/data/demo";

const categoryIcon = {
  Documents: FileText,
  Social: Share2,
  Presentations: Presentation,
  Visual: Image,
  Video: Video,
} as const;

export function SourceCard({ source }: { source: Source }) {
  return (
    <Link to="/sources/$id" params={{ id: source.id }} className="block">
      <GlassCard hover className="h-full p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{source.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {source.type} · {source.pages} pages · {source.size}
            </p>
          </div>
          <StatusBadge status={source.status} />
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {source.summary}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{source.project}</span>
          <span className="shrink-0">{source.uploaded}</span>
        </div>
      </GlassCard>
    </Link>
  );
}

export function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const Icon = categoryIcon[artifact.category];
  return (
    <Link to="/artifacts/$id" params={{ id: artifact.id }} className="block">
      <GlassCard hover className="h-full p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
            <Icon className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{artifact.type}</p>
            <p className="truncate text-sm font-medium">{artifact.title}</p>
          </div>
        </div>
        <p className="mt-3 truncate text-xs text-muted-foreground">
          {artifact.project}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="text-success">Grounding {artifact.grounding}%</span>
          <span className="text-lavender">Consistency {artifact.consistency}%</span>
          <span className="ml-auto text-muted-foreground">{artifact.updated}</span>
        </div>
      </GlassCard>
    </Link>
  );
}

export function TransformationRow({ item }: { item: Transformation }) {
  return (
    <Link
      to="/transform/$id"
      params={{ id: item.id }}
      className="block border-b border-border last:border-0"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.source}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {item.outputs} outputs · {item.outputLabels.slice(0, 3).join(", ")}
            {item.outputLabels.length > 3 ? "…" : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <StatusBadge status={item.status} />
          <span className="hidden text-xs text-muted-foreground sm:block">
            {item.date}
          </span>
        </div>
      </div>
    </Link>
  );
}
