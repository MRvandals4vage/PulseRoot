"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  Bot,
  Boxes,
  CheckCircle2,
  Clipboard,
  CloudLightning,
  Code2,
  Copy,
  Database,
  Download,
  Gauge,
  GitBranch,
  Globe2,
  Lock,
  MessageSquare,
  Play,
  Radar,
  RefreshCw,
  Search,
  ServerCrash,
  Share2,
  ShieldAlert,
  Slack,
  Terminal,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { incidents, logs, metricSeries, reportMarkdown, services, Severity, timeline } from "@/components/rootlens-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

const severityStyles: Record<Severity, string> = {
  critical: "bg-red-500/15 text-red-200 border-red-400/30",
  high: "bg-orange-500/15 text-orange-200 border-orange-400/30",
  medium: "bg-blue-500/15 text-blue-200 border-blue-400/30",
  low: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
};

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("glass rounded-lg p-4", className)}>{children}</section>;
}

function MiniStat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: any; tone: string }) {
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <div className={cn("flex size-9 items-center justify-center rounded-md", tone)}>
          <Icon className="size-4" />
        </div>
        <span className="text-xs text-zinc-500">live</span>
      </div>
      <div className="mt-5 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </Panel>
  );
}

function MetricChart({ title, dataKey, color }: { title: string; dataKey: string; color: string }) {
  return (
    <Panel className="h-48">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-400">streaming</span>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <AreaChart data={metricSeries}>
          <defs>
            <linearGradient id={`${dataKey}Fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.45} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip contentStyle={{ background: "#090b12", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#${dataKey}Fill)`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}

export function PulseRootDashboard() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [chat, setChat] = useState("How do I reduce DB pool exhaustion?");
  const [aiResult, setAiResult] = useState("");
  const [copilotAnswer, setCopilotAnswer] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setStep((value) => (value + 1) % 6), 1250);
    return () => clearInterval(id);
  }, [running]);

  const visibleTimeline = running ? timeline.slice(0, Math.min(step, timeline.length) + 1) : timeline.slice(0, 3);
  const activeIncidents = running ? incidents : incidents.slice(1, 3);

  const aiText = useMemo(() => {
    if (!running) return "Monitoring is stable. PulseRoot is correlating logs, metrics, Kubernetes events, traces, and deployment metadata in the background.";
    return "Root cause likely caused by increased database connection exhaustion after deployment v1.4.2. Memory usage increased 240%, causing API timeout cascades across payment-service and auth-service. Confidence 94%. Recommended action: rollback v1.4.2, reduce worker concurrency, and drain retry queues.";
  }, [running]);

  async function triggerScenario(label = "Database overload") {
    setRunning(true);
    setStep(0);
    setChat(`Simulate: ${label}`);
    setAiResult("Investigating live telemetry...");
    const res = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: label, prompt: `Analyze this incident scenario: ${label}` }),
    });
    const data = await res.json();
    setAiResult(`${data.analysis.summary} Confidence: ${data.analysis.confidence}%.`);
  }

  async function askCopilot() {
    setCopilotAnswer("PulseRoot Copilot is reasoning over incident context...");
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: chat }),
    });
    const data = await res.json();
    setCopilotAnswer(data.answer);
  }

  async function notifyTeams() {
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ channel: "Slack + PagerDuty" }),
    });
    const data = await res.json();
    setNotice(data.message);
  }

  async function copyReport() {
    await navigator.clipboard.writeText(reportMarkdown);
    setNotice("Incident report copied as Markdown.");
  }

  function exportReport() {
    const blob = new Blob([reportMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pulseroot-incident-report.md";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Incident report exported.");
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-zinc-100">
      <div className="fixed inset-0 grid-bg opacity-70" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 border-r border-white/10 bg-black/25 p-4 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200">
              <Radar className="size-5" />
            </div>
            <div>
              <div className="font-semibold">PulseRoot</div>
              <div className="text-xs text-zinc-500">Incident Intelligence</div>
            </div>
          </div>
          <nav className="mt-8 space-y-1 text-sm text-zinc-300">
            {[
              ["Command Center", Gauge],
              ["Incidents", ShieldAlert],
              ["Kubernetes", Boxes],
              ["Log Explorer", Search],
              ["Deployments", GitBranch],
              ["Integrations", Bell],
            ].map(([label, Icon]: any) => (
              <Link key={label} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/8" href={label === "Command Center" ? "/dashboard" : `/dashboard/${String(label).toLowerCase().replace(" ", "-").replace("log-explorer", "logs")}`}>
                <Icon className="size-4" /> {label}
              </Link>
            ))}
          </nav>
          <Panel className="mt-8">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Demo Scenario</div>
            <Button className="mt-3 w-full bg-blue-500 text-white hover:bg-blue-400" onClick={() => triggerScenario()}>
              <Play className="size-4" /> Run outage
            </Button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["K8s crash", "API storm", "Memory leak", "Cache outage"].map((mode) => (
                <button key={mode} onClick={() => triggerScenario(mode)} className="rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-zinc-300 hover:bg-white/10">
                  {mode}
                </button>
              ))}
            </div>
          </Panel>
        </aside>

        <main className="w-full p-4 lg:p-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="pulse-dot size-2 rounded-full bg-emerald-400" /> realtime telemetry active
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Global Reliability Command Center</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => triggerScenario("Database overload")}>
                <CloudLightning className="size-4" /> Demo Scenario
              </Button>
              <Button variant="secondary" onClick={notifyTeams}><Slack className="size-4" /> Notify</Button>
            </div>
          </header>
          {notice && <div className="mb-4 rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{notice}</div>}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MiniStat label="Global uptime" value={running ? "99.71%" : "99.98%"} icon={Activity} tone="bg-emerald-500/15 text-emerald-200" />
            <MiniStat label="Active incidents" value={running ? "7" : "2"} icon={AlertTriangle} tone="bg-red-500/15 text-red-200" />
            <MiniStat label="Open alerts" value={running ? "18" : "5"} icon={Bell} tone="bg-orange-500/15 text-orange-200" />
            <MiniStat label="Deploy status" value={running ? "Risky" : "Healthy"} icon={GitBranch} tone="bg-blue-500/15 text-blue-200" />
            <MiniStat label="Infra score" value={running ? "62" : "91"} icon={CheckCircle2} tone="bg-violet-500/15 text-violet-200" />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <MetricChart title="CPU Saturation" dataKey="cpu" color="#60a5fa" />
              <MetricChart title="Memory Pressure" dataKey="memory" color="#a78bfa" />
              <MetricChart title="API Latency" dataKey="latency" color="#fb7185" />
              <MetricChart title="Error Rate" dataKey="errors" color="#f97316" />
              <MetricChart title="DB Response Time" dataKey="db" color="#facc15" />
              <MetricChart title="Traffic Spikes" dataKey="traffic" color="#34d399" />
            </div>

            <Panel className="scanline">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">AI Root Cause Engine</h2>
                <span className="rounded-full border border-blue-400/25 bg-blue-500/10 px-2 py-1 text-xs text-blue-200">confidence {running ? "94%" : "86%"}</span>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Bot className="size-4" /> Investigation narrative
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{aiResult || aiText}</p>
              </div>
              <div className="mt-4 grid gap-3">
                {["Rollback payment-service to v1.4.1", "Scale Postgres pooler replicas to 6", "Suppress duplicate retry-storm alerts", "Notify payments-oncall and platform-leads"].map((fix, i) => (
                  <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} key={fix} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-zinc-300">
                    <Zap className="size-4 text-amber-300" /> {fix}
                  </motion.div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[.9fr_1.1fr_.9fr]">
            <Panel>
              <h2 className="mb-4 font-semibold">Incident Feed</h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {activeIncidents.map((incident) => (
                    <motion.div layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} key={incident.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("rounded-full border px-2 py-1 text-[11px]", severityStyles[incident.severity])}>{incident.severity}</span>
                        <span className="text-xs text-zinc-500">{incident.time}</span>
                      </div>
                      <div className="mt-2 text-sm font-medium">{incident.title}</div>
                      <div className="mt-1 text-xs text-zinc-500">{incident.service} · AI {incident.confidence}%</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Panel>

            <Panel>
              <h2 className="mb-4 font-semibold">Infrastructure Dependency Map</h2>
              <svg viewBox="0 0 610 250" className="h-[280px] w-full">
                {[[0,1],[1,3],[1,2],[3,4],[3,5],[2,5],[5,6]].map(([a,b], i) => (
                  <motion.line
                    key={`${a}-${b}`}
                    x1={services[a].x + 36}
                    y1={services[a].y + 24}
                    x2={services[b].x + 36}
                    y2={services[b].y + 24}
                    stroke={running && i > 1 ? "#fb7185" : "rgba(255,255,255,.18)"}
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    animate={{ strokeDashoffset: [0, -16] }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                  />
                ))}
                {services.map((service) => (
                  <g key={service.name}>
                    <rect x={service.x} y={service.y} width="116" height="48" rx="8" fill={running && service.status !== "healthy" ? "rgba(239,68,68,.16)" : "rgba(255,255,255,.06)"} stroke={running && service.status !== "healthy" ? "#fb7185" : "rgba(255,255,255,.16)"} />
                    <circle cx={service.x + 18} cy={service.y + 24} r="5" fill={service.status === "healthy" ? "#34d399" : service.status === "warning" ? "#facc15" : "#fb7185"} />
                    <text x={service.x + 30} y={service.y + 29} fill="#e5e7eb" fontSize="12">{service.name}</text>
                  </g>
                ))}
              </svg>
            </Panel>

            <Panel>
              <h2 className="mb-4 font-semibold">Kubernetes Health</h2>
              <div className="space-y-3">
                {[
                  ["prod/payments", "3 pods restarting", ServerCrash, "text-red-200"],
                  ["prod/auth", "healthy replicas 12/12", CheckCircle2, "text-emerald-200"],
                  ["prod/jobs", "memory pressure", Boxes, "text-orange-200"],
                  ["ingress-nginx", "latency elevated", Globe2, "text-blue-200"],
                ].map(([name, detail, Icon, tone]: any) => (
                  <div key={name} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
                    <Icon className={cn("size-4", tone)} />
                    <div>
                      <div className="text-sm">{name}</div>
                      <div className="text-xs text-zinc-500">{detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
            <Panel>
              <h2 className="mb-4 font-semibold">Incident Timeline Reconstruction</h2>
              <div className="space-y-3">
                {visibleTimeline.map((item, i) => (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} key={item.title} className="grid grid-cols-[74px_1fr] gap-4">
                    <div className="text-xs text-zinc-500">{item.time}</div>
                    <div className="relative rounded-lg border border-white/10 bg-white/[0.04] p-3">
                      <span className={cn("absolute -left-[23px] top-4 size-3 rounded-full border", severityStyles[item.severity])} />
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{item.title}</div>
                        <span className={cn("rounded-full border px-2 py-1 text-[10px]", severityStyles[item.severity])}>{item.severity}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Panel>

            <Panel>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">AI Incident Report</h2>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={copyReport}><Copy className="size-3" /> Markdown</Button>
                  <Button variant="secondary" size="sm" onClick={exportReport}><Download className="size-3" /> Export</Button>
                  <Button variant="secondary" size="sm" onClick={() => setNotice("Share link generated: https://pulseroot.example/incidents/checkout-api-outage-sev1")}><Share2 className="size-3" /> Share</Button>
                </div>
              </div>
              <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/30 p-4 text-xs leading-5 text-zinc-300">{reportMarkdown}</pre>
            </Panel>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_.9fr]">
            <Panel>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Semantic Log Analysis</h2>
                <span className="text-xs text-zinc-500">6 correlated clusters</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {logs.map((line, i) => (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} key={line} className={cn("rounded-md border p-3", line.includes("ERROR") ? "border-red-400/20 bg-red-500/10 text-red-100" : "border-white/10 bg-white/[0.04] text-zinc-400")}>
                    {line}
                  </motion.div>
                ))}
              </div>
            </Panel>

            <Panel>
              <h2 className="mb-4 font-semibold">AI Copilot</h2>
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="flex gap-3">
                  <Bot className="mt-1 size-4 text-blue-300" />
                  <p className="text-sm leading-6 text-zinc-300">
                    {copilotAnswer || "To reduce DB pool exhaustion, cap payment worker concurrency, enable request-level backpressure, set pool max below Postgres safe capacity, and add a retry budget. For immediate mitigation run:"}
                  </p>
                </div>
                <div className="mt-3 rounded-md bg-black/40 p-3 font-mono text-xs text-emerald-200">
                  kubectl rollout undo deploy/payment-service -n prod && kubectl scale deploy/payment-worker --replicas=4 -n prod
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <input value={chat} onChange={(e) => setChat(e.target.value)} className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-blue-400" />
                <Button onClick={askCopilot}><MessageSquare className="size-4" /> Ask</Button>
              </div>
            </Panel>
          </div>
        </main>
      </div>
    </div>
  );
}
