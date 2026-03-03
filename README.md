# Aegis AI: Enterprise Modernization & Governance Platform

**A proof-of-concept MVP for Tier-1 Enterprise IT Services and Infrastructure Management**

[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)](https://nextjs.org/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-v4-blue?logo=vercel)](https://sdk.vercel.ai/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> *"The enterprise AI landscape is not short on ambition — it is short on accountability. Aegis AI exists to close that gap."*

---

## Executive Summary

The adoption of large language models across enterprise IT has accelerated dramatically. Yet the gap between **AI hype** and **measurable ROI** continues to widen for most organizations. Billions are invested in model training, prompt engineering, and proof-of-concept demos — while the operational fundamentals of **governance, cost attribution, and compliance traceability** remain unaddressed.

Aegis AI is an opinionated response to this problem.

This platform embeds strict AI governance, MLOps-grade observability, and real-time cost tracking directly into two of the highest-impact operational workflows in enterprise IT:

1. **Legacy Application Modernization** — translating decades-old codebases into modern, maintainable languages with AI, while logging every transformation for audit and cost analysis.
2. **IT Service Management (ITSM) Copilot** — accelerating incident resolution through AI-assisted root cause analysis, with every interaction governed by compliance controls and token-level cost attribution.

The core thesis is straightforward: **AI adoption without embedded governance is technical debt at scale.** Aegis AI demonstrates that governance and developer velocity are not opposing forces — they are complementary when designed into the platform from day one.

Every AI invocation in this system is tracked. Every token is costed. Every response carries a governance card with PII compliance status, estimated ROI, and resource consumption metrics. This is not an afterthought — it is the architecture.

---

## Core Modules

### 1. Legacy-to-Modern AI Translator (Application Modernization)

Enterprise organizations maintain millions of lines of legacy code — COBOL, FORTRAN, PL/I, RPG, and Assembly — running mission-critical workloads on aging infrastructure. Manual rewriting is prohibitively expensive. Unverified AI translation introduces unacceptable risk.

Aegis AI's **Legacy Modernization module** provides a governed, auditable code translation pipeline:

- **Input:** Legacy source code (COBOL, FORTRAN, PL/I, RPG, Assembly)
- **Output:** Modern, idiomatic Python 3.10+ with comprehensive Google-style docstrings and two pytest unit tests per translation
- **Model:** OpenAI GPT-4o via the Vercel AI SDK
- **Governance:** Every transformation is logged to Supabase with source language, output code, estimated token count, model identifier, and wall-clock duration

The module features a professional split-pane editor interface with real-time metrics:

| Metric | Description |
|--------|-------------|
| Lines Analyzed | Source code line count |
| Output Lines | Generated code line count |
| Transform Time | End-to-end latency |
| Security Status | Compliance gate result |

This is not a toy demo. The system prompt enforces structured output: proper error handling, type hints, dataclass usage, and executable unit tests. The output is immediately runnable.

### 2. Governed ITSM Copilot (Service Desk Automation)

The ITSM Copilot is an AI-powered incident management assistant built on ITIL v4 best practices. It provides:

- **Real-time streaming** AI responses for incident analysis, root cause identification, and remediation guidance
- **Governance Cards** appended to every AI response, displaying:
  - **Tokens Used** — estimated from response length
  - **Estimated Cost** — tokens × $0.00001
  - **ROI Time Saved** — projected operational time savings (5–20 minutes per interaction)
  - **PII Compliance Check** — automated compliance gate status
- **MLOps-grade status bar** with live streaming indicators, query/response counters, and ITIL v4 governance badges
- **Full conversation logging** to Supabase — both user queries and assistant responses are persisted with token estimates and model metadata

The Copilot is designed for Tier-1 support engineers and platform teams who need fast, governed, and auditable AI assistance during incident response.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 13.5 (App Router) | Full-stack React with server-side API routes |
| **AI Orchestration** | Vercel AI SDK v4 | `useChat` hook, `streamText`, `generateText` with unified model interface |
| **LLM Provider** | OpenAI (GPT-4o, GPT-4o-mini) | GPT-4o for code modernization, GPT-4o-mini for ITSM chat |
| **Database** | Supabase (PostgreSQL) | Audit logging for modernization jobs and chat history with RLS |
| **Styling** | Tailwind CSS + CSS Variables | Dark-mode enterprise UI with custom design tokens |
| **Icons** | Lucide React | Consistent iconography |
| **Deployment** | Vercel | Zero-config CI/CD from GitHub |

### Architecture Decisions

- **No edge runtime** — API routes run on Node.js serverless functions for full Supabase client compatibility
- **Fire-and-forget logging** — Supabase inserts are non-blocking; they never delay AI responses to the user
- **Graceful degradation** — If Supabase credentials are absent, the platform operates normally with logging disabled
- **Lazy client initialization** — The Supabase client is instantiated on first use, not at import time, preventing build-time failures

---

## Local Setup Instructions

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- An **OpenAI API key** with billing enabled ([platform.openai.com](https://platform.openai.com/))
- A **Supabase project** (free tier is sufficient) ([supabase.com](https://supabase.com/))

### 1. Clone the repository

```bash
git clone https://github.com/aurimas13/Aegis_AI.git
cd Aegis_AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=sk-your-openai-api-key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set up the Supabase database

Open the **Supabase SQL Editor** in your project dashboard and run the contents of [`supabase-schema.sql`](./supabase-schema.sql). This creates the `modernization_logs` and `chat_logs` tables with appropriate Row Level Security policies.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Verify the setup

| Page | URL | What to test |
|------|-----|-------------|
| Legacy Modernization | `/legacy-modernization` | Click **Transform** — COBOL should convert to Python with docstrings and tests |
| ITSM Copilot | `/itsm-copilot` | Send a message — AI response should include a Governance Card |

### Deploying to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com/)
3. Add `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY` as environment variables
4. Deploy

---

## Project Structure

```
Aegis_AI/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # ITSM Copilot streaming endpoint
│   │   ├── modernize/route.ts     # Legacy-to-Python translation endpoint
│   │   └── transform/route.ts     # General code transformation endpoint
│   ├── itsm-copilot/page.tsx      # Governed ITSM Copilot page
│   ├── legacy-modernization/page.tsx  # Code modernization page
│   ├── layout.tsx                 # Root layout with dark theme
│   └── globals.css                # Tailwind + CSS variable definitions
├── components/
│   ├── app-shell.tsx              # Sidebar navigation shell
│   ├── chat-message.tsx           # Chat bubble with Governance Card
│   ├── code-panel.tsx             # Source/output code editor panel
│   ├── governance-card.tsx        # Token cost, ROI, PII compliance card
│   └── ticket-panel.tsx           # ITSM ticket context panel
├── lib/
│   ├── supabase.ts                # Supabase client (lazy init)
│   └── utils.ts                   # Tailwind merge utility
├── supabase-schema.sql            # Database schema (idempotent)
└── .env.local                     # Environment variables (gitignored)
```

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  <strong>Aegis AI</strong> — Governance-first enterprise AI, from proof-of-concept to production.
</p>
