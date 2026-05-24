import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wider transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-500/10 text-blue-300 border-blue-400/20",
        secondary:
          "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10",
        destructive:
          "border-red-500/20 bg-red-500/10 text-red-300",
        warning:
          "border-orange-500/20 bg-orange-500/10 text-orange-300",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        outline: "text-zinc-300 border-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
