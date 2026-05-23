import { NextResponse } from "next/server";
import { generateReport } from "@/lib/pulseroot-ai";

export function GET() {
  return NextResponse.json(generateReport());
}
