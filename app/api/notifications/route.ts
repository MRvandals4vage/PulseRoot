import { NextResponse, type NextRequest } from "next/server";
import { sendNotification } from "@/lib/pulseroot-ai";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json(sendNotification(body.channel || "Slack"));
}
