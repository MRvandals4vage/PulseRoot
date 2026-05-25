import { NextResponse, type NextRequest } from "next/server";
import { runPulseRootAi } from "@/lib/pulseroot-ai";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const analysis = await runPulseRootAi(body);
  return NextResponse.json({ provider: process.env.GROQ_API_KEY ? "groq" : process.env.GEMINI_API_KEY ? "gemini" : "local-fallback", analysis });
}
