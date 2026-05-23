import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseRoot | AI Incident Root Cause Analyzer",
  description: "AI-powered SRE platform for realtime incident intelligence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
