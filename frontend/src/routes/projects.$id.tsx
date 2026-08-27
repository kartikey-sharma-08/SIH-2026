import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, PageHeader } from "@/components/app/ui-kit";
import { ArtifactCard, SourceCard, TransformationRow } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { artifacts, projects, sources, transformations } from "@/data/demo";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Project unavailable — TransformAI" },
          { name: "robots", content: "noindex" },
        ],
      };
    const t = `${loaderData.project.name} — Project | TransformAI`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.project.description },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.project.description },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Project"
          title={project.name}
          description={project.description}
          actions={
            <Button asChild>
              <Link to="/transform">New transformation</Link>
            </Button>
          }
        />

        <Tabs defaultValue="sources">
          <TabsList className="flex w-full flex-wrap justify-start bg-surface">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="transformations">Transformations</TabsTrigger>
            <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="mt-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sources.slice(0, project.sources).map((s) => (
                <SourceCard key={s.id} source={s} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transformations" className="mt-5">
            <GlassCard className="overflow-hidden">
              {transformations.slice(0, 4).map((t) => (
                <TransformationRow key={t.id} item={t} />
              ))}
            </GlassCard>
          </TabsContent>

          <TabsContent value="artifacts" className="mt-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {artifacts.slice(0, 6).map((a) => (
                <ArtifactCard key={a.id} artifact={a} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-5">
            <GlassCard className="p-5">
              <ol className="space-y-4 border-l border-border pl-5">
                {project.activity.map((a) => (
                  <li key={a.when + a.what} className="relative">
                    <span className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                    <p className="text-xs text-muted-foreground">{a.when}</p>
                    <p className="text-sm">{a.what}</p>
                  </li>
                ))}
              </ol>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
