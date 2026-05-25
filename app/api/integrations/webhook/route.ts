import { NextResponse, type NextRequest } from "next/server";
import { ingestTelemetry } from "@/lib/telemetry-store";
import { persistTelemetryStore, readTelemetryStore } from "@/lib/redis-telemetry";
import { persistSupabaseEvents, readSupabaseTelemetry, supabaseConfigured } from "@/lib/supabase-telemetry";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  await (supabaseConfigured() ? readSupabaseTelemetry() : readTelemetryStore());
  const body = await request.json().catch(() => ({}));
  const provider = request.nextUrl.searchParams.get("provider") || body.provider || "custom";
  const event = ingestTelemetry({
    source: normalizeSource(provider, body),
    service: body.service || body.service_name || body.app || body.alert?.service || provider,
    message: body.message || body.title || body.alert?.summary || body.event || "External telemetry webhook received",
    severity: body.severity || body.priority,
    status: body.status,
    metric: body.metric || body.metrics,
    raw: body,
  });
  const durable = await persistSupabaseEvents([event]);
  const refreshed = await readSupabaseTelemetry();
  const cache = await persistTelemetryStore(refreshed || undefined);
  const persistence = { durable, cache };
  return NextResponse.json({ ok: true, provider, event, persistence });
}

function normalizeSource(provider: string, body: Record<string, unknown>) {
  const value = `${provider} ${body.source || ""}`.toLowerCase();
  if (value.includes("kube")) return "kubernetes";
  if (value.includes("deploy") || value.includes("github")) return "deployment";
  if (value.includes("metric") || value.includes("datadog") || value.includes("grafana")) return "metric";
  if (value.includes("trace")) return "trace";
  if (value.includes("api")) return "api";
  return "log";
}
