import Link from "next/link";
import { Building2, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-zinc-100">
      <div className="glass w-full max-w-md rounded-lg p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200">
            <Radar className="size-5" />
          </div>
          <div>
            <div className="font-semibold">PulseRoot</div>
            <div className="text-xs text-zinc-500">Create reliability workspace</div>
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Start monitoring</h1>
        <p className="mt-2 text-sm text-zinc-400">Provision a simulated enterprise SRE workspace.</p>
        <div className="mt-6 space-y-3">
          <input className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 outline-none focus:border-blue-400" placeholder="Company name" />
          <input className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 outline-none focus:border-blue-400" placeholder="Work email" />
          <input className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 outline-none focus:border-blue-400" placeholder="Password" type="password" />
        </div>
        <Button asChild className="mt-5 w-full"><Link href="/api/demo-login"><Building2 className="size-4" /> Create workspace</Link></Button>
        <p className="mt-5 text-center text-sm text-zinc-500">Already have access? <Link href="/login" className="text-blue-300">Login</Link></p>
      </div>
    </main>
  );
}
