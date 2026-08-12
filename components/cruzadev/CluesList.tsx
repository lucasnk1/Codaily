"use client";

import { Check } from "lucide-react";
import type { BuiltEntry } from "@/lib/cruzadev";

type CluesListProps = {
  entries: BuiltEntry[];
  activeEntryKey: string | null;
  solvedKeys: Set<string>;
  onSelect: (entry: BuiltEntry) => void;
};

function entryKey(e: BuiltEntry) {
  return `${e.row}-${e.col}-${e.direction}`;
}

export default function CluesList({ entries, activeEntryKey, solvedKeys, onSelect }: CluesListProps) {
  const across = entries.filter((e) => e.direction === "across");
  const down = entries.filter((e) => e.direction === "down");

  function renderGroup(label: string, group: BuiltEntry[]) {
    return (
      <div className="min-w-0 flex-1">
        <h3 className="sticky top-0 mb-1.5 bg-bg-card py-0.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </h3>
        <ul className="space-y-0.5">
          {group.map((entry) => {
            const key = entryKey(entry);
            const isActive = key === activeEntryKey;
            const isSolved = solvedKeys.has(key);
            return (
              <li key={key}>
                <button
                  onClick={() => onSelect(entry)}
                  disabled={isSolved}
                  className={[
                    "flex w-full items-start gap-1 rounded-md px-1.5 py-1 text-left text-xs leading-snug transition-colors sm:text-[13px]",
                    isSolved
                      ? "text-feedback-correct line-through decoration-2"
                      : isActive
                      ? "bg-accent/15 text-text-primary"
                      : "text-text-secondary hover:bg-bg-subtle",
                  ].join(" ")}
                >
                  {isSolved ? (
                    <Check size={12} className="mt-0.5 shrink-0" />
                  ) : (
                    <span className="mr-1 font-mono font-semibold text-text-muted">
                      {entry.number}.
                    </span>
                  )}
                  {entry.clue}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-3 overflow-y-auto rounded-xl border border-border bg-bg-card p-3 scrollbar-none">
      {renderGroup("Horizontais", across)}
      {renderGroup("Verticais", down)}
    </div>
  );
}
