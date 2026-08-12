"use client";

import ModalShell from "@/components/shared/ModalShell";
import ShareButton from "@/components/shared/ShareButton";
import type { BuiltEntry } from "@/lib/cruzadev";

type CruzaDevCompletionModalProps = {
  open: boolean;
  category: string;
  entries: BuiltEntry[];
  mistakes: number;
  shareText: string;
  onClose: () => void;
};

export default function CruzaDevCompletionModal({
  open,
  category,
  entries,
  mistakes,
  shareText,
  onClose,
}: CruzaDevCompletionModalProps) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="mb-3 pr-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-feedback-correct">
          Cruzadinha completa
        </p>
        <h2 className="mt-1 text-xl font-bold text-text-primary">{category}</h2>
      </div>

      <div className="mb-4 max-h-56 space-y-2 overflow-y-auto rounded-lg border border-border bg-bg-subtle p-3 scrollbar-none">
        {entries.map((entry) => (
          <div key={`${entry.row}-${entry.col}-${entry.direction}`} className="text-sm leading-relaxed">
            <span className="font-mono font-semibold text-text-primary">{entry.word}</span>
            <span className="text-text-secondary"> — {entry.clue}</span>
          </div>
        ))}
      </div>

      <p className="mb-4 text-sm text-text-muted">
        Você completou as {entries.length} palavras{" "}
        {mistakes === 0 ? "sem errar nenhuma." : `com ${mistakes} erro${mistakes === 1 ? "" : "s"}.`}
      </p>

      <ShareButton shareText={shareText} />
    </ModalShell>
  );
}
