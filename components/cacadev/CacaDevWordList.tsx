"use client";

import { Check } from "lucide-react";

type CacaDevWordListProps = {
  words: string[];
  foundWords: Set<string>;
};

export default function CacaDevWordList({ words, foundWords }: CacaDevWordListProps) {
  return (
    <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2 py-4">
      {words.map((word) => {
        const found = foundWords.has(word);
        return (
          <span
            key={word}
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-medium uppercase transition-colors",
              found
                ? "border-feedback-correct/40 bg-feedback-correct/10 text-feedback-correct line-through decoration-2"
                : "border-border bg-bg-card text-text-secondary",
            ].join(" ")}
          >
            {found && <Check size={12} />}
            {word}
          </span>
        );
      })}
    </div>
  );
}
