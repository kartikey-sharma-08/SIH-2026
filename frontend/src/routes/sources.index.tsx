import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/ui-kit";
import { SourceCard } from "@/components/app/cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  PasteEditor,
  UploadZone,
  type UploadState,
} from "@/components/app/transform-parts";
import { sources } from "@/data/demo";
import { setActiveSource } from "@/lib/store";

export const Route = createFileRoute("/sources/")({
  head: () => ({
    meta: [
      { title: "Sources — Upload and transform | TransformAI" },
      {
        name: "description",
        content:
          "Upload PDFs, DOCX, PPTX, images or paste text to create a source for transformation in the TransformAI demo workspace.",
      },
      { property: "og:title", content: "Sources — TransformAI" },
      {
        property: "og:description",
        content: "Upload or paste a source to begin a transformation.",
      },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string>();
  const [fileObj, setFileObj] = useState<File | undefined>();
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (state === "idle" || state === "ready" || state === "failed") return;
    const seq: UploadState[] = ["uploading", "processing", "analysing", "ready"];
    const t = setTimeout(() => {
      const next = seq[seq.indexOf(state) + 1];
      setProgress((p) => Math.min(100, p + 33));
      if (next) setState(next);
      if (next === "ready") {
        toast.success("Source ready to transform");
        setActiveSource({
          id: `src-${Date.now()}`,
          title: fileName || "Custom Source Document",
          type: fileName?.endsWith(".pdf") ? "PDF" : "Document",
          pages: 1,
          size: fileObj ? `${(fileObj.size / (1024 * 1024)).toFixed(1)} MB` : "1.0 MB",
          file: fileObj,
        });
      }
    }, 600);
    return () => clearTimeout(t);
  }, [state, fileName, fileObj]);

  const start = (name: string, file?: File) => {
    setFileName(name);
    setFileObj(file);
    setProgress(10);
    setState("uploading");
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Sources"
          title="What would you like to transform?"
          description="Upload a PDF document or paste text to transform into executive summaries, advisories, social posts, decks & more."
        />

        <Tabs defaultValue="upload">
          <TabsList className="bg-surface">
            <TabsTrigger value="upload">Upload file</TabsTrigger>
            <TabsTrigger value="paste">Paste text</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-5 space-y-4">
            <UploadZone
              state={state}
              progress={progress}
              fileName={fileName}
              onFiles={start}
            />
            {state === "ready" && (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() =>
                    navigate({
                      to: "/transform",
                    })
                  }
                >
                  Go to transform workspace
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: "/sources/$id", params: { id: "src-q3-incident" } })}>
                  View intelligence
                </Button>
              </div>
            )}
            {state === "failed" && (
              <Button variant="outline" onClick={() => setState("idle")}>
                Try again
              </Button>
            )}
          </TabsContent>
          <TabsContent value="paste" className="mt-5">
            <PasteEditor
              value={text}
              onChange={setText}
              onSubmit={() => {
                setActiveSource({
                  id: `src-${Date.now()}`,
                  title: "Pasted Text Source",
                  type: "TXT",
                  pages: 1,
                  size: `${(text.length / 1024).toFixed(1)} KB`,
                  rawText: text,
                });
                toast.success("Text saved as active source");
                navigate({ to: "/transform" });
              }}
            />
          </TabsContent>
        </Tabs>

        <section>
          <h2 className="text-sm font-medium">Your sources</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sources.map((s) => (
              <SourceCard key={s.id} source={s} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
