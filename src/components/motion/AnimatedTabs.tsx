"use client";

import { LayoutGroup, motion } from "framer-motion";
import type { ReactNode } from "react";

interface Tab<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

interface AnimatedTabsProps<T extends string> {
  tabs: readonly Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  /** Unique per instance so two tab bars on one page don't share a pill. */
  groupId: string;
  className?: string;
}

/** Filter pills. The gold highlight glides between tabs (shared layout animation). */
export function AnimatedTabs<T extends string>({
  tabs,
  active,
  onChange,
  groupId,
  className,
}: AnimatedTabsProps<T>) {
  return (
    <LayoutGroup id={groupId}>
      <div className={className}>
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] transition-colors duration-300 cursor-pointer border ${
                isActive
                  ? "border-transparent text-black font-semibold"
                  : "bg-surface text-zinc-400 hover:text-white border-white/5 hover:border-white/15"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={`${groupId}-pill`}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#e5c378] to-[#aa771c] shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                />
              )}
              <span className="relative z-10">
                {tab.icon ? <span className="mr-1.5">{tab.icon}</span> : null}
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
