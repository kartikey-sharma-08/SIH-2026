import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, PageHeader } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { projects } from "@/data/demo";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — TransformAI Demo Workspace" },
      {
        name: "description",
        content:
          "Group sources, transformations and artifacts into projects inside the TransformAI demo workspace.",
      },
      { property: "og:title", content: "Projects — TransformAI" },
      {
        property: "og:description",
        content: "Sources, transformations and artifacts organised by project.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [open, setOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Projects"
          title="Projects"
          description="Organise sources, transformations and deliverables by initiative."
          actions={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New project</DialogTitle>
                  <DialogDescription>
                    Projects group sources and their deliverables. Demo only.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pname">Project name</Label>
                    <Input
                      id="pname"
                      placeholder="Q4 Security Communications"
                      className="bg-surface"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pdesc">Description</Label>
                    <Textarea
                      id="pdesc"
                      rows={3}
                      placeholder="What will this project cover?"
                      className="resize-none bg-surface"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      toast.success("Project created (demo)");
                    }}
                  >
                    Create project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} to="/projects/$id" params={{ id: p.id }}>
              <GlassCard hover className="h-full p-5">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {[
                    ["Sources", p.sources],
                    ["Transforms", p.transformations],
                    ["Artifacts", p.artifacts],
                  ].map(([l, v]) => (
                    <div
                      key={l as string}
                      className="rounded-xl border border-border bg-surface py-2"
                    >
                      <p className="text-sm font-medium">{v}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {l}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Updated {p.updated}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
