import Link from "next/link";
import { Radar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-zinc-100">
      <div className="glass w-full max-w-md rounded-lg p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200">
            <Radar className="size-5" />
          </div>
          <div>
            <div className="font-semibold">PulseRoot</div>
            <div className="text-xs text-zinc-500">Secure workspace login</div>
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-400">Sign in to your incident intelligence workspace.</p>
        <div className="mt-6 space-y-3">
          <input className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 outline-none focus:border-blue-400" placeholder="you@company.com" />
          <input className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 outline-none focus:border-blue-400" placeholder="Password" type="password" />
        </div>
        <Button asChild className="mt-5 w-full"><Link href="/api/demo-login">Login</Link></Button>
        <Button asChild variant="secondary" className="mt-3 w-full"><Link href="/api/demo-login">Demo login</Link></Button>
        <p className="mt-5 text-center text-sm text-zinc-500">No workspace? <Link href="/signup" className="text-blue-300">Create one</Link></p>
      </div>
    </main>
  );
}
