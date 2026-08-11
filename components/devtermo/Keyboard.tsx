"use client";

import { Delete, CornerDownLeft } from "lucide-react";
import type { LetterStatus } from "@/lib/utils";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const STATUS_CLASSES: Record<LetterStatus, string> = {
  correct: "bg-feedback-correct text-white",
  present: "bg-feedback-present text-white",
  absent: "bg-feedback-absent/80 text-text-muted",
  typing: "bg-bg-card text-text-primary",
  empty: "bg-bg-card text-text-primary",
};

type KeyboardProps = {
  statuses: Record<string, LetterStatus>;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
};

export default function Keyboard({ statuses, onKeyPress, disabled }: KeyboardProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-1.5 px-2 pb-6 select-none">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const isSpecial = key === "ENTER" || key === "BACKSPACE";
            const status = statuses[key] ?? "empty";
            return (
              <button
                key={key}
                disabled={disabled}
                onClick={() => onKeyPress(key)}
                className={[
                  "flex h-11 items-center justify-center rounded-md text-xs font-semibold uppercase transition-colors active:scale-95 sm:text-sm",
                  isSpecial ? "min-w-[52px] px-2" : "w-8 sm:w-9",
                  STATUS_CLASSES[status],
                  "hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
              >
                {key === "BACKSPACE" ? (
                  <Delete size={16} />
                ) : key === "ENTER" ? (
                  <CornerDownLeft size={16} />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
