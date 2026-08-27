import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, GlassCard, PageHeader } from "@/components/app/ui-kit";
import { TransformationRow } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { transformations } from "@/data/demo";

const filters = ["All", "Completed", "Processing", "Failed"] as const;
const map: Record<string, string> = {
  Completed: "ready",
  Processing: "processing",
  Failed: "failed",
};

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Transformation history — TransformAI" },
      {
        name: "description",
        content:
          "Every transformation run in the demo workspace with source, outputs, status and date.",
      },
      { property: "og:title", content: "Transformation history — TransformAI" },
      {
        property: "og:description",
        content: "Full log of transformation runs and their outputs.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const list = transformations.filter(
    (t) => filter === "All" || t.status === map[filter],
  );

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="History"
          title="Transformation history"
          description="Fictional demo runs across the workspace."
          actions={
            <Button asChild>
              <Link to="/transform">New transformation</Link>
            </Button>
          }
        />

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="flex w-full flex-wrap justify-start bg-surface">
            {filters.map((f) => (
              <TabsTrigger key={f} value={f}>
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {list.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="No transformations match this filter in the demo workspace."
            action={
              <Button variant="outline" onClick={() => setFilter("All")}>
                Show all
              </Button>
            }
          />
        ) : (
          <GlassCard className="overflow-hidden">
            {list.map((t) => (
              <TransformationRow key={t.id} item={t} />
            ))}
          </GlassCard>
        )}
      </div>
    </AppShell>
  );
}
