"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Boxes, CheckCircle2, Clock3, Gauge, GitBranch, Globe2, MessageSquare, Play, Radar, Search, ShieldAlert, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TelemetryEvent, TelemetryIncident } from "@/lib/telemetry-store";

const navItems = [
  ["Command Center", "/dashboard", Gauge],
  ["Incidents", "/dashboard/incidents", ShieldAlert],
  ["Kubernetes", "/dashboard/kubernetes", Boxes],
  ["Log Explorer", "/dashboard/logs", Search],
  ["Deployments", "/dashboard/deployments", GitBranch],
  ["Integrations", "/dashboard/integrations", Bell],
] as const;

type TelemetryState = {
  incidents: TelemetryIncident[];
  logs: string[];
  deployments: TelemetryEvent[];
  kubernetes: TelemetryEvent[];
  services: { name: string; status: string }[];
};

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("glass rounded-lg p-4", className)}>{children}</section>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-black/20 p-6 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-blue-500/10 text-blue-200">
        <Radar className="size-5" />
      </div>
      <h3 className="mt-4 text-sm font-medium">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">{body}</p>
      <Button asChild className="mt-4" variant="secondary"><Link href="/dashboard/integrations">Connect telemetry</Link></Button>
    </div>
  );
}

function Shell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#080a0f] text-zinc-100">
      <div className="fixed inset-0 grid-bg opacity-70" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 border-r border-white/10 bg-black/25 p-4 lg:block">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200"><Radar className="size-5" /></div>
            <div><div className="font-semibold">PulseRoot</div><div className="text-xs text-zinc-500">Incident Intelligence</div></div>
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
            <Button asChild className="mt-3 w-full bg-blue-500 text-white hover:bg-blue-400"><Link href="/dashboard"><Play className="size-4" /> Run outage</Link></Button>
          </Panel>
        </aside>
        <main className="w-full p-4 lg:p-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500"><span className="size-2 rounded-full bg-zinc-600" /> real telemetry only</div>
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

function useTelemetry() {
  const [data, setData] = useState<TelemetryState>({ incidents: [], logs: [], deployments: [], kubernetes: [], services: [] });
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/telemetry", { cache: "no-store" });
      setData(await res.json());
    }
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);
  return data;
}

export function IncidentsPage() {
  const telemetry = useTelemetry();
  return (
    <Shell title="Incident Management">
      <Panel>
        <h2 className="mb-4 font-semibold">Active Incidents From Connected Systems</h2>
        {telemetry.incidents.length ? telemetry.incidents.map((incident) => (
          <div key={incident.id} className="mb-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between gap-3"><span className="font-medium">{incident.title}</span><span className="text-xs text-zinc-500">{incident.time} · {incident.confidence}%</span></div>
            <div className="mt-2 text-sm text-zinc-400">{incident.service} · {incident.severity}</div>
          </div>
        )) : <EmptyState title="No real incidents received" body="Incidents appear only when high-severity events arrive through /api/telemetry or /api/integrations/webhook." />}
      </Panel>
    </Shell>
  );
}

export function KubernetesPage() {
  const telemetry = useTelemetry();
  return (
    <Shell title="Kubernetes Monitoring">
      <Panel>
        <h2 className="mb-4 font-semibold">Cluster Events</h2>
        {telemetry.kubernetes.length ? telemetry.kubernetes.map((event) => (
          <div key={event.id} className="mb-2 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm">{event.service}: {event.message}</div>
        )) : <EmptyState title="No Kubernetes source connected" body="Forward Kubernetes events, OOMKilled messages, rollout events, and pod status changes to the webhook endpoint." />}
      </Panel>
    </Shell>
  );
}

export function LogsPage() {
  const telemetry = useTelemetry();
  const [query, setQuery] = useState("");
  const filtered = telemetry.logs.filter((line) => !query || line.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell title="Semantic Log Explorer">
      <Panel>
        <div className="mb-4 flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-blue-400" placeholder="Search ingested logs" />
          <Button variant="secondary"><Search className="size-4" /> Search</Button>
        </div>
        {filtered.length ? filtered.map((line) => <div key={line} className="mb-2 rounded-md border border-white/10 bg-white/[0.04] p-3 font-mono text-xs text-zinc-300">{line}</div>) : <EmptyState title="No logs ingested" body="Send application logs to /api/telemetry with source=log, or point a log drain at /api/integrations/webhook." />}
      </Panel>
    </Shell>
  );
}

export function DeploymentsPage() {
  const telemetry = useTelemetry();
  return (
    <Shell title="Deployment Risk Center">
      <Panel>
        <h2 className="mb-4 font-semibold">Deployment Events</h2>
        {telemetry.deployments.length ? telemetry.deployments.map((event) => (
          <div key={event.id} className="mb-3 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <Clock3 className="size-4 text-blue-300" />
            <div><div className="text-sm font-medium">{event.message}</div><div className="text-xs text-zinc-500">{event.service} · {new Date(event.timestamp).toLocaleString()}</div></div>
          </div>
        )) : <EmptyState title="No deployment source connected" body="Connect GitHub Actions, CI/CD webhooks, or POST deployment events so PulseRoot can correlate incidents to changes." />}
      </Panel>
    </Shell>
  );
}

export function IntegrationsPage() {
  const origin = typeof window === "undefined" ? "http://localhost:3000" : window.location.origin;
  const ingestCommand = `curl -X POST ${origin}/api/telemetry \\
  -H "content-type: application/json" \\
  -d '{"source":"api","service":"checkout-api","message":"HTTP 500 spike on /v1/checkout","severity":"high","status":"degraded","metric":{"latency":780,"errors":8.2}}'`;
  const webhookCommand = `curl -X POST "${origin}/api/integrations/webhook?provider=datadog" \\
  -H "content-type: application/json" \\
  -d '{"service":"payments","title":"p95 latency above SLO","severity":"high","metrics":{"latency":920}}'`;

  return (
    <Shell title="Real System Integrations">
      <div className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        <Panel>
          <h2 className="font-semibold">Supported ingest paths</h2>
          <div className="mt-4 grid gap-3">
            {["Generic JSON telemetry", "Datadog/Grafana alert webhooks", "Kubernetes event forwarders", "GitHub Actions deployment webhooks", "Application log drains"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm"><CheckCircle2 className="size-4 text-emerald-300" /> {item}</div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-semibold">Webhook endpoint</h2>
          <div className="rounded-md border border-white/10 bg-black/35 p-3 font-mono text-xs text-blue-100">{origin}/api/integrations/webhook</div>
          <h3 className="mb-2 mt-5 text-sm font-medium">Send telemetry directly</h3>
          <pre className="overflow-auto rounded-md border border-white/10 bg-black/35 p-3 text-xs leading-5 text-zinc-300">{ingestCommand}</pre>
          <h3 className="mb-2 mt-5 text-sm font-medium">Simulate a provider webhook</h3>
          <pre className="overflow-auto rounded-md border border-white/10 bg-black/35 p-3 text-xs leading-5 text-zinc-300">{webhookCommand}</pre>
        </Panel>
      </div>
    </Shell>
  );
}

export function ReportsPage() {
  const telemetry = useTelemetry();
  return (
    <Shell title="Incident Reports">
      <Panel>
        {telemetry.incidents.length ? <div className="text-sm text-zinc-300">Reports will generate from the selected real incident using the AI report endpoint.</div> : <EmptyState title="No report available" body="Reports are generated from real incidents after connected telemetry identifies an outage or severe anomaly." />}
      </Panel>
    </Shell>
  );
}
