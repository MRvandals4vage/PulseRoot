import { NextResponse, type NextRequest } from "next/server";
import { runPulseRootAi } from "@/lib/pulseroot-ai";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const analysis = await runPulseRootAi({ prompt: body.message || "Explain the incident and provide remediation commands." });
  return NextResponse.json({
    answer: `${analysis.summary}\n\nRecommended commands:\n${analysis.commands?.map((cmd: string) => `- ${cmd}`).join("\n")}`,
    analysis,
  });
}
