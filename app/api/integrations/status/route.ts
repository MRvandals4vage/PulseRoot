import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    upstashRedis: {
      configured: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
      mode: "persistent telemetry cache",
    },
    supabase: {
      configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
      mode: "ready for database/auth integration",
    },
  });
}
