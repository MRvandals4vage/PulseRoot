import { NextResponse, type NextRequest } from "next/server";
import { clearTelemetry, getTelemetryStore, ingestTelemetry } from "@/lib/telemetry-store";
import { persistTelemetryStore, readTelemetryStore, telemetryBackend } from "@/lib/redis-telemetry";
import { clearSupabaseTelemetry, persistSupabaseEvents, readSupabaseTelemetry, supabaseConfigured } from "@/lib/supabase-telemetry";

export const dynamic = 'force-dynamic';

export async function GET() {
  const durableStore = await readSupabaseTelemetry();
  const store = durableStore || await readTelemetryStore();
  if (durableStore) await persistTelemetryStore(durableStore);
  return NextResponse.json({ ...store, backend: durableStore ? "supabase-postgres+upstash-cache" : telemetryBackend() });
}

export async function POST(request: NextRequest) {
  await (supabaseConfigured() ? readSupabaseTelemetry() : readTelemetryStore());
  const body = await request.json().catch(() => ({}));
  const items = Array.isArray(body) ? body : [body];
  const events = items.map((item) => ingestTelemetry(item));
  const durable = await persistSupabaseEvents(events);
  const refreshed = await readSupabaseTelemetry();
  const cache = await persistTelemetryStore(refreshed || getTelemetryStore());
  return NextResponse.json({ ok: true, accepted: events.length, events, persistence: { durable, cache } });
}

export async function DELETE() {
  clearTelemetry();
  const durable = await clearSupabaseTelemetry();
  const cache = await persistTelemetryStore(getTelemetryStore());
  const persistence = { durable, cache };
  return NextResponse.json({ ok: true, persistence });
}
