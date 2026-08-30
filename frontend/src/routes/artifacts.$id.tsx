import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Download, History, Pencil, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, PageHeader, ScoreBar } from "@/components/app/ui-kit";
import { ConsistencyPanel, GroundingPanel } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { artifacts, versionHistory } from "@/data/demo";
import { getArtifactById } from "@/lib/store";

export const Route = createFileRoute("/artifacts/$id")({
  loader: ({ params }) => {
    const artifact = getArtifactById(params.id) || artifacts.find((a) => a.id === params.id);
    if (!artifact) throw notFound();
    return { artifact };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Artifact unavailable — TransformAI" },
          { name: "robots", content: "noindex" },
        ],
      };
    const t = `${loaderData.artifact.title} — TransformAI`;
    const d = `${loaderData.artifact.type} generated from the Q3 incident assessment, grounded at ${loaderData.artifact.grounding}%.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: ArtifactDetail,
});

function ArtifactDetail() {
  const { artifact } = Route.useLoaderData();
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(artifact.body);
  const [regenerating, setRegenerating] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow={artifact.type}
          title={artifact.title}
          description={`${artifact.project} · updated ${artifact.updated}`}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                variant={editing ? "default" : "outline"}
                onClick={() => {
                  if (editing) toast.success("Changes saved (demo)");
                  setEditing((v) => !v);
                }}
              >
                {editing ? (
                  <Save className="mr-2 h-4 w-4" />
                ) : (
                  <Pencil className="mr-2 h-4 w-4" />
                )}
                {editing ? "Save" : "Edit"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(body);
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button
                variant="outline"
                disabled={regenerating}
                onClick={() => {
                  setRegenerating(true);
                  setTimeout(() => {
                    setRegenerating(false);
                    toast.success("Regenerated (demo)");
                  }, 1400);
                }}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${regenerating ? "animate-spin" : ""}`}
                />
                Regenerate
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("Export started (demo)")}
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button variant="ghost" onClick={() => setHistoryOpen(true)}>
                <History className="mr-2 h-4 w-4" /> Versions
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <GlassCard className="p-5">
            <ScoreBar label="Grounding" value={artifact.grounding} />
          </GlassCard>
          <GlassCard className="p-5">
            <ScoreBar label="Consistency" value={artifact.consistency} />
          </GlassCard>
          <GlassCard className="p-5">
            <ScoreBar label="Audience Fit" value={artifact.audienceFit} />
          </GlassCard>
          <GlassCard className="p-5">
            <ScoreBar label="Format Fit" value={artifact.formatFit} />
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <GlassCard className="p-5 sm:p-7">
            {artifact.imageUrl ? (
              <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface">
                <img
                  src={artifact.imageUrl}
                  alt={artifact.title}
                  className="w-full object-cover"
                />
              </div>
            ) : null}

            {editing ? (
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={22}
                className="resize-none border-border bg-surface text-sm leading-relaxed"
              />
            ) : (
              <article className="space-y-4 text-sm leading-relaxed text-foreground/90">
                {body.split("\n\n").map((p, i) => (
                  <p key={i} className="whitespace-pre-wrap">
                    {p.replace(/\*\*/g, "")}
                  </p>
                ))}
              </article>
            )}
            <p className="mt-6 text-xs text-muted-foreground">
              Fictional demo content generated from the Q3 incident assessment.
            </p>
          </GlassCard>

          <div className="space-y-6">
            <GroundingPanel />
            <ConsistencyPanel />
            <GlassCard className="p-5">
              <h3 className="text-sm font-medium">Source</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cybersecurity Incident Assessment — Q3
              </p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/sources/$id" params={{ id: "src-q3-incident" }}>
                  View source intelligence
                </Link>
              </Button>
            </GlassCard>
          </div>
        </div>
      </div>

      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent className="w-full border-border bg-background/95 backdrop-blur-xl sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Version history</SheetTitle>
            <SheetDescription>{artifact.title}</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4">
            {versionHistory.map((v) => (
              <GlassCard key={v.version} className="p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate text-sm font-medium">{v.version}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {v.when}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{v.note}</p>
                <p className="mt-2 text-xs text-muted-foreground">{v.author}</p>
              </GlassCard>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
