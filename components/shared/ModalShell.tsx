"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function ModalShell({ open, onClose, children }: ModalShellProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative w-full max-w-sm rounded-t-2xl border border-border bg-bg-card p-5 shadow-card sm:rounded-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-text-muted hover:bg-bg-subtle hover:text-text-primary"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
