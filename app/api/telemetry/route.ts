import { NextResponse, type NextRequest } from "next/server";
import { clearTelemetry, getTelemetryStore, ingestTelemetry } from "@/lib/telemetry-store";
import { persistTelemetryStore, readTelemetryStore, telemetryBackend } from "@/lib/redis-telemetry";

export async function GET() {
  const store = await readTelemetryStore();
  return NextResponse.json({ ...store, backend: telemetryBackend() });
}

export async function POST(request: NextRequest) {
  await readTelemetryStore();
  const body = await request.json().catch(() => ({}));
  const items = Array.isArray(body) ? body : [body];
  const events = items.map((item) => ingestTelemetry(item));
  const persistence = await persistTelemetryStore();
  return NextResponse.json({ ok: true, accepted: events.length, events, persistence });
}

export async function DELETE() {
  clearTelemetry();
  const persistence = await persistTelemetryStore(getTelemetryStore());
  return NextResponse.json({ ok: true, persistence });
}
