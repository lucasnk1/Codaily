"use client";

import { Settings, HelpCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

type HeaderProps = {
  streak: number;
  onOpenHelp?: () => void;
  onOpenSettings?: () => void;
};

export default function Header({ streak, onOpenHelp, onOpenSettings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-semibold tracking-tight text-text-primary">
            <span className="text-accent">{"</>"}</span> Codaily
          </span>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            key={streak}
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-1 rounded-full border border-border bg-bg-card px-2.5 py-1 text-sm font-medium text-text-primary"
          >
            <Zap size={14} className="fill-amber-400 text-amber-400" strokeWidth={0} />
            <span>{streak}</span>
          </motion.div>

          <button
            onClick={onOpenHelp}
            aria-label="Ajuda"
            className="rounded-full p-1.5 text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
          >
            <HelpCircle size={18} />
          </button>
          <button
            onClick={onOpenSettings}
            aria-label="Configurações"
            className="rounded-full p-1.5 text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
