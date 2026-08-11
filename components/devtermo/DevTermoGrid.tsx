"use client";

import { motion } from "framer-motion";
import type { LetterStatus } from "@/lib/utils";

export type Cell = {
  letter: string;
  status: LetterStatus;
};

type DevTermoGridProps = {
  rows: Cell[][];
  maxAttempts: number;
  wordLength: number;
  currentRow: number;
  shakeRow: number | null;
};

const STATUS_CLASSES: Record<LetterStatus, string> = {
  correct: "bg-feedback-correct border-feedback-correct text-white",
  present: "bg-feedback-present border-feedback-present text-white",
  absent: "bg-feedback-absent border-feedback-absent text-text-secondary",
  typing: "border-border bg-transparent text-text-primary",
  empty: "border-border bg-transparent text-text-primary",
};

export default function DevTermoGrid({
  rows,
  maxAttempts,
  wordLength,
  currentRow,
  shakeRow,
}: DevTermoGridProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-6">
      {Array.from({ length: maxAttempts }).map((_, rowIdx) => {
        const row =
          rows[rowIdx] ??
          Array.from({ length: wordLength }, () => ({ letter: "", status: "empty" as LetterStatus }));
        const isShaking = shakeRow === rowIdx;

        return (
          <motion.div
            key={rowIdx}
            animate={isShaking ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex gap-1.5"
          >
            {row.map((cell, colIdx) => {
              const isRevealed = rowIdx < currentRow || (rowIdx === currentRow && false);
              const hasLetter = cell.letter !== "";
              const flipDelay = colIdx * 0.12;

              return (
                <div key={colIdx} className="perspective">
                  <motion.div
                    initial={false}
                    animate={
                      isRevealed && cell.status !== "empty" && cell.status !== "typing"
                        ? { rotateX: [0, 90, 0] }
                        : { rotateX: 0 }
                    }
                    transition={{ duration: 0.5, delay: isRevealed ? flipDelay : 0 }}
                    className={[
                      "flex h-12 w-12 select-none items-center justify-center rounded-md border-2 font-mono text-xl font-bold uppercase transition-colors sm:h-14 sm:w-14",
                      STATUS_CLASSES[cell.status],
                      hasLetter && cell.status === "empty" ? "border-text-muted" : "",
                    ].join(" ")}
                  >
                    {cell.letter}
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
}
