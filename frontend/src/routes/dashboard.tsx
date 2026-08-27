import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, MetricCard, PageHeader } from "@/components/app/ui-kit";
import { ArtifactCard, TransformationRow } from "@/components/app/cards";
import { artifacts, metrics, transformations, workspace } from "@/data/demo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TransformAI Demo Workspace" },
      {
        name: "description",
        content:
          "Overview of transformations, artifacts, sources and usage in the TransformAI demo workspace.",
      },
      { property: "og:title", content: "Dashboard — TransformAI" },
      {
        property: "og:description",
        content: "Transformations, artifacts, sources and usage at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow={workspace.name}
          title={`Welcome back, ${workspace.user.name.split(" ")[0]}`}
          description="Fictional demo data. Track transformations, artifacts and grounding quality across your workspace."
          actions={
            <Button asChild>
              <Link to="/transform">
                <Plus className="mr-2 h-4 w-4" /> New Transformation
              </Link>
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <GlassCard className="overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4">
              <h2 className="truncate text-sm font-medium">
                Recent transformations
              </h2>
              <Link
                to="/history"
                className="shrink-0 text-xs text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            {transformations.slice(0, 4).map((t) => (
              <TransformationRow key={t.id} item={t} />
            ))}
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="text-sm font-medium">Quick start</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Transform a new source into grounded deliverables.
            </p>
            <div className="mt-5 space-y-2">
              <Button asChild className="w-full justify-start">
                <Link to="/sources">
                  <Upload className="mr-2 h-4 w-4" /> Transform a New Source
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/sources/$id" params={{ id: "src-q3-incident" }}>
                  Open Q3 incident assessment
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/artifacts">Browse artifact library</Link>
              </Button>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs text-muted-foreground">Usage this month</p>
              <p className="mt-1 text-sm">
                {workspace.usage.used} of {workspace.usage.limit} transformations
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-strong">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(workspace.usage.used / workspace.usage.limit) * 100}%`,
                  }}
                />
              </div>
            </div>
          </GlassCard>
        </div>

        <section>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate text-sm font-medium">Recent artifacts</h2>
            <Link
              to="/artifacts"
              className="shrink-0 text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {artifacts.slice(0, 6).map((a) => (
              <ArtifactCard key={a.id} artifact={a} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
