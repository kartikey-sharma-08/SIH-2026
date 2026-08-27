import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, PageHeader } from "@/components/app/ui-kit";
import { ArtifactCard } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { artifacts } from "@/data/demo";

const tabs = ["All", "Documents", "Social", "Presentations", "Visual", "Video"] as const;

export const Route = createFileRoute("/artifacts/")({
  head: () => ({
    meta: [
      { title: "Artifact library — TransformAI" },
      {
        name: "description",
        content:
          "Browse generated summaries, advisories, social posts, decks and scripts with grounding and consistency scores.",
      },
      { property: "og:title", content: "Artifact library — TransformAI" },
      {
        property: "og:description",
        content: "Every generated deliverable, scored for grounding and consistency.",
      },
    ],
  }),
  component: ArtifactsPage,
});

function ArtifactsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [q, setQ] = useState("");

  const list = artifacts.filter(
    (a) =>
      (tab === "All" || a.category === tab) &&
      a.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Artifacts"
          title="Artifact library"
          description="All deliverables generated in the demo workspace."
          actions={
            <Button asChild>
              <Link to="/transform">New transformation</Link>
            </Button>
          }
        />

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="flex w-full flex-wrap justify-start bg-surface">
              {tabs.map((t) => (
                <TabsTrigger key={t} value={t}>
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter artifacts…"
            className="border-border bg-surface lg:w-64"
          />
        </div>

        {list.length === 0 ? (
          <EmptyState
            title="No artifacts match"
            description="Try a different category or clear the filter to see all deliverables."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQ("");
                  setTab("All");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((a) => (
              <ArtifactCard key={a.id} artifact={a} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
