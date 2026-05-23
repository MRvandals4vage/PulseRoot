import Link from "next/link";
import { Activity, ArrowRight, Bell, Bot, BrainCircuit, CheckCircle2, Database, GitBranch, LineChart, Lock, MessageSquare, Radar, Server, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

function Glass({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-lg ${className}`}>{children}</div>;
}

export default function LandingPage() {
  const features = [
    ["Anomaly detection", "Continuously detects metric, log, deployment, and API behavior shifts.", LineChart],
    ["AI root cause analysis", "Correlates temporal signals and explains probable causality with confidence.", BrainCircuit],
    ["Incident timelines", "Reconstructs outage progression from deployment to customer impact.", GitBranch],
    ["Smart alerting", "Groups related alerts, suppresses noise, and simulates escalations.", Bell],
    ["Kubernetes intelligence", "Surfaces crash loops, memory leaks, rollout risk, and pod pressure.", Server],
    ["Automated reports", "Generates polished postmortems, markdown, PDF, and share links.", MessageSquare],
  ];

  return (
    <main className="min-h-screen overflow-hidden text-zinc-100">
      <div className="fixed inset-0 grid-bg opacity-70" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200">
            <Radar className="size-5" />
          </div>
          <span className="font-semibold">PulseRoot</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
          <Button asChild><Link href="/api/demo-login">Demo</Link></Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-5 pb-16 pt-8 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">
            <Sparkles className="size-4" /> AI incident intelligence for SRE teams
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-tight md:text-7xl">
            AI That Finds Your Outages Before Your Team Does.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            PulseRoot analyzes logs, metrics, deployments, and infrastructure events in real time to identify root causes and recommend fixes instantly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200">
              <Link href="/api/demo-login"><Zap className="size-4" /> Launch Demo Scenario</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Create workspace <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {["38k events/min", "94% RCA confidence", "2.1s triage"].map((metric) => (
              <Glass key={metric} className="p-3 text-center text-sm text-zinc-300">{metric}</Glass>
            ))}
          </div>
        </div>

        <div className="relative">
          <Glass className="scanline p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Production Reliability</div>
                <div className="text-xs text-zinc-500">payment-service incident active</div>
              </div>
              <span className="rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-xs text-red-200">SEV-1</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["API latency", "842ms", "text-red-200"],
                ["Error rate", "12.8%", "text-orange-200"],
                ["DB pool", "99%", "text-red-200"],
              ].map(([label, value, tone]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/25 p-3">
                  <div className="text-xs text-zinc-500">{label}</div>
                  <div className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 h-56 rounded-lg border border-white/10 bg-black/25 p-4">
              <div className="flex h-full items-end gap-2">
                {Array.from({ length: 42 }, (_, i) => (
                  <div key={i} className="flex-1 rounded-t bg-blue-400/50" style={{ height: `${20 + Math.sin(i / 2) * 12 + (i > 28 ? (i - 28) * 5 : 0)}%` }} />
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-blue-400/20 bg-blue-500/10 p-4">
              <div className="flex items-center gap-2 text-sm text-blue-200"><Bot className="size-4" /> PulseRoot AI</div>
              <p className="mt-2 text-sm leading-6 text-zinc-300">Deployment v1.4.2 introduced DB pool exhaustion. Roll back payment-service and reduce worker concurrency.</p>
            </div>
          </Glass>
          <Glass className="absolute -left-6 top-16 hidden w-56 p-4 lg:block">
            <ShieldAlert className="mb-3 size-5 text-red-300" />
            <div className="text-sm font-medium">Incident grouped</div>
            <div className="mt-1 text-xs text-zinc-500">14 alerts suppressed into one RCA</div>
          </Glass>
          <Glass className="absolute -right-6 bottom-12 hidden w-56 p-4 lg:block">
            <Activity className="mb-3 size-5 text-emerald-300" />
            <div className="text-sm font-medium">Live telemetry</div>
            <div className="mt-1 text-xs text-zinc-500">logs, traces, deploys, k8s events</div>
          </Glass>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Built for production incidents</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">Dense operational views without losing the story behind the outage.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, body, Icon]: any) => (
            <Glass key={title} className="p-5">
              <Icon className="size-5 text-blue-300" />
              <h3 className="mt-5 font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
            </Glass>
          ))}
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto max-w-7xl px-5 py-16">
        <Glass className="p-6">
          <h2 className="text-3xl font-semibold tracking-tight">AI workflow visualization</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-7">
            {["Telemetry", "Stream processor", "Correlation", "AI RCA", "Remediation", "Report", "Notify"].map((step, i) => (
              <div key={step} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-center">
                <div className="mx-auto mb-3 flex size-9 items-center justify-center rounded-md bg-blue-500/15 text-blue-200">{i + 1}</div>
                <div className="text-sm">{step}</div>
              </div>
            ))}
          </div>
        </Glass>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-4 px-5 py-16 lg:grid-cols-3">
        {["NovaStack", "FinAPI Cloud", "Atlas Commerce"].map((name) => (
          <Glass key={name} className="p-5">
            <p className="text-sm leading-6 text-zinc-300">“PulseRoot turned incident review from guesswork into a clear sequence of facts, fixes, and prevention steps.”</p>
            <div className="mt-4 text-sm font-medium">{name}</div>
            <div className="text-xs text-zinc-500">Platform Engineering</div>
          </Glass>
        ))}
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Team", "$49", "For fast-moving engineering teams"],
            ["Business", "$199", "For multi-service production estates"],
            ["Enterprise", "Custom", "For regulated global operations"],
          ].map(([tier, price, body]) => (
            <Glass key={tier} className="p-6">
              <h3 className="text-xl font-semibold">{tier}</h3>
              <div className="mt-4 text-4xl font-semibold">{price}</div>
              <p className="mt-3 text-sm text-zinc-400">{body}</p>
              <div className="mt-6 space-y-3 text-sm text-zinc-300">
                {["AI RCA engine", "Realtime dashboards", "Incident reports"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-300" /> {item}</div>
                ))}
              </div>
            </Glass>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-5 py-20 text-center">
        <Lock className="mx-auto mb-5 size-8 text-blue-300" />
        <h2 className="text-4xl font-semibold tracking-tight">Turn every outage into an explained, fixable incident.</h2>
        <div className="mt-8">
          <Button asChild size="lg"><Link href="/api/demo-login">Run the cinematic demo</Link></Button>
        </div>
      </section>
    </main>
  );
}
