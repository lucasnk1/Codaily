"use client";

import ModalShell from "@/components/shared/ModalShell";
import ShareButton from "@/components/shared/ShareButton";
import CreateAccountPrompt from "@/components/shared/CreateAccountPrompt";
import type { WordEntry } from "@/lib/words";

type CompletionModalProps = {
  open: boolean;
  won: boolean;
  words: WordEntry[];
  attemptsUsed: number;
  maxAttempts: number;
  shareText: string;
  showAccountPrompt?: boolean;
  onCreateAccount?: (name: string) => void;
  onClose: () => void;
};

export default function CompletionModal({
  open,
  won,
  words,
  attemptsUsed,
  maxAttempts,
  shareText,
  showAccountPrompt,
  onCreateAccount,
  onClose,
}: CompletionModalProps) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="mb-3 pr-6">
        <p
          className={`text-sm font-semibold uppercase tracking-wide ${
            won ? "text-feedback-correct" : "text-text-secondary"
          }`}
        >
          {won ? "Resolvido" : "Não foi dessa vez"}
        </p>
        <h2 className="mt-1 font-mono text-2xl font-bold text-text-primary">
          {words.map((w) => w.word).join(" · ")}
        </h2>
      </div>

      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto rounded-lg border border-border bg-bg-subtle p-3 scrollbar-none">
        {words.map((word) => (
          <div key={word.word}>
            <span className="mb-1 inline-block rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-secondary">
              {word.category}
            </span>
            <p className="text-sm leading-relaxed text-text-secondary">{word.explanation}</p>
          </div>
        ))}
      </div>

      <p className="mb-4 text-sm text-text-muted">
        {won
          ? `Você acertou em ${attemptsUsed}/${maxAttempts} tentativas.`
          : "Volte amanhã para um novo termo."}
      </p>

      <ShareButton shareText={shareText} />
      {showAccountPrompt && onCreateAccount && <CreateAccountPrompt onCreate={onCreateAccount} />}
    </ModalShell>
  );
}
