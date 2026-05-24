import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    upstashRedis: {
      configured: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
      mode: "persistent telemetry cache",
    },
    supabase: {
      configured: Boolean((process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DATABASE_PASSWORD) && process.env.NEXT_PUBLIC_SUPABASE_URL),
      mode: "durable Postgres telemetry store",
    },
  });
}
