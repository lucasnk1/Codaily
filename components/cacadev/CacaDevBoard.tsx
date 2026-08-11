"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CacaDevBoard as Board } from "@/lib/cacadev";
import { getPathCells, isStraightLine } from "@/lib/cacadev";

type CacaDevBoardProps = {
  board: Board;
  remainingWords: string[];
  foundCells: Set<string>;
  onWordFound: (word: string) => void;
};

const key = (r: number, c: number) => `${r}-${c}`;

export default function CacaDevBoard({
  board,
  remainingWords,
  foundCells,
  onWordFound,
}: CacaDevBoardProps) {
  const [start, setStart] = useState<[number, number] | null>(null);
  const [activePath, setActivePath] = useState<[number, number][]>([]);
  const [invalidFlash, setInvalidFlash] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const isSelecting = useRef(false);

  const cellFromPoint = useCallback((x: number, y: number): [number, number] | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const cell = el?.closest("[data-row]") as HTMLElement | null;
    if (!cell) return null;
    return [Number(cell.dataset.row), Number(cell.dataset.col)];
  }, []);

  function handlePointerDown(r: number, c: number) {
    isSelecting.current = true;
    setStart([r, c]);
    setActivePath([[r, c]]);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isSelecting.current || !start) return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    if (!isStraightLine(start, cell)) return;
    setActivePath(getPathCells(start, cell));
  }

  function finishSelection() {
    if (!isSelecting.current) return;
    isSelecting.current = false;

    if (activePath.length > 1) {
      const forward = activePath.map(([r, c]) => board.grid[r][c]).join("");
      const backward = forward.split("").reverse().join("");

      const match = remainingWords.find((w) => w === forward || w === backward);
      if (match) {
        onWordFound(match);
      } else {
        setInvalidFlash(activePath.map(([r, c]) => key(r, c)));
        setTimeout(() => setInvalidFlash([]), 300);
      }
    }

    setStart(null);
    setActivePath([]);
  }

  const activeSet = new Set(activePath.map(([r, c]) => key(r, c)));
  const invalidSet = new Set(invalidFlash);

  return (
    <div
      ref={gridRef}
      onPointerMove={handlePointerMove}
      onPointerUp={finishSelection}
      onPointerLeave={() => {
        if (isSelecting.current) finishSelection();
      }}
      className="mx-auto grid touch-none select-none gap-[3px] rounded-xl border border-border bg-bg-card p-3"
      style={{
        gridTemplateColumns: `repeat(${board.size}, minmax(0, 1fr))`,
        maxWidth: 420,
      }}
    >
      {board.grid.map((row, r) =>
        row.map((letter, c) => {
          const k = key(r, c);
          const isFound = foundCells.has(k);
          const isActive = activeSet.has(k);
          const isInvalid = invalidSet.has(k);

          return (
            <motion.button
              key={k}
              data-row={r}
              data-col={c}
              onPointerDown={() => handlePointerDown(r, c)}
              animate={isInvalid ? { x: [0, -3, 3, 0] } : {}}
              transition={{ duration: 0.2 }}
              className={[
                "flex aspect-square items-center justify-center rounded font-mono text-[11px] font-semibold uppercase transition-colors sm:text-sm",
                isFound
                  ? "bg-feedback-correct text-white"
                  : isActive
                  ? "bg-accent text-white"
                  : isInvalid
                  ? "bg-red-500/40 text-white"
                  : "bg-bg-subtle text-text-secondary hover:bg-bg-subtle/70",
              ].join(" ")}
            >
              {letter}
            </motion.button>
          );
        })
      )}
    </div>
  );
}
