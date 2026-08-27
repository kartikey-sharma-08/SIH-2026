import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, PageHeader, StatusBadge, ErrorState } from "@/components/app/ui-kit";
import { ArtifactCard } from "@/components/app/cards";
import { ConsistencyPanel, GroundingPanel } from "@/components/app/panels";
import { ProcessingTimeline } from "@/components/app/transform-parts";
import { Button } from "@/components/ui/button";
import { artifacts as initialArtifacts, generationSteps, transformations } from "@/data/demo";
import { getRunById } from "@/lib/store";

export const Route = createFileRoute("/transform/$id")({
  loader: ({ params }) => {
    const customRun = getRunById(params.id);
    if (customRun) {
      return {
        run: {
          id: customRun.id,
          source: customRun.sourceTitle,
          outputs: customRun.artifacts.length,
          status: customRun.status,
          date: customRun.date,
          audience: customRun.audience,
          tone: customRun.tone,
        },
        customArtifacts: customRun.artifacts,
      };
    }
    const run = transformations.find((t) => t.id === params.id);
    if (!run) throw notFound();
    return { run, customArtifacts: null };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Transformation unavailable — TransformAI" },
          { name: "robots", content: "noindex" },
        ],
      };
    const t = `Transformation ${loaderData.run.id} — TransformAI`;
    const d = `${loaderData.run.outputs} deliverables generated from ${loaderData.run.source}.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: TransformRun,
});

function TransformRun() {
  const { run, customArtifacts } = Route.useLoaderData();
  const generated = customArtifacts || initialArtifacts.slice(0, run.outputs);

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow={`Transformation ${run.id}`}
          title={
            run.status === "ready"
              ? "Transformation Complete"
              : run.status === "processing"
                ? "Transformation in progress"
                : "Transformation failed"
          }
          description={`${run.source} · ${run.audience} audience · ${run.tone} tone`}
          actions={
            <Button asChild variant="outline">
              <Link to="/transform">New transformation</Link>
            </Button>
          }
        />

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <StatusBadge status={run.status} />
          <span>{run.date}</span>
          <span>{run.outputs} outputs</span>
        </div>

        {run.status === "failed" ? (
          <ErrorState
            title="Generation failed"
            description="The source could not be parsed in this demo run. Re-upload the source or try a different file type."
            action={
              <Button asChild>
                <Link to="/sources">Back to sources</Link>
              </Button>
            }
          />
        ) : run.status === "processing" ? (
          <GlassCard className="p-5">
            <h2 className="text-sm font-medium">Generation progress</h2>
            <div className="mt-4">
              <ProcessingTimeline steps={generationSteps} current={4} />
            </div>
          </GlassCard>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div>
              <h2 className="text-sm font-medium">Generated artifacts</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {generated.map((a) => (
                  <ArtifactCard key={a.id} artifact={a} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <GroundingPanel />
              <ConsistencyPanel />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
