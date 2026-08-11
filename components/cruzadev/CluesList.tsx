"use client";

import type { BuiltEntry } from "@/lib/cruzadev";

type CluesListProps = {
  entries: BuiltEntry[];
  activeEntryKey: string | null;
  onSelect: (entry: BuiltEntry) => void;
};

function entryKey(e: BuiltEntry) {
  return `${e.row}-${e.col}-${e.direction}`;
}

export default function CluesList({ entries, activeEntryKey, onSelect }: CluesListProps) {
  const across = entries.filter((e) => e.direction === "across");
  const down = entries.filter((e) => e.direction === "down");

  function renderGroup(label: string, group: BuiltEntry[]) {
    return (
      <div>
        <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </h3>
        <ul className="space-y-1">
          {group.map((entry) => {
            const isActive = entryKey(entry) === activeEntryKey;
            return (
              <li key={entryKey(entry)}>
                <button
                  onClick={() => onSelect(entry)}
                  className={[
                    "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-accent/15 text-text-primary"
                      : "text-text-secondary hover:bg-bg-subtle",
                  ].join(" ")}
                >
                  <span className="mr-1.5 font-mono font-semibold text-text-muted">
                    {entry.number}.
                  </span>
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
    <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-4 px-4 sm:grid-cols-2">
      {renderGroup("Horizontais", across)}
      {renderGroup("Verticais", down)}
    </div>
  );
}
