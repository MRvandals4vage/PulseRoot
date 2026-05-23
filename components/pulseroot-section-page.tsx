"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Boxes,
  CheckCircle2,
  Clock3,
  Gauge,
  GitBranch,
  Globe2,
  MessageSquare,
  Play,
  Radar,
  Search,
  ShieldAlert,
  Slack,
  Terminal,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { incidents, logs, reportMarkdown, timeline } from "@/components/rootlens-data";
import { cn } from "@/lib/utils";

const navItems = [
  ["Command Center", "/dashboard", Gauge],
  ["Incidents", "/dashboard/incidents", ShieldAlert],
  ["Kubernetes", "/dashboard/kubernetes", Boxes],
  ["Log Explorer", "/dashboard/logs", Search],
  ["Deployments", "/dashboard/deployments", GitBranch],
  ["Integrations", "/dashboard/integrations", Bell],
] as const;

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("glass rounded-lg p-4", className)}>{children}</section>;
}

function Shell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#080a0f] text-zinc-100">
      <div className="fixed inset-0 grid-bg opacity-70" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 border-r border-white/10 bg-black/25 p-4 lg:block">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200">
              <Radar className="size-5" />
            </div>
            <div>
              <div className="font-semibold">PulseRoot</div>
              <div className="text-xs text-zinc-500">Incident Intelligence</div>
            </div>
          </Link>
          <nav className="mt-8 space-y-1 text-sm text-zinc-300">
            {navItems.map(([label, href, Icon]) => (
              <Link key={href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/8", pathname === href && "bg-white/10 text-white")} href={href}>
                <Icon className="size-4" /> {label}
              </Link>
            ))}
          </nav>
          <Panel className="mt-8">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Demo Scenario</div>
            <Button asChild className="mt-3 w-full bg-blue-500 text-white hover:bg-blue-400">
              <Link href="/dashboard"><Play className="size-4" /> Run outage</Link>
            </Button>
          </Panel>
        </aside>
        <main className="w-full p-4 lg:p-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="pulse-dot size-2 rounded-full bg-emerald-400" /> realtime telemetry active
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
            </div>
            <Button asChild variant="secondary"><Link href="/dashboard"><Zap className="size-4" /> Demo Scenario</Link></Button>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

export function IncidentsPage() {
  const [notice, setNotice] = useState("");
  async function notify(channel: string) {
    const res = await fetch("/api/notifications", { method: "POST", body: JSON.stringify({ channel }) });
    const data = await res.json();
    setNotice(data.message);
  }

  return (
    <Shell title="Incident Management">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Grouped Active Incidents</h2>
            <span className="rounded-full border border-red-400/30 bg-red-500/15 px-2 py-1 text-xs text-red-200">SEV-1 active</span>
          </div>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-red-300" />
                    <span className="font-medium">{incident.title}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{incident.time} · {incident.confidence}% AI confidence</span>
                </div>
                <div className="mt-2 text-sm text-zinc-400">{incident.service} is linked to the checkout outage cluster with duplicate alerts suppressed.</div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-4 font-semibold">Escalation Simulation</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {["Slack", "Discord", "PagerDuty", "Email"].map((channel) => (
              <Button key={channel} variant="secondary" onClick={() => notify(channel)}>
                <Slack className="size-4" /> {channel}
              </Button>
            ))}
          </div>
          {notice && <div className="mt-4 rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{notice}</div>}
          <div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-4">
            <div className="text-sm font-medium">Suppression policy</div>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Downstream 504s, queue retry alerts, and pod restarts are grouped under the parent database exhaustion incident until error rate drops below 2% for 10 minutes.</p>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

export function KubernetesPage() {
  return (
    <Shell title="Kubernetes Monitoring">
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["prod/payments", "3 crash-looping pods", "Memory limit exceeded after retry storm", "critical"],
          ["prod/auth", "12/12 replicas healthy", "No rollout drift detected", "healthy"],
          ["prod/jobs", "HPA scale delayed", "Queue depth above autoscaling target", "warning"],
        ].map(([name, state, detail, status]) => (
          <Panel key={name}>
            <div className="flex items-center justify-between">
              <Boxes className={cn("size-5", status === "healthy" ? "text-emerald-300" : status === "warning" ? "text-orange-300" : "text-red-300")} />
              <span className="text-xs text-zinc-500">live</span>
            </div>
            <h2 className="mt-5 font-semibold">{name}</h2>
            <div className="mt-2 text-sm text-zinc-300">{state}</div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{detail}</p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-4">
        <h2 className="mb-4 font-semibold">Pod Events</h2>
        <div className="grid gap-2 font-mono text-xs">
          {["OOMKilled payment-worker-7cc9", "BackOff restarting failed container", "Scaled deployment payment-worker from 12 to 4", "Readiness probe failed /healthz"].map((event) => (
            <div key={event} className="rounded-md border border-white/10 bg-white/[0.04] p-3">{event}</div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}

export function LogsPage() {
  const [query, setQuery] = useState("ERROR");
  const filtered = logs.filter((log) => log.toLowerCase().includes(query.toLowerCase()) || !query);

  return (
    <Shell title="Semantic Log Explorer">
      <Panel>
        <div className="mb-4 flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-blue-400" placeholder="Search logs, traces, errors, services" />
          <Button variant="secondary"><Search className="size-4" /> Search</Button>
        </div>
        <div className="space-y-2 font-mono text-xs">
          {filtered.map((line) => (
            <div key={line} className={cn("rounded-md border p-3", line.includes("ERROR") ? "border-red-400/20 bg-red-500/10 text-red-100" : "border-white/10 bg-white/[0.04] text-zinc-400")}>{line}</div>
          ))}
        </div>
      </Panel>
      <Panel className="mt-4">
        <h2 className="font-semibold">AI Summary</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">Semantic grouping links DB pool acquisition timeouts, API 504s, OOM restarts, and retry queue growth to the same temporal window after deployment v1.4.2.</p>
      </Panel>
    </Shell>
  );
}

export function DeploymentsPage() {
  return (
    <Shell title="Deployment Risk Center">
      <div className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        <Panel>
          <h2 className="mb-4 font-semibold">Pipeline</h2>
          {["v1.4.2 deployed", "Canary SLO failed", "Rollback recommended", "v1.4.1 ready"].map((step, i) => (
            <div key={step} className="flex items-center gap-3 border-l border-white/10 pb-5 pl-4">
              {i < 2 ? <CheckCircle2 className="size-4 text-emerald-300" /> : <Clock3 className="size-4 text-orange-300" />}
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </Panel>
        <Panel>
          <h2 className="mb-4 font-semibold">AI Change Correlation</h2>
          <p className="text-sm leading-6 text-zinc-400">The strongest temporal relationship is between payment-service v1.4.2 and the first Postgres pool wait event 64 seconds later. No infrastructure changes occurred in the same window.</p>
          <div className="mt-4 rounded-md bg-black/35 p-3 font-mono text-xs text-emerald-200">kubectl rollout undo deploy/payment-service -n prod</div>
        </Panel>
      </div>
    </Shell>
  );
}

export function IntegrationsPage() {
  return (
    <Shell title="Integrations">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Slack", "Discord", "PagerDuty", "Email", "Datadog", "Grafana", "Kubernetes", "GitHub Actions"].map((integration) => (
          <Panel key={integration}>
            <Globe2 className="size-5 text-blue-300" />
            <h2 className="mt-5 font-semibold">{integration}</h2>
            <div className="mt-2 text-sm text-zinc-500">Connected demo adapter</div>
            <Button className="mt-4 w-full" variant="secondary">Test</Button>
          </Panel>
        ))}
      </div>
    </Shell>
  );
}

export function ReportsPage() {
  return (
    <Shell title="Incident Reports">
      <Panel>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Generated SEV-1 Report</h2>
          <Button variant="secondary"><MessageSquare className="size-4" /> Copy Markdown</Button>
        </div>
        <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/30 p-4 text-xs leading-5 text-zinc-300">{reportMarkdown}</pre>
      </Panel>
    </Shell>
  );
}
