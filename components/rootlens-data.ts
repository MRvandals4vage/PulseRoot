export type Severity = "critical" | "high" | "medium" | "low";

export const services = [
  { name: "edge-gateway", x: 50, y: 42, status: "healthy" },
  { name: "api-service", x: 190, y: 86, status: "degraded" },
  { name: "auth-service", x: 190, y: 190, status: "healthy" },
  { name: "payment-service", x: 350, y: 86, status: "critical" },
  { name: "postgres-primary", x: 510, y: 86, status: "critical" },
  { name: "redis-cache", x: 350, y: 190, status: "warning" },
  { name: "k8s-workers", x: 510, y: 190, status: "degraded" },
];

export const metricSeries = Array.from({ length: 32 }, (_, i) => ({
  time: `${i + 1}m`,
  cpu: 42 + Math.sin(i / 2) * 9 + (i > 22 ? i * 1.4 : 0),
  memory: 56 + Math.cos(i / 2.8) * 6 + (i > 20 ? i * 1.9 : 0),
  latency: 95 + Math.sin(i / 3) * 28 + (i > 21 ? i * 15 : 0),
  errors: Math.max(0, 0.8 + Math.sin(i / 2.2) * 1.2 + (i > 23 ? (i - 23) * 2.8 : 0)),
  db: 30 + Math.cos(i / 2) * 12 + (i > 20 ? i * 9 : 0),
  traffic: 800 + Math.sin(i / 3) * 120 + (i > 24 ? i * 38 : 0),
}));

export const incidents = [
  {
    severity: "critical" as Severity,
    time: "22:45:18",
    service: "payment-service",
    title: "Timeout cascade across checkout API",
    confidence: 94,
  },
  {
    severity: "high" as Severity,
    time: "22:44:52",
    service: "postgres-primary",
    title: "Connection pool exhaustion detected",
    confidence: 91,
  },
  {
    severity: "high" as Severity,
    time: "22:43:09",
    service: "k8s-workers",
    title: "Restart loop on payment workers",
    confidence: 88,
  },
  {
    severity: "medium" as Severity,
    time: "22:42:33",
    service: "api-service",
    title: "P95 latency exceeded SLO threshold",
    confidence: 86,
  },
];

export const timeline = [
  {
    time: "10:41 PM",
    title: "Deployment v1.4.2 started",
    detail: "Payment API rolled out a new ORM migration and DB pool sizing change.",
    severity: "low" as Severity,
  },
  {
    time: "10:42 PM",
    title: "DB latency increased 180%",
    detail: "Postgres wait events shifted from CPU to connection acquisition stalls.",
    severity: "medium" as Severity,
  },
  {
    time: "10:43 PM",
    title: "Error rate exceeded threshold",
    detail: "HTTP 500 and 504 responses clustered around /v1/checkout and /v1/session.",
    severity: "high" as Severity,
  },
  {
    time: "10:44 PM",
    title: "Pod restart loop detected",
    detail: "Workers hit memory pressure after retry storm amplified queue backlog.",
    severity: "high" as Severity,
  },
  {
    time: "10:45 PM",
    title: "Customer API failures reported",
    detail: "Synthetic probes and frontend telemetry confirmed checkout failures.",
    severity: "critical" as Severity,
  },
];

export const logs = [
  "[payment-service] ERROR db pool acquisition timeout after 5000ms trace=8f2a",
  "[postgres] WARN max_connections reached active=494 waiting=231",
  "[api-service] ERROR upstream payment-service returned 504 for /v1/checkout",
  "[kubelet] WARN pod/payment-worker-7cc9 restarted reason=OOMKilled",
  "[deploy] INFO rollout payment-service:v1.4.2 completed in 86s",
  "[redis-cache] WARN queue retry depth increased to 18,420 jobs",
];

export const reportMarkdown = `# Incident Report: Checkout API Outage

Severity: SEV-1
Status: Mitigating
Primary Root Cause: Database connection exhaustion after payment-service v1.4.2

## Summary
PulseRoot correlated the deployment, DB wait events, retry storm, and Kubernetes restarts. The most likely cause is a connection pool configuration regression in payment-service v1.4.2 that exhausted Postgres capacity and cascaded into API timeouts.

## Remediation
- Roll back payment-service to v1.4.1.
- Reduce worker concurrency from 64 to 24.
- Raise DB pool wait timeout alert sensitivity.
- Drain retry queue after rollback completes.

## Prevention
- Add canary guardrails for DB connection growth.
- Gate deploys on synthetic checkout probes.
- Add retry budget enforcement for payment workers.`;
