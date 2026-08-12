"use client";

import ModalShell from "@/components/shared/ModalShell";
import ShareButton from "@/components/shared/ShareButton";
import CreateAccountPrompt from "@/components/shared/CreateAccountPrompt";
import type { CacaDevPuzzle } from "@/lib/cacadev";

type CacaDevCompletionModalProps = {
  open: boolean;
  puzzle: CacaDevPuzzle;
  elapsedSeconds: number;
  shareText: string;
  showAccountPrompt?: boolean;
  onCreateAccount?: (name: string) => void;
  onClose: () => void;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CacaDevCompletionModal({
  open,
  puzzle,
  elapsedSeconds,
  shareText,
  showAccountPrompt,
  onCreateAccount,
  onClose,
}: CacaDevCompletionModalProps) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="mb-3 pr-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-feedback-correct">
          Puzzle completo
        </p>
        <h2 className="mt-1 font-mono text-2xl font-bold text-text-primary">
          {formatTime(elapsedSeconds)}
        </h2>
      </div>

      <div className="mb-4 max-h-56 space-y-2 overflow-y-auto rounded-lg border border-border bg-bg-subtle p-3 scrollbar-none">
        <span className="mb-1 inline-block rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-secondary">
          {puzzle.category}
        </span>
        {puzzle.words.map(({ word, explanation }) => (
          <div key={word} className="text-sm leading-relaxed">
            <span className="font-mono font-semibold text-text-primary">{word}</span>
            <span className="text-text-secondary"> — {explanation}</span>
          </div>
        ))}
      </div>

      <p className="mb-4 text-sm text-text-muted">
        Você encontrou todas as {puzzle.words.length} palavras de hoje.
      </p>

      <ShareButton shareText={shareText} />
      {showAccountPrompt && onCreateAccount && <CreateAccountPrompt onCreate={onCreateAccount} />}
    </ModalShell>
  );
}
