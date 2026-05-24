import { randomUUID } from "node:crypto";

export type TelemetryMetric = {
  time: string;
  cpu?: number;
  memory?: number;
  latency?: number;
  errors?: number;
  db?: number;
  traffic?: number;
};

export type TelemetryIncident = {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  time: string;
  service: string;
  title: string;
  confidence: number;
};

export type TelemetryService = {
  name: string;
  status: "healthy" | "warning" | "degraded" | "critical";
};

export type TelemetryEvent = {
  id: string;
  source: "log" | "metric" | "kubernetes" | "deployment" | "trace" | "api";
  service: string;
  message: string;
  severity?: TelemetryIncident["severity"];
  timestamp: string;
  raw?: unknown;
};

export type Store = {
  metrics: TelemetryMetric[];
  incidents: TelemetryIncident[];
  services: TelemetryService[];
  events: TelemetryEvent[];
  logs: string[];
  deployments: TelemetryEvent[];
  kubernetes: TelemetryEvent[];
};

const globalStore = globalThis as typeof globalThis & { __pulserootStore?: Store };

function makeStore(): Store {
  return {
    metrics: [],
    incidents: [],
    services: [],
    events: [],
    logs: [],
    deployments: [],
    kubernetes: [],
  };
}

export function getTelemetryStore() {
  if (!globalStore.__pulserootStore) globalStore.__pulserootStore = makeStore();
  return globalStore.__pulserootStore;
}

export function replaceTelemetryStore(store: Store) {
  globalStore.__pulserootStore = {
    metrics: store.metrics || [],
    incidents: store.incidents || [],
    services: store.services || [],
    events: store.events || [],
    logs: store.logs || [],
    deployments: store.deployments || [],
    kubernetes: store.kubernetes || [],
  };
  return globalStore.__pulserootStore;
}

export function ingestTelemetry(input: Partial<TelemetryEvent> & { metric?: Partial<TelemetryMetric>; status?: TelemetryService["status"] }) {
  const store = getTelemetryStore();
  const timestamp = input.timestamp || new Date().toISOString();
  const source = input.source || "log";
  const service = input.service || "unknown-service";
  const message = input.message || "Telemetry event received";
  const severity = input.severity || inferSeverity(message);
  const event: TelemetryEvent = {
    id: randomUUID(),
    source,
    service,
    message,
    severity,
    timestamp,
    raw: input.raw || input,
  };

  store.events.unshift(event);
  store.events = store.events.slice(0, 250);

  if (source === "log") store.logs.unshift(`[${service}] ${severity.toUpperCase()} ${message}`);
  if (source === "deployment") store.deployments.unshift(event);
  if (source === "kubernetes") store.kubernetes.unshift(event);
  store.logs = store.logs.slice(0, 250);

  if (input.metric) {
    store.metrics.push({
      time: new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      cpu: input.metric.cpu,
      memory: input.metric.memory,
      latency: input.metric.latency,
      errors: input.metric.errors,
      db: input.metric.db,
      traffic: input.metric.traffic,
    });
    store.metrics = store.metrics.slice(-120);
  }

  if (input.status) {
    const existing = store.services.find((item) => item.name === service);
    if (existing) existing.status = input.status;
    else store.services.push({ name: service, status: input.status });
  }

  if (severity === "critical" || severity === "high") {
    store.incidents.unshift({
      id: event.id,
      severity,
      time: new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      service,
      title: message,
      confidence: 72,
    });
    store.incidents = store.incidents.slice(0, 100);
  }

  return event;
}

export function clearTelemetry() {
  globalStore.__pulserootStore = makeStore();
}

function inferSeverity(message: string): TelemetryIncident["severity"] {
  const lower = message.toLowerCase();
  if (lower.includes("critical") || lower.includes("outage") || lower.includes("timeout") || lower.includes("oom") || lower.includes("500")) return "critical";
  if (lower.includes("error") || lower.includes("failed") || lower.includes("crash")) return "high";
  if (lower.includes("warn") || lower.includes("slow") || lower.includes("latency")) return "medium";
  return "low";
}
