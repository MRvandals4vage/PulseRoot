import { NextResponse, type NextRequest } from "next/server";
import { clearTelemetry, getTelemetryStore, ingestTelemetry } from "@/lib/telemetry-store";

export function GET() {
  return NextResponse.json(getTelemetryStore());
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const items = Array.isArray(body) ? body : [body];
  const events = items.map((item) => ingestTelemetry(item));
  return NextResponse.json({ ok: true, accepted: events.length, events });
}

export function DELETE() {
  clearTelemetry();
  return NextResponse.json({ ok: true });
}
