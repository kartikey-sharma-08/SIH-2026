import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CalendarClock, FileText, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, PageHeader, StatusBadge } from "@/components/app/ui-kit";
import { EvidenceDrawer } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sources, type Evidence } from "@/data/demo";

export const Route = createFileRoute("/sources/$id")({
  loader: ({ params }) => {
    const source = sources.find((s) => s.id === params.id);
    if (!source) throw notFound();
    return { source };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Source unavailable — TransformAI" },
          { name: "robots", content: "noindex" },
        ],
      };
    const t = `${loaderData.source.title} — Source Intelligence`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.source.summary.slice(0, 155) },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.source.summary.slice(0, 155) },
      ],
    };
  },
  component: SourceDetail,
});

const riskColor = {
  High: "text-destructive",
  Medium: "text-warning",
  Low: "text-muted-foreground",
} as const;

function SourceDetail() {
  const { source } = Route.useLoaderData();
  const [evidence, setEvidence] = useState<Evidence | null>(null);

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Source intelligence"
          title={source.title}
          description={source.summary}
          actions={
            <Button asChild>
              <Link to="/transform">
                Transform this source <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          }
        />

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <StatusBadge status={source.status} />
          <span className="rounded-full border border-border bg-surface px-2.5 py-1">
            {source.type}
          </span>
          <span className="rounded-full border border-border bg-surface px-2.5 py-1">
            {source.pages} pages
          </span>
          <span className="rounded-full border border-border bg-surface px-2.5 py-1">
            {source.size}
          </span>
          <span className="rounded-full border border-border bg-surface px-2.5 py-1">
            {source.project}
          </span>
          <span>Uploaded {source.uploaded}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <GlassCard className="p-5">
              <h2 className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-primary" /> Key facts
              </h2>
              <div className="mt-4 space-y-2">
                {source.facts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setEvidence(f.evidence)}
                    className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm transition-colors hover:border-primary/40"
                  >
                    <span className="min-w-0">
                      <span className="block">{f.text}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        View evidence · page {f.evidence.page}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-success">
                      {Math.round(f.confidence * 100)}%
                    </span>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h2 className="flex items-center gap-2 text-sm font-medium">
                <ShieldAlert className="h-4 w-4 text-warning" /> Risks
              </h2>
              <div className="mt-4 space-y-2">
                {source.risks.map((r) => (
                  <div
                    key={r.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm">{r.label}</p>
                      <p className="text-xs text-muted-foreground">{r.note}</p>
                    </div>
                    <span className={`shrink-0 text-xs ${riskColor[r.level]}`}>
                      {r.level}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h2 className="flex items-center gap-2 text-sm font-medium">
                <CalendarClock className="h-4 w-4 text-lavender" /> Timeline
              </h2>
              <ol className="mt-4 space-y-3 border-l border-border pl-5">
                {source.timeline.map((t) => (
                  <li key={t.date + t.event} className="relative">
                    <span className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                    <p className="text-sm">{t.event}</p>
                  </li>
                ))}
              </ol>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-5">
              <h2 className="text-sm font-medium">Entities</h2>
              <div className="mt-4 space-y-2">
                {source.entities.map((e) => (
                  <div
                    key={e.name}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2"
                  >
                    <span className="truncate text-sm">{e.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {e.kind}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h2 className="text-sm font-medium">Topics</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {source.topics.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="border-primary/30 bg-primary/10 font-normal"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h2 className="text-sm font-medium">Evidence</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Every extracted fact links back to an excerpt in the source.
              </p>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setEvidence(source.facts[0]!.evidence)}
              >
                Open evidence drawer
              </Button>
            </GlassCard>
          </div>
        </div>
      </div>
      <EvidenceDrawer evidence={evidence} onClose={() => setEvidence(null)} />
    </AppShell>
  );
}
