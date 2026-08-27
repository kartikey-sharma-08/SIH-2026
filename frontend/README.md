# TransformAI Workspace

TRANSFORMai — FRONTEND MVP

Act as a senior frontend engineer and product designer. Build the complete frontend-only MVP of TransformAI, an enterprise AI content transformation platform.

This generation is specifically optimized for limited Lovable build credits. Prioritize completeness of the core product experience over backend architecture and secondary features.

HARD SCOPE

Build only:

Public landing page

Login/signup demo screens

Dashboard

Projects

Sources

Source upload

Source intelligence

Transform workspace

Generation progress

Artifacts

Artifact editor

Grounding/consistency panels

History

Pricing

Billing UI

Settings

Responsive navigation

Loading/empty/error/success states

Realistic demo data

Frontend-only interactions

DO NOT BUILD:

Backend

Database

FastAPI

Supabase

Real authentication

Real AI APIs

OCR

RAG/vector database

File storage

Background workers

Real API endpoints

Real Razorpay integration

Webhooks

Analytics infrastructure

Enterprise SSO

Admin backend

Deployment infrastructure

Do not spend build credits on infrastructure.

PRODUCT

TransformAI — AI Content Transformation Engine

Core proposition:

One Source. Every Format. Grounded in Truth.

Core workflow:

Source → AI Understanding → Transformation → Grounding/Consistency → Multiple Deliverables

Target users:

Government

Enterprise communications

Cybersecurity

PR/media

Research/policy

Executives

Marketing

Main output types:

Executive Summary

Advisory

Briefing Note

LinkedIn Post

X Thread

Presentation

Infographic

Video Script

FAQ

Talking Points

DESIGN

Use:

Premium dark glassmorphism + Apple-like restraint + Linear-style product UX + futuristic AI workspace

Colors

Background: #080808 / #0D0D0F
Surface: rgba(255,255,255,0.06)
Border: rgba(255,255,255,0.12)
Primary text: #F5F5F5
Secondary text: #A1A1AA
Accent: Violet / Electric Purple
Secondary accent: Lavender / Magenta
Success: Soft Green
Warning: Amber
Error: Soft Red


STRICT RULE

NO BLUE.

Do not use blue for buttons, links, navigation, highlights, gradients, or default component styling.

Use glass panels, thin borders, subtle blur, restrained violet glow, large rounded corners, and minimal shadows.

Avoid cyberpunk, excessive neon, excessive gradients, robot imagery, stock AI graphics, and clutter.

Use Inter or Geist.

TECH STACK

Use:

React

TypeScript

Tailwind CSS

shadcn/ui

Lucide React

Framer Motion only for subtle animations

Keep mock data in dedicated data files.

Use reusable components.

ROUTES

Create these routes:

/
 /login
 /signup
 /dashboard
 /projects
 /projects/:id
 /sources
 /sources/:id
 /transform
 /transform/:id
 /artifacts
 /artifacts/:id
 /history
 /pricing
 /billing
 /settings


Do not create backend routes.

APPLICATION SHELL

Desktop:

Left glass sidebar

Top bar

Main content

Sidebar:

TransformAI

Overview
Projects
Sources
Transform
Artifacts
History

Usage
Billing
Settings


Mobile:

Compact top bar

Navigation drawer

Stacked content

LANDING PAGE

Create a premium hero.

Headline

One Source. Every Format. Grounded in Truth.

Subheading

Transform reports, advisories, research, incidents, and documents into consistent executive briefs, advisories, social content, presentations, and more.

CTA

Transform a Source

Secondary:

See How It Works

Hero visual

Create a floating glass pipeline:

SOURCE
Report.pdf
   ↓
AI UNDERSTANDING
Facts · Entities · Risks
   ↓
TRANSFORMATION
Audience · Tone · Objective
   ↓
SUMMARY · ADVISORY · SOCIAL · PPT · VIDEO


Add sections for:

How It Works

Source Intelligence

Grounding & Consistency

Output Formats

Use Cases

Pricing

FAQ

Final CTA

Do not create fake testimonials or customer logos.

DASHBOARD

Create a polished dashboard with:

Primary CTA

+ New Transformation

Metrics

Transformations
24

Artifacts
86

Sources
12

Usage
42 / 100


Clearly use fictional demo data.

Recent Transformations

Show source, outputs, status, date.

Recent Artifacts

Show artifact cards.

Quick Start

Transform a New Source

SOURCE UPLOAD

Create a premium upload screen.

Headline:

What would you like to transform?

Support UI for:

PDF

DOCX

TXT

PPTX

Images

Paste text

Use simulated frontend states:

Uploading
Processing
Analysing
Ready
Failed


Include a large drag-and-drop area and text editor.

SOURCE INTELLIGENCE

Create a rich source-analysis page.

Show:

Source title

Type

Pages

Key facts

Entities

Topics

Risks

Timeline

Evidence

Example fictional source:

Cybersecurity Incident Assessment — Q3

Example facts:

Incident detected on 12 August

Three systems affected

Investigation started on 13 August

Potential service disruption identified

Use the same fictional source throughout the app.

Clicking evidence opens a side drawer showing the source excerpt.

TRANSFORM WORKSPACE

This is the most important product screen.

Desktop layout:

SOURCE INTELLIGENCE
        |
        |   TRANSFORMATION CONTROLS
        |
        +-- Audience
        +-- Tone
        +-- Objective
        +-- Detail
        +-- Language
        |
        +-- OUTPUTS


Audience

Executive

Government

Technical

Cybersecurity

Public

Media

Marketing

Custom

Tone

Executive

Professional

Analytical

Formal

Technical

Neutral

Persuasive

Detail

Brief

Standard

Detailed

Objective

Inform

Brief

Warn

Advise

Explain

Persuade

Publish

Language

English

Hindi

OUTPUT SELECTOR

Create selectable glass cards for:

Executive Summary

Advisory

Briefing Note

LinkedIn

X Thread

Presentation

Infographic

Video Script

FAQ

Talking Points

Selected outputs get a subtle violet highlight.

CTA dynamically displays:

Generate 6 Deliverables

GENERATION EXPERIENCE

Simulate the generation flow in frontend state.

Show:

✓ Source analysed
✓ Facts extracted
✓ Context structured
● Generating Executive Summary
○ Generating Advisory
○ Generating LinkedIn
○ Generating Presentation
○ Grounding validation
○ Consistency validation


After completion:

Transformation Complete

Show generated artifact cards.

Do not claim that real AI processing is happening.

ARTIFACTS

Create an artifact library with:

All

Documents

Social

Presentations

Visual

Video

Artifact cards show:

Type

Title

Project

Grounding score

Consistency

Updated time

ARTIFACT DETAIL

Create a polished review/editor screen.

Show:

Executive Summary

Grounding     98%
Consistency   96%
Audience Fit  94%
Format Fit    97%


Provide frontend interactions:

Edit

Copy

Regenerate

Export

View Evidence

View Version History

Use realistic fictional content.

GROUNDING PANEL

Create a side panel:

GROUNDING CHECK

✓ 14 claims supported
✓ 3 statistics verified
⚠ 1 statement requires review


Statuses:

Supported

Needs Review

Unsupported

Clicking a claim shows source evidence.

CONSISTENCY PANEL

Create:

CROSS-OUTPUT CONSISTENCY

96% Consistent

✓ Dates
✓ Names
✓ Statistics
✓ Key findings
⚠ Risk level differs in 1 output


Click warning to show comparison.

HISTORY

Show:

Transformation

Source

Outputs

Status

Date

Include filters:

All

Completed

Processing

Failed

PRICING

Create three cards.

FREE

₹0

Limited transformations and basic outputs.

PRO

Higher usage, more outputs, advanced grounding, exports.

CTA:

Upgrade with Razorpay

ENTERPRISE

Team collaboration, API access, advanced security, private deployment.

CTA:

Contact Sales

Do not invent fake pricing unless clearly marked as illustrative.

RAZORPAY BILLING UI

Use Razorpay only.

Do not mention Stripe.

Create /billing with:

Current plan

Usage

Billing history

Upgrade button

Subscription status

Upgrade modal:

Choose Plan
↓
Order Summary
↓
Continue to Razorpay


This is a frontend-only simulation.

Do not connect to Razorpay API yet.

SETTINGS

Create:

Profile

Name, email, avatar.

Preferences

Language, tone, notifications.

Workspace

Workspace name, default audience, default tone.

Security

Password, sessions, 2FA UI.

Data

Export data, delete account UI.

PROJECTS

Create:

Project cards

New Project modal

Project detail

Sources

Transformations

Artifacts

Activity

Use realistic sample data.

GLOBAL UX

Implement:

Search

Notifications

Toasts

Modals

Drawers

Confirmation dialogs

Loading skeletons

Empty states

Error states

Success states

Keyboard shortcut:

Ctrl/Cmd + K → search.

RESPONSIVE REQUIREMENTS

Desktop:

Sidebar

Multi-column workspace

Large glass panels

Mobile:

Drawer navigation

Vertical workflow

Collapsible sections

Sticky primary CTA

Support 320px to large desktop.

DEMO DATA

Use one coherent fictional source across the application:

Cybersecurity Incident Assessment — Q3

Use consistent fictional facts, dates, organizations, and risks across:

Dashboard

Source Intelligence

Transformation

Generated artifacts

Grounding

Consistency

History

Label it as:

Demo Workspace

Do not use real customer information.

COMPONENT SYSTEM

Create reusable components for:

GlassCard

Button

Sidebar

Topbar

PageHeader

MetricCard

SourceCard

ArtifactCard

UploadZone

OutputSelector

ProcessingTimeline

GroundingPanel

ConsistencyPanel

EvidenceDrawer

EmptyState

ErrorState

Skeleton

Modal

Tabs

Toast

Search

IMPORTANT RESTRICTIONS

Do not:

Build backend

Build database

Build Supabase

Build FastAPI

Build AI integrations

Build OCR

Build RAG

Build real Razorpay

Build Stripe

Add real API keys

Add fake testimonials

Add fake customer logos

Add fake certifications

Use blue

Use cyberpunk styling

Use excessive neon

Use lorem ipsum

Leave unfinished routes

Leave placeholder pages

Create non-functional navigation

PRIORITY

If build capacity becomes limited, prioritize:

Design system

Landing page

App shell

Dashboard

Source upload

Source intelligence

Transform workspace

Generation progress

Artifact review/editor

Grounding

Consistency

Projects

Pricing/Billing

History

Settings

Do not sacrifice the core transformation workflow for secondary features.

FINAL INSTRUCTION

Build the entire frontend now.

The result must be a complete, polished, responsive, navigable frontend that convincingly demonstrates:

One Source → AI Understanding → Controlled Transformation → Grounded, Consistent Multi-Format Communication

Use frontend-only mock state and coherent demo data so the product feels functional.

Do not build backend infrastructure in this generation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0aeefb8d-d20e-42fc-ad3f-f2dffe3c9d22).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
