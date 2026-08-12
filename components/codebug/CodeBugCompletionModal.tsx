"use client";

import ModalShell from "@/components/shared/ModalShell";
import ShareButton from "@/components/shared/ShareButton";
import CreateAccountPrompt from "@/components/shared/CreateAccountPrompt";
import type { BugSnippet } from "@/lib/codebug";

type CodeBugCompletionModalProps = {
  open: boolean;
  won: boolean;
  snippet: BugSnippet;
  attemptsUsed: number;
  maxAttempts: number;
  shareText: string;
  showAccountPrompt?: boolean;
  onCreateAccount?: (name: string) => void;
  onClose: () => void;
};

export default function CodeBugCompletionModal({
  open,
  won,
  snippet,
  attemptsUsed,
  maxAttempts,
  shareText,
  showAccountPrompt,
  onCreateAccount,
  onClose,
}: CodeBugCompletionModalProps) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="mb-3 pr-6">
        <p
          className={`text-sm font-semibold uppercase tracking-wide ${
            won ? "text-feedback-correct" : "text-text-secondary"
          }`}
        >
          {won ? "Bug encontrado" : "O bug escapou"}
        </p>
        <h2 className="mt-1 text-xl font-bold text-text-primary">{snippet.title}</h2>
      </div>

      <div className="mb-4 space-y-2 rounded-lg border border-border bg-bg-subtle p-3">
        <span className="mb-1 inline-block rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-secondary">
          {snippet.category}
        </span>
        <p className="text-sm leading-relaxed text-text-secondary">{snippet.explanation}</p>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <div className="rounded bg-red-500/10 px-2 py-1 text-red-400 line-through">
            {snippet.code[snippet.buggyLine]}
          </div>
          <div className="rounded bg-feedback-correct/10 px-2 py-1 text-feedback-correct whitespace-pre-wrap">
            {snippet.fixedLine}
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-text-muted">
        {won
          ? `Você encontrou o bug em ${attemptsUsed}/${maxAttempts} tentativas.`
          : "Volte amanhã para um novo bug."}
      </p>

      <ShareButton shareText={shareText} />
      {showAccountPrompt && onCreateAccount && <CreateAccountPrompt onCreate={onCreateAccount} />}
    </ModalShell>
  );
}
