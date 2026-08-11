"use client";

import { useRef } from "react";
import type { BuiltCrossword, Direction } from "@/lib/cruzadev";

type CheckMark = "correct" | "wrong" | null;

type CruzaDevGridProps = {
  built: BuiltCrossword;
  userGrid: string[][];
  checkGrid: CheckMark[][];
  activeCell: [number, number] | null;
  activeDirection: Direction;
  activeCells: Set<string>;
  disabled?: boolean;
  onCellFocus: (r: number, c: number) => void;
  onCellChange: (r: number, c: number, value: string) => void;
  onCellBackspace: (r: number, c: number) => void;
};

export default function CruzaDevGrid({
  built,
  userGrid,
  checkGrid,
  activeCell,
  activeCells,
  disabled,
  onCellFocus,
  onCellChange,
  onCellBackspace,
}: CruzaDevGridProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: built.size }, () => Array(built.size).fill(null))
  );

  function focusCell(r: number, c: number) {
    inputRefs.current[r]?.[c]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent, r: number, c: number) {
    if (e.key === "Backspace" && !userGrid[r][c]) {
      onCellBackspace(r, c);
    }
    if (e.key === "ArrowRight") focusCell(r, c + 1);
    if (e.key === "ArrowLeft") focusCell(r, c - 1);
    if (e.key === "ArrowDown") focusCell(r + 1, c);
    if (e.key === "ArrowUp") focusCell(r - 1, c);
  }

  return (
    <div
      className="mx-auto grid gap-[3px] rounded-xl border border-border bg-bg-card p-3"
      style={{ gridTemplateColumns: `repeat(${built.size}, minmax(0, 1fr))`, maxWidth: 320 }}
    >
      {built.grid.map((row, r) =>
        row.map((cell, c) => {
          if (cell.isBlack) {
            return <div key={`${r}-${c}`} className="aspect-square rounded bg-bg" />;
          }

          const key = `${r}-${c}`;
          const isActive = activeCell?.[0] === r && activeCell?.[1] === c;
          const inActiveWord = activeCells.has(key);
          const mark = checkGrid[r][c];

          return (
            <div key={key} className="relative aspect-square">
              {cell.number !== null && (
                <span className="pointer-events-none absolute left-0.5 top-0 text-[8px] font-medium text-text-muted sm:text-[9px]">
                  {cell.number}
                </span>
              )}
              <input
                ref={(el) => {
                  if (!inputRefs.current[r]) inputRefs.current[r] = [];
                  inputRefs.current[r][c] = el;
                }}
                data-r={r}
                data-c={c}
                value={userGrid[r][c]}
                maxLength={1}
                disabled={disabled}
                onFocus={() => onCellFocus(r, c)}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(-1);
                  onCellChange(r, c, v);
                }}
                onKeyDown={(e) => handleKeyDown(e, r, c)}
                className={[
                  "h-full w-full rounded border-2 bg-transparent text-center font-mono text-sm font-bold uppercase text-text-primary outline-none transition-colors disabled:cursor-default sm:text-base",
                  mark === "correct"
                    ? "border-feedback-correct bg-feedback-correct/20 text-feedback-correct"
                    : mark === "wrong"
                    ? "border-red-500/60 bg-red-500/10 text-red-400"
                    : isActive
                    ? "border-accent"
                    : inActiveWord
                    ? "border-accent/40 bg-bg-subtle"
                    : "border-border bg-bg-subtle",
                ].join(" ")}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
