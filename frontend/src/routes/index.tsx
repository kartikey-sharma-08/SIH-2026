import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Check,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlassCard } from "@/components/app/ui-kit";
import { Brand } from "@/components/app/AppShell";
import { outputTypes, plans } from "@/data/demo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TransformAI — One Source. Every Format. Grounded in Truth." },
      {
        name: "description",
        content:
          "Transform reports, advisories, research and incidents into executive briefs, advisories, social content, presentations and more — grounded and consistent.",
      },
      {
        property: "og:title",
        content: "TransformAI — One Source. Every Format. Grounded in Truth.",
      },
      {
        property: "og:description",
        content:
          "Enterprise AI content transformation: one source, many grounded, consistent deliverables.",
      },
    ],
  }),
  component: Landing,
});

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </section>
  );
}

function PipelineVisual() {
  const stages = [
    { label: "SOURCE", value: "Report.pdf", icon: FileText },
    {
      label: "AI UNDERSTANDING",
      value: "Facts · Entities · Risks",
      icon: Brain,
    },
    {
      label: "TRANSFORMATION",
      value: "Audience · Tone · Objective",
      icon: Target,
    },
  ];
  return (
    <GlassCard className="glow-violet w-full p-6 sm:p-8">
      <div className="space-y-3">
        {stages.map((s, i) => (
          <div key={s.label}>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                <s.icon className="h-4 w-4 text-primary" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </span>
                <span className="block truncate text-sm">{s.value}</span>
              </span>
            </div>
            {i < stages.length && (
              <div className="mx-auto h-5 w-px bg-gradient-to-b from-primary/60 to-transparent" />
            )}
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          {["SUMMARY", "ADVISORY", "SOCIAL", "PPT", "VIDEO"].map((o) => (
            <span
              key={o}
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] tracking-wider text-foreground/90"
            >
              {o}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6">
          <Brand />
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link to="/pricing">Pricing</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/dashboard">Open demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-foreground/90">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Enterprise AI content transformation
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-gradient sm:text-6xl">
            One Source. Every Format. Grounded in Truth.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            Transform reports, advisories, research, incidents, and documents
            into consistent executive briefs, advisories, social content,
            presentations, and more.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/sources">
                Transform a Source <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Demo workspace with fictional data. No real documents are processed.
          </p>
        </div>
        <PipelineVisual />
      </section>

      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="A controlled pipeline from source to deliverable"
        description="Every output is derived from one source of truth, shaped by explicit controls and validated before it reaches an audience."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "Bring one source",
              body: "Upload a PDF, DOCX, PPTX, image or paste raw text. The source becomes the single reference for everything generated.",
            },
            {
              icon: Brain,
              title: "Understand before writing",
              body: "Facts, entities, topics, risks and a timeline are extracted first, each linked back to an excerpt in the source.",
            },
            {
              icon: Layers,
              title: "Generate many formats",
              body: "Pick audience, tone, objective, detail and language, then produce up to ten deliverables in one pass.",
            },
          ].map((c) => (
            <GlassCard key={c.title} hover className="p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                <c.icon className="h-5 w-5 text-primary" />
              </span>
              <h3 className="mt-4 text-base font-medium">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Source intelligence"
        title="Understanding first, generation second"
        description="Before a single word is written, the source is broken into structured intelligence you can inspect."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Key facts", d: "Atomic, verifiable statements with confidence." },
            { t: "Entities", d: "Systems, teams, vendors and dates in scope." },
            { t: "Risks", d: "Severity-rated exposures with context." },
            { t: "Timeline", d: "Chronology reconstructed from the document." },
          ].map((i) => (
            <GlassCard key={i.t} hover className="p-5">
              <h3 className="text-sm font-medium">{i.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.d}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Grounding & consistency"
        title="Nothing ships without evidence"
        description="Every claim is checked against the source, and every output is checked against the others."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard className="p-6">
            <ShieldCheck className="h-5 w-5 text-success" />
            <h3 className="mt-4 text-base font-medium">Grounding check</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Claim-level linking back to source excerpts</li>
              <li>Statistics verified against the original figures</li>
              <li>Statements needing review flagged, never hidden</li>
            </ul>
          </GlassCard>
          <GlassCard className="p-6">
            <Layers className="h-5 w-5 text-lavender" />
            <h3 className="mt-4 text-base font-medium">Cross-output consistency</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Dates, names and statistics aligned across formats</li>
              <li>Key findings phrased consistently</li>
              <li>Divergences surfaced with a side-by-side comparison</li>
            </ul>
          </GlassCard>
        </div>
      </Section>

      <Section
        eyebrow="Output formats"
        title="Ten deliverables from a single pass"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {outputTypes.map((o) => (
            <GlassCard key={o.id} hover className="p-4">
              <p className="text-sm font-medium">{o.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {o.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Use cases"
        title="Built for teams where wording carries weight"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Government", "Policy drafts into briefing notes and public FAQs."],
            ["Enterprise comms", "Incidents into executive and staff updates."],
            ["Cybersecurity", "Assessments into advisories and talking points."],
            ["PR & media", "Statements aligned across every channel."],
            ["Research & policy", "Long-form research into decision summaries."],
            ["Executives", "One-page positions with evidence on demand."],
            ["Marketing", "Campaign-safe content that stays factual."],
            ["Analysts", "Repeatable formats with consistent terminology."],
          ].map(([t, d]) => (
            <GlassCard key={t} hover className="p-5">
              <h3 className="text-sm font-medium">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Pricing"
        title="Simple, illustrative pricing"
        description="Figures shown are illustrative for this demo."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <GlassCard
              key={p.id}
              className={
                p.highlighted ? "border-primary/40 bg-primary/8 p-6" : "p-6"
              }
            >
              <h3 className="text-sm font-medium">{p.name}</h3>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {p.price}
              </p>
              <p className="text-xs text-muted-foreground">{p.cadence}</p>
              <p className="mt-3 text-sm text-muted-foreground">{p.tagline}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-6 w-full"
                variant={p.highlighted ? "default" : "outline"}
              >
                <Link to="/pricing">{p.cta}</Link>
              </Button>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section eyebrow="FAQ" title="Questions, answered">
        <GlassCard className="px-6">
          <Accordion type="single" collapsible>
            {[
              [
                "Is this demo processing real documents?",
                "No. This is a frontend demo with fictional data. Nothing is uploaded, stored or analysed.",
              ],
              [
                "What does grounding mean here?",
                "Each generated claim is linked to an excerpt from the source so reviewers can verify wording against the original.",
              ],
              [
                "How is consistency measured?",
                "Dates, names, statistics and key findings are compared across every output produced from the same source.",
              ],
              [
                "Which languages are supported?",
                "The demo shows English and Hindi as selectable output languages.",
              ],
              [
                "Can outputs be edited?",
                "Yes. Every artifact has an editor, version history, export and regenerate actions in the demo workspace.",
              ],
            ].map(([q, a], i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </GlassCard>
      </Section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <GlassCard className="glow-violet px-6 py-14 text-center sm:px-12">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
            Transform your first source
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Explore the full workflow in the demo workspace: source intelligence,
            controlled transformation, grounding and consistency.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/sources">Transform a Source</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">Open the dashboard</Link>
            </Button>
          </div>
        </GlassCard>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-8 sm:px-6">
          <Brand />
          <p className="shrink-0 text-xs text-muted-foreground">
            Demo workspace · fictional data
          </p>
        </div>
      </footer>
    </div>
  );
}
