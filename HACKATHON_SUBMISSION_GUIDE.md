# PulseRoot - AI Hackathon Submission Guide

This guide contains the pre-filled, highly optimized response copy for each of the fields in the **AI Hackathon for Builders** submission form.

---

## 1. n8n Workflow JSON File
**Recommendation:** Leave blank or Upload N/A.

**Written Response / Note (if required):**
```text
Not applicable. PulseRoot is implemented as a custom Next.js full-stack production web agent leveraging Supabase Postgres, Upstash Redis, Groq/Gemini LLM endpoints, and custom webhook ingestion APIs instead of a standard n8n builder.
```

---

## 2. Credentials to Access Your Agent
**Copy & Paste:**
```text
No credentials required. The PulseRoot agent dashboard is fully public for hackathon judging and evaluation. 

To experience the full agent capabilities, navigate to:
https://YOUR_DEPLOYED_DOMAIN/dashboard

Features to test:
1. "Demo Scenario": Click this button on the left sidebar to run the interactive cinematic outage flow. Watch the AI Root Cause Engine reconstruct the timeline, trace dependencies in the SVG map, ingest semantic logs, and generate a postmortem in real time.
2. "AI Copilot": Interact with the SRE assistant input at the bottom right. Ask operational questions like "How do I reduce DB pool exhaustion?" or request mitigation commands.
3. "Real-Ingest Telemetry": SREs can post real JSON payloads directly to `/api/telemetry` to populate the live dashboard metrics dynamically.
```

---

## 3. GitHub Codebase Link
**Copy & Paste:**
```text
https://github.com/MRvandals4vage/PulseRoot
```

---

## 4. Feel Free to Share Any Other Material (eg. Deck) Created by You/Your Team
**Copy & Paste:**
```text
We have compiled the architecture, product space vision, and system details below to assist the judging panel in evaluating PulseRoot:

### 🚀 PulseRoot: AI-Powered SRE Incident Intelligence

PulseRoot is a high-performance, dark-themed, glassmorphic SRE agent that ingests multi-source telemetry (logs, metrics, deployments, Kubernetes clusters), correlates anomalies, and outputs explainable root-cause analyses in seconds.

#### 🛠️ Key Capabilities & Features:
1. **Global Reliability Command Center**: Real-time glassmorphic visualization of streaming infrastructure health: CPU, Memory, API Latency, Error Rate, DB Response Time, and Traffic.
2. **AI Root Cause Engine**: Merges temporal events to isolate connection pools, memory pressure, and code regressions, providing actionable remediation steps with high confidence scores.
3. **Infrastructure Dependency Map**: An interactive, dynamic SVG representation of the service hierarchy that traces downstream cascades and network degradation paths in real time.
4. **Incident Timeline Reconstruction**: Seamlessly maps out the temporal chain of events from the initial code check-in to localized resource degradation, queue saturation, and eventual end-user impact.
5. **Interactive AI Copilot**: A context-aware chatbot trained on real-time cluster states that spits out precise recovery commands (e.g., `kubectl rollout undo` or `kubectl scale`) to mitigate active outages.
6. **One-Click Postmortems**: Automatically generates a professional postmortem document in Markdown format complete with timelines, remediation lists, and preventive actions.

#### 🏗️ Technical Stack & Architecture:
- **Frontend/Backend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Caching & Streaming**: Upstash Redis (realtime high-throughput telemetry cache)
- **Data Persistence**: Supabase Postgres (durable relational telemetry and incident log storage)
- **Agent Intelligence Engine**: Gemini API & Groq API for sub-second correlation, timeline reasoning, and interactive SRE copilot answers.
- **Ingestion Interfaces**: Ingests JSON webhooks from Datadog, Grafana, GitHub Actions, Kubernetes, or custom application log drains at `/api/telemetry` and `/api/integrations/webhook`.

PulseRoot is fully responsive, optimized for low-latency web interactions, and built to scale for modern Kubernetes-orchestrated service meshes.
```
