"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const buttonVariants = cva(
  "glow-btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
  {
    variants: {
      variant: {
        default: "",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20 shadow-lg shadow-white/5",
        destructive: "bg-red-500/80 text-white hover:bg-red-500 shadow-lg shadow-red-500/20",
        ghost: "hover:bg-white/10 text-zinc-200 border-transparent bg-transparent before:hidden hover:before:hidden shadow-none",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const [isClicked, setIsClicked] = React.useState(false);

    const handleClick = (e: any) => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
      onClick?.(e);
    };

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={handleClick}
        data-state={isClicked ? "clicked" : undefined}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <span className="flex w-full items-center justify-center gap-1.5">
            {children}
            {variant !== "ghost" && variant !== "secondary" && (
              <Sparkles size={16} className="ml-0.5 opacity-80" />
            )}
          </span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
