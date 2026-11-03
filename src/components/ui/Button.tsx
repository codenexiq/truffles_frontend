"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className={cn(
          "inline-flex items-center justify-center font-medium tracking-[0.1em] uppercase transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          {
            // Luxury Primary Gold
            "bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] text-[#0a0a0c] font-semibold hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110":
              variant === "primary",
            // Luxury Dark Obsidian
            "bg-surface text-zinc-100 border border-white/10 hover:border-gold/40 hover:bg-surface hover:text-white":
              variant === "secondary",
            // Luxury Hairline Gold Outline
            "border border-gold/70 text-gold-light bg-transparent hover:bg-[#d4af37] hover:text-[#08080a] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]":
              variant === "outline",
            // Glassmorphic
            "bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 hover:border-gold/40":
              variant === "glass",
            // Minimal Ghost
            "text-zinc-300 hover:text-gold bg-transparent hover:bg-white/5":
              variant === "ghost",

            // Sizes
            "px-5 py-2 text-xs tracking-[0.15em]": size === "sm",
            "px-7 py-3.5 text-xs sm:text-sm tracking-[0.15em]": size === "md",
            "px-9 py-4 text-sm sm:text-base tracking-[0.2em]": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export { Button };
