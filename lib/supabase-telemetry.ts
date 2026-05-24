import postgres from "postgres";
import { replaceTelemetryStore, type Store, type TelemetryEvent, type TelemetryIncident, type TelemetryMetric, type TelemetryService } from "@/lib/telemetry-store";

const globalSql = globalThis as typeof globalThis & { __pulserootSql?: postgres.Sql; __pulserootSchemaReady?: Promise<void> };

function databaseUrl() {
  if (process.env.SUPABASE_DATABASE_URL) return process.env.SUPABASE_DATABASE_URL;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const password = process.env.SUPABASE_DATABASE_PASSWORD;
  if (!url || !password) return null;
  const ref = new URL(url).hostname.split(".")[0];
  return `postgres://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres?sslmode=require`;
}

function sql() {
  const url = databaseUrl();
  if (!url) return null;
  if (!globalSql.__pulserootSql) {
    globalSql.__pulserootSql = postgres(url, {
      ssl: "require",
      max: 3,
      idle_timeout: 20,
      connect_timeout: 15,
      prepare: false,
    });
  }
  return globalSql.__pulserootSql;
}

export function supabaseConfigured() {
  return Boolean(databaseUrl());
}

async function ensureSchema() {
  const db = sql();
  if (!db) return false;
  if (!globalSql.__pulserootSchemaReady) {
    globalSql.__pulserootSchemaReady = (async () => {
      await db`
        create table if not exists pulseroot_events (
          id uuid primary key,
          source text not null,
          service text not null,
          message text not null,
          severity text not null,
          status text,
          metric jsonb,
          raw jsonb,
          created_at timestamptz not null default now()
        )
      `;
      await db`create index if not exists pulseroot_events_created_at_idx on pulseroot_events (created_at desc)`;
      await db`create index if not exists pulseroot_events_service_idx on pulseroot_events (service)`;
      await db`
        create table if not exists pulseroot_services (
          name text primary key,
          status text not null,
          updated_at timestamptz not null default now()
        )
      `;
    })();
  }
  await globalSql.__pulserootSchemaReady;
  return true;
}

export async function readSupabaseTelemetry(): Promise<Store | null> {
  const db = sql();
  if (!db) return null;
  await ensureSchema();

  const [events, services] = await Promise.all([
    db`
      select id, source, service, message, severity, status, metric, raw, created_at
      from pulseroot_events
      order by created_at desc
      limit 250
    `,
    db`select name, status from pulseroot_services order by updated_at desc limit 100`,
  ]);

  const typedEvents: TelemetryEvent[] = events.map((row) => ({
    id: row.id,
    source: row.source,
    service: row.service,
    message: row.message,
    severity: row.severity,
    timestamp: row.created_at.toISOString(),
    raw: row.raw,
  }));

  const metrics: TelemetryMetric[] = events
    .filter((row) => row.metric)
    .slice(0, 120)
    .reverse()
    .map((row) => ({
      time: row.created_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      cpu: numberOrUndefined(row.metric?.cpu),
      memory: numberOrUndefined(row.metric?.memory),
      latency: numberOrUndefined(row.metric?.latency),
      errors: numberOrUndefined(row.metric?.errors),
      db: numberOrUndefined(row.metric?.db),
      traffic: numberOrUndefined(row.metric?.traffic),
    }));

  const incidents: TelemetryIncident[] = events
    .filter((row) => row.severity === "critical" || row.severity === "high")
    .slice(0, 100)
    .map((row) => ({
      id: row.id,
      severity: row.severity,
      time: row.created_at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      service: row.service,
      title: row.message,
      confidence: 72,
    }));

  const store: Store = {
    metrics,
    incidents,
    services: services.map((row) => ({ name: row.name, status: row.status })) as TelemetryService[],
    events: typedEvents,
    logs: typedEvents.filter((event) => event.source === "log").map((event) => `[${event.service}] ${(event.severity || "low").toUpperCase()} ${event.message}`),
    deployments: typedEvents.filter((event) => event.source === "deployment"),
    kubernetes: typedEvents.filter((event) => event.source === "kubernetes"),
  };

  return replaceTelemetryStore(store);
}

export async function persistSupabaseEvents(events: TelemetryEvent[]) {
  const db = sql();
  if (!db) return { persisted: false, backend: "supabase-unconfigured" };
  await ensureSchema();

  if (!events.length) return { persisted: true, backend: "supabase-postgres" };

  await db.begin(async (tx) => {
    for (const event of events) {
      const raw = event.raw && typeof event.raw === "object" ? event.raw as Record<string, unknown> : {};
      const metric = "metric" in raw ? raw.metric : "metrics" in raw ? raw.metrics : null;
      const status = typeof raw.status === "string" ? raw.status : null;
      await tx`
        insert into pulseroot_events (id, source, service, message, severity, status, metric, raw, created_at)
        values (${event.id}, ${event.source}, ${event.service}, ${event.message}, ${event.severity || "low"}, ${status}, ${metric ? JSON.stringify(metric) : null}, ${JSON.stringify(raw)}, ${event.timestamp})
        on conflict (id) do nothing
      `;
      if (status) {
        await tx`
          insert into pulseroot_services (name, status, updated_at)
          values (${event.service}, ${status}, now())
          on conflict (name) do update set status = excluded.status, updated_at = excluded.updated_at
        `;
      }
    }
  });

  return { persisted: true, backend: "supabase-postgres" };
}

export async function clearSupabaseTelemetry() {
  const db = sql();
  if (!db) return { persisted: false, backend: "supabase-unconfigured" };
  await ensureSchema();
  await db.begin(async (tx) => {
    await tx`truncate table pulseroot_events`;
    await tx`truncate table pulseroot_services`;
  });
  return { persisted: true, backend: "supabase-postgres" };
}

function numberOrUndefined(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
