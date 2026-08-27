// Fictional demo data for the TransformAI demo workspace.
// None of this represents real organisations, customers or incidents.

export type Status = "ready" | "processing" | "failed" | "draft";

export const workspace = {
  name: "Demo Workspace",
  user: {
    name: "Kartikey Sharma",
    email: "kartikey@demo.transformai.app",
    initials: "KS",
    role: "Workspace Owner",
  },
  plan: "Pro (Demo)",
  usage: { used: 42, limit: 100 },
};

export const metrics = [
  { label: "Transformations", value: "24", delta: "+6 this week" },
  { label: "Artifacts", value: "86", delta: "+18 this week" },
  { label: "Sources", value: "12", delta: "+2 this week" },
  { label: "Usage", value: "42 / 100", delta: "Resets in 12 days" },
];

export type OutputType = {
  id: string;
  label: string;
  category: "Documents" | "Social" | "Presentations" | "Visual" | "Video";
  description: string;
};

export const outputTypes: OutputType[] = [
  {
    id: "exec-summary",
    label: "Executive Summary",
    category: "Documents",
    description: "One-page decision-ready overview",
  },
  {
    id: "advisory",
    label: "Advisory",
    category: "Documents",
    description: "Actionable guidance with severity",
  },
  {
    id: "briefing",
    label: "Briefing Note",
    category: "Documents",
    description: "Structured note for leadership",
  },
  {
    id: "linkedin",
    label: "LinkedIn Post",
    category: "Social",
    description: "Professional narrative post",
  },
  {
    id: "x-thread",
    label: "X Thread",
    category: "Social",
    description: "Sequenced short-form thread",
  },
  {
    id: "presentation",
    label: "Presentation",
    category: "Presentations",
    description: "Slide outline with speaker notes",
  },
  {
    id: "infographic",
    label: "Infographic",
    category: "Visual",
    description: "Visual data layout brief",
  },
  {
    id: "video-script",
    label: "Video Script",
    category: "Video",
    description: "Timed narration script",
  },
  {
    id: "faq",
    label: "FAQ",
    category: "Documents",
    description: "Anticipated questions and answers",
  },
  {
    id: "talking-points",
    label: "Talking Points",
    category: "Documents",
    description: "Spokesperson-ready bullets",
  },
];

export const audiences = [
  "Executive",
  "Government",
  "Technical",
  "Cybersecurity",
  "Public",
  "Media",
  "Marketing",
  "Custom",
];
export const tones = [
  "Executive",
  "Professional",
  "Analytical",
  "Formal",
  "Technical",
  "Neutral",
  "Persuasive",
];
export const detailLevels = ["Brief", "Standard", "Detailed"];
export const objectives = [
  "Inform",
  "Brief",
  "Warn",
  "Advise",
  "Explain",
  "Persuade",
  "Publish",
];
export const languages = ["English", "Hindi"];

export type Evidence = {
  id: string;
  page: number;
  excerpt: string;
};

export type SourceFact = {
  id: string;
  text: string;
  confidence: number;
  evidence: Evidence;
};

export type Source = {
  id: string;
  title: string;
  type: string;
  pages: number;
  size: string;
  status: Status;
  project: string;
  uploaded: string;
  summary: string;
  facts: SourceFact[];
  entities: { name: string; kind: string }[];
  topics: string[];
  risks: { label: string; level: "High" | "Medium" | "Low"; note: string }[];
  timeline: { date: string; event: string }[];
};

export const primarySource: Source = {
  id: "src-q3-incident",
  title: "Cybersecurity Incident Assessment — Q3",
  type: "PDF",
  pages: 28,
  size: "4.2 MB",
  status: "ready",
  project: "Q3 Security Communications",
  uploaded: "18 Aug 2026",
  summary:
    "Internal assessment of a Q3 security incident affecting three systems, including detection timeline, containment actions, service impact and recommended follow-up controls.",
  facts: [
    {
      id: "f1",
      text: "Incident detected on 12 August",
      confidence: 0.99,
      evidence: {
        id: "e1",
        page: 3,
        excerpt:
          "Automated monitoring flagged anomalous authentication activity at 02:14 on 12 August, initiating the incident response process.",
      },
    },
    {
      id: "f2",
      text: "Three systems affected",
      confidence: 0.97,
      evidence: {
        id: "e2",
        page: 6,
        excerpt:
          "Scope of impact was limited to three internal systems: the document gateway, the reporting service and a staging identity node.",
      },
    },
    {
      id: "f3",
      text: "Investigation started on 13 August",
      confidence: 0.98,
      evidence: {
        id: "e3",
        page: 7,
        excerpt:
          "A formal forensic investigation was opened on 13 August with support from the internal security engineering team.",
      },
    },
    {
      id: "f4",
      text: "Potential service disruption identified",
      confidence: 0.92,
      evidence: {
        id: "e4",
        page: 11,
        excerpt:
          "Analysts identified a credible risk of intermittent service disruption for external reporting users during remediation windows.",
      },
    },
    {
      id: "f5",
      text: "No evidence of data exfiltration to date",
      confidence: 0.88,
      evidence: {
        id: "e5",
        page: 14,
        excerpt:
          "As of the reporting date, log review found no evidence of data exfiltration from the affected systems.",
      },
    },
  ],
  entities: [
    { name: "Security Operations Centre", kind: "Team" },
    { name: "Document Gateway", kind: "System" },
    { name: "Reporting Service", kind: "System" },
    { name: "Staging Identity Node", kind: "System" },
    { name: "Northwind Assurance (fictional)", kind: "Vendor" },
    { name: "12–19 August", kind: "Date range" },
  ],
  topics: [
    "Incident response",
    "Access control",
    "Service continuity",
    "Forensics",
    "Stakeholder communication",
    "Remediation",
  ],
  risks: [
    {
      label: "Service disruption during remediation",
      level: "Medium",
      note: "Intermittent downtime possible for reporting users.",
    },
    {
      label: "Credential reuse across environments",
      level: "High",
      note: "Staging credentials mirrored production patterns.",
    },
    {
      label: "Delayed external notification",
      level: "Low",
      note: "Communication templates were not pre-approved.",
    },
  ],
  timeline: [
    { date: "12 Aug", event: "Anomalous authentication detected" },
    { date: "12 Aug", event: "Containment applied to document gateway" },
    { date: "13 Aug", event: "Forensic investigation opened" },
    { date: "16 Aug", event: "Affected systems restored to clean state" },
    { date: "19 Aug", event: "Assessment report finalised" },
  ],
};

export const sources: Source[] = [
  primarySource,
  {
    ...primarySource,
    id: "src-policy-brief",
    title: "National Data Protection Policy Draft",
    type: "DOCX",
    pages: 46,
    size: "1.1 MB",
    status: "ready",
    project: "Policy & Regulatory",
    uploaded: "11 Aug 2026",
    summary:
      "Draft policy text covering data handling obligations, breach reporting thresholds and enforcement mechanisms.",
  },
  {
    ...primarySource,
    id: "src-quarterly-research",
    title: "Threat Landscape Research — H1",
    type: "PDF",
    pages: 62,
    size: "8.9 MB",
    status: "processing",
    project: "Research Desk",
    uploaded: "24 Aug 2026",
    summary:
      "Research compilation of observed threat activity, sector exposure and mitigation maturity across the first half of the year.",
  },
  {
    ...primarySource,
    id: "src-press-note",
    title: "Service Restoration Press Note (Draft)",
    type: "TXT",
    pages: 2,
    size: "12 KB",
    status: "failed",
    project: "Q3 Security Communications",
    uploaded: "25 Aug 2026",
    summary: "Draft external press note prepared for restoration announcement.",
  },
];

export type Artifact = {
  id: string;
  type: string;
  category: "Documents" | "Social" | "Presentations" | "Visual" | "Video";
  title: string;
  project: string;
  grounding: number;
  consistency: number;
  audienceFit: number;
  formatFit: number;
  updated: string;
  body: string;
};

const execSummaryBody = `**Situation**

A security incident was detected on 12 August affecting three internal systems: the document gateway, the reporting service and a staging identity node. Containment was applied the same day.

**Assessment**

A formal forensic investigation opened on 13 August. As of the reporting date there is no evidence of data exfiltration. Analysts identified a credible risk of intermittent service disruption for external reporting users during remediation windows.

**Actions taken**

- Immediate containment of the document gateway on 12 August
- Forensic investigation opened on 13 August
- Affected systems restored to a clean state on 16 August

**Recommendations**

1. Separate staging and production credential patterns to remove reuse risk.
2. Pre-approve external communication templates to reduce notification delay.
3. Schedule remediation windows outside peak reporting hours.

**Decision required**

Approve the remediation window schedule and the external communication template set by end of week.`;

export const artifacts: Artifact[] = [
  {
    id: "art-exec-summary",
    type: "Executive Summary",
    category: "Documents",
    title: "Q3 Incident — Executive Summary",
    project: "Q3 Security Communications",
    grounding: 98,
    consistency: 96,
    audienceFit: 94,
    formatFit: 97,
    updated: "2 hours ago",
    body: execSummaryBody,
  },
  {
    id: "art-advisory",
    type: "Advisory",
    category: "Documents",
    title: "Security Advisory — Credential Reuse",
    project: "Q3 Security Communications",
    grounding: 97,
    consistency: 95,
    audienceFit: 96,
    formatFit: 95,
    updated: "2 hours ago",
    body: `**Advisory severity: Medium**

Following an incident detected on 12 August, three internal systems were affected. Credential patterns shared between staging and production environments have been identified as the principal residual risk.

**Recommended actions**
- Rotate credentials for all staging identity nodes.
- Enforce distinct secret policies per environment.
- Enable step-up authentication for reporting service administrators.

**Expected impact**
Intermittent service disruption is possible for external reporting users during remediation windows.`,
  },
  {
    id: "art-briefing",
    type: "Briefing Note",
    category: "Documents",
    title: "Leadership Briefing Note — Q3 Incident",
    project: "Q3 Security Communications",
    grounding: 96,
    consistency: 94,
    audienceFit: 95,
    formatFit: 96,
    updated: "3 hours ago",
    body: `**Purpose**: brief leadership on the Q3 incident and required decisions.

**Background**: detection on 12 August; three systems affected; investigation opened 13 August.

**Current position**: systems restored 16 August; no evidence of data exfiltration to date.

**Ask**: approve remediation windows and the communication template set.`,
  },
  {
    id: "art-linkedin",
    type: "LinkedIn Post",
    category: "Social",
    title: "LinkedIn — Transparency Update",
    project: "Q3 Security Communications",
    grounding: 95,
    consistency: 93,
    audienceFit: 92,
    formatFit: 94,
    updated: "3 hours ago",
    body: `Transparency matters more than perfect timelines.

In August our monitoring flagged unusual authentication activity. Within hours we contained the affected system. Within a day we opened a full investigation. By 16 August the three affected systems were restored to a clean state.

What we are changing:
• Separate credential patterns for staging and production
• Pre-approved communication templates
• Remediation windows scheduled away from peak hours

Resilience is not the absence of incidents. It is how quickly and openly you respond.`,
  },
  {
    id: "art-thread",
    type: "X Thread",
    category: "Social",
    title: "X Thread — Incident Response Learnings",
    project: "Q3 Security Communications",
    grounding: 94,
    consistency: 92,
    audienceFit: 91,
    formatFit: 93,
    updated: "4 hours ago",
    body: `1/ On 12 August our monitoring flagged anomalous authentication activity. Here is what happened and what we changed.

2/ Three internal systems were in scope. Containment was applied the same day.

3/ A formal investigation opened on 13 August. No evidence of data exfiltration to date.

4/ Systems were restored to a clean state on 16 August.

5/ Biggest lesson: credential patterns must never be shared between staging and production.`,
  },
  {
    id: "art-deck",
    type: "Presentation",
    category: "Presentations",
    title: "Q3 Incident Review — Slide Outline",
    project: "Q3 Security Communications",
    grounding: 96,
    consistency: 95,
    audienceFit: 93,
    formatFit: 96,
    updated: "5 hours ago",
    body: `Slide 1 — Q3 Incident Review
Slide 2 — Timeline: 12 Aug detection → 13 Aug investigation → 16 Aug restoration
Slide 3 — Scope: three affected systems
Slide 4 — Impact: possible intermittent disruption during remediation
Slide 5 — Findings: credential reuse across environments
Slide 6 — Remediation plan and owners
Slide 7 — Decisions required`,
  },
  {
    id: "art-infographic",
    type: "Infographic",
    category: "Visual",
    title: "Incident Timeline Infographic Brief",
    project: "Q3 Security Communications",
    grounding: 93,
    consistency: 94,
    audienceFit: 90,
    formatFit: 92,
    updated: "Yesterday",
    body: `Panel 1 — Detection: 12 August, anomalous authentication
Panel 2 — Scope: 3 systems affected
Panel 3 — Investigation: opened 13 August
Panel 4 — Restoration: 16 August
Panel 5 — Next: credential separation programme`,
  },
  {
    id: "art-video",
    type: "Video Script",
    category: "Video",
    title: "90-Second Internal Update Script",
    project: "Q3 Security Communications",
    grounding: 94,
    consistency: 93,
    audienceFit: 92,
    formatFit: 95,
    updated: "Yesterday",
    body: `[0:00–0:12] On 12 August, our monitoring detected unusual authentication activity.
[0:12–0:35] Three internal systems were affected. We contained the first system the same day.
[0:35–0:55] A formal investigation opened on 13 August. To date, there is no evidence of data exfiltration.
[0:55–1:15] All affected systems were restored to a clean state on 16 August.
[1:15–1:30] Next: separating staging and production credentials, and pre-approving communication templates.`,
  },
];

export type Transformation = {
  id: string;
  source: string;
  outputs: number;
  outputLabels: string[];
  status: Status;
  date: string;
  audience: string;
  tone: string;
};

export const transformations: Transformation[] = [
  {
    id: "tr-1042",
    source: "Cybersecurity Incident Assessment — Q3",
    outputs: 6,
    outputLabels: [
      "Executive Summary",
      "Advisory",
      "Briefing Note",
      "LinkedIn Post",
      "Presentation",
      "Video Script",
    ],
    status: "ready",
    date: "26 Aug 2026",
    audience: "Executive",
    tone: "Executive",
  },
  {
    id: "tr-1041",
    source: "National Data Protection Policy Draft",
    outputs: 4,
    outputLabels: ["Briefing Note", "FAQ", "Talking Points", "Presentation"],
    status: "ready",
    date: "24 Aug 2026",
    audience: "Government",
    tone: "Formal",
  },
  {
    id: "tr-1040",
    source: "Threat Landscape Research — H1",
    outputs: 5,
    outputLabels: [
      "Executive Summary",
      "Advisory",
      "Infographic",
      "X Thread",
      "LinkedIn Post",
    ],
    status: "processing",
    date: "24 Aug 2026",
    audience: "Cybersecurity",
    tone: "Analytical",
  },
  {
    id: "tr-1039",
    source: "Service Restoration Press Note (Draft)",
    outputs: 2,
    outputLabels: ["Talking Points", "FAQ"],
    status: "failed",
    date: "22 Aug 2026",
    audience: "Media",
    tone: "Neutral",
  },
  {
    id: "tr-1038",
    source: "Cybersecurity Incident Assessment — Q3",
    outputs: 3,
    outputLabels: ["FAQ", "Talking Points", "Infographic"],
    status: "ready",
    date: "20 Aug 2026",
    audience: "Public",
    tone: "Neutral",
  },
];

export type Project = {
  id: string;
  name: string;
  description: string;
  sources: number;
  transformations: number;
  artifacts: number;
  updated: string;
  owner: string;
  activity: { when: string; what: string }[];
};

export const projects: Project[] = [
  {
    id: "prj-q3-security",
    name: "Q3 Security Communications",
    description:
      "All internal and external communication derived from the Q3 incident assessment.",
    sources: 3,
    transformations: 9,
    artifacts: 34,
    updated: "2 hours ago",
    owner: "Kartikey Sharma",
    activity: [
      { when: "2 hours ago", what: "Executive Summary regenerated" },
      { when: "5 hours ago", what: "Presentation outline exported" },
      { when: "Yesterday", what: "Grounding review completed" },
    ],
  },
  {
    id: "prj-policy",
    name: "Policy & Regulatory",
    description:
      "Policy drafts converted into briefing notes, FAQs and talking points.",
    sources: 4,
    transformations: 7,
    artifacts: 21,
    updated: "Yesterday",
    owner: "Kartikey Sharma",
    activity: [
      { when: "Yesterday", what: "FAQ artifact edited" },
      { when: "2 days ago", what: "New source uploaded" },
    ],
  },
  {
    id: "prj-research",
    name: "Research Desk",
    description: "Long-form research turned into executive-ready deliverables.",
    sources: 5,
    transformations: 8,
    artifacts: 31,
    updated: "3 days ago",
    owner: "Kartikey Sharma",
    activity: [{ when: "3 days ago", what: "Transformation started" }],
  },
];

export type Claim = {
  id: string;
  text: string;
  status: "Supported" | "Needs Review" | "Unsupported";
  evidence: Evidence;
};

export const groundingClaims: Claim[] = [
  {
    id: "c1",
    text: "Incident detected on 12 August",
    status: "Supported",
    evidence: primarySource.facts[0]!.evidence,
  },
  {
    id: "c2",
    text: "Three internal systems were affected",
    status: "Supported",
    evidence: primarySource.facts[1]!.evidence,
  },
  {
    id: "c3",
    text: "Investigation opened on 13 August",
    status: "Supported",
    evidence: primarySource.facts[2]!.evidence,
  },
  {
    id: "c4",
    text: "Systems restored to clean state on 16 August",
    status: "Supported",
    evidence: {
      id: "e6",
      page: 18,
      excerpt:
        "Restoration of all affected systems to a verified clean state completed on 16 August.",
    },
  },
  {
    id: "c5",
    text: "No evidence of data exfiltration to date",
    status: "Supported",
    evidence: primarySource.facts[4]!.evidence,
  },
  {
    id: "c6",
    text: "Residual risk described as medium overall",
    status: "Needs Review",
    evidence: {
      id: "e7",
      page: 21,
      excerpt:
        "Residual risk is characterised as medium for service continuity and high for credential reuse pending remediation.",
    },
  },
];

export const groundingSummary = {
  supported: 14,
  statistics: 3,
  review: 1,
};

export const consistencyChecks = [
  { label: "Dates", status: "ok" as const, note: "12, 13 and 16 August aligned across 6 outputs" },
  { label: "Names", status: "ok" as const, note: "System names identical across outputs" },
  { label: "Statistics", status: "ok" as const, note: "Three affected systems stated consistently" },
  { label: "Key findings", status: "ok" as const, note: "Credential reuse cited in all outputs" },
  {
    label: "Risk level",
    status: "warn" as const,
    note: "Risk level differs in 1 output",
  },
];

export const consistencyComparison = {
  claim: "Overall residual risk level",
  variants: [
    { artifact: "Executive Summary", value: "Medium residual risk" },
    { artifact: "Advisory", value: "Medium severity advisory" },
    { artifact: "LinkedIn Post", value: "Described as 'contained, low ongoing risk'" },
  ],
};

export const generationSteps = [
  "Source analysed",
  "Facts extracted",
  "Context structured",
  "Generating Executive Summary",
  "Generating Advisory",
  "Generating LinkedIn Post",
  "Generating Presentation",
  "Grounding validation",
  "Consistency validation",
];

export const billingHistory = [
  { id: "INV-2026-08", date: "01 Aug 2026", amount: "₹2,499", status: "Paid", plan: "Pro (Demo)" },
  { id: "INV-2026-07", date: "01 Jul 2026", amount: "₹2,499", status: "Paid", plan: "Pro (Demo)" },
  { id: "INV-2026-06", date: "01 Jun 2026", amount: "₹2,499", status: "Paid", plan: "Pro (Demo)" },
];

export const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    cadence: "forever",
    tagline: "Limited transformations and basic outputs.",
    features: [
      "5 transformations per month",
      "3 output formats",
      "Basic grounding check",
      "Single workspace member",
    ],
    cta: "Start Free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹2,499",
    cadence: "per month (illustrative)",
    tagline: "Higher usage, more outputs, advanced grounding, exports.",
    features: [
      "100 transformations per month",
      "All 10 output formats",
      "Advanced grounding and consistency",
      "Exports to PDF, DOCX and PPTX",
      "Version history",
    ],
    cta: "Upgrade with Razorpay",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "annual agreement",
    tagline: "Team collaboration, API access, advanced security, private deployment.",
    features: [
      "Unlimited workspaces",
      "Team collaboration and roles",
      "API access",
      "Advanced security controls",
      "Private deployment options",
    ],
    cta: "Contact Sales",
  },
];

export const versionHistory = [
  { version: "v4", when: "2 hours ago", note: "Tone adjusted to Executive", author: "Kartikey Sharma" },
  { version: "v3", when: "Yesterday", note: "Risk phrasing aligned with advisory", author: "Kartikey Sharma" },
  { version: "v2", when: "2 days ago", note: "Added decision-required section", author: "Kartikey Sharma" },
  { version: "v1", when: "3 days ago", note: "Initial generation", author: "TransformAI (demo)" },
];
