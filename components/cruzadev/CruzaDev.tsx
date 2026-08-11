"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import CruzaDevGrid from "./CruzaDevGrid";
import CluesList from "./CluesList";
import CruzaDevCompletionModal from "./CruzaDevCompletionModal";
import {
  buildCrossword,
  getCruzadevPuzzle,
  getEntryCells,
  type BuiltEntry,
  type Direction,
} from "@/lib/cruzadev";

type CheckMark = "correct" | "wrong" | null;

function focusCell(r: number, c: number) {
  const el = document.querySelector<HTMLInputElement>(`input[data-r="${r}"][data-c="${c}"]`);
  el?.focus();
}

export default function CruzaDev({ onGameEnd }: { onGameEnd?: (won: boolean) => void }) {
  const puzzle = useMemo(() => getCruzadevPuzzle(), []);
  const built = useMemo(() => buildCrossword(puzzle), [puzzle]);

  const [userGrid, setUserGrid] = useState<string[][]>(() =>
    Array.from({ length: built.size }, () => Array(built.size).fill(""))
  );
  const [checkGrid, setCheckGrid] = useState<CheckMark[][]>(() =>
    Array.from({ length: built.size }, () => Array(built.size).fill(null))
  );
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [activeDirection, setActiveDirection] = useState<Direction>("across");
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const wasFullRef = useRef(false);

  function entriesAt(r: number, c: number) {
    return built.entries.filter((e) =>
      getEntryCells(e).some(([er, ec]) => er === r && ec === c)
    );
  }

  function handleCellFocus(r: number, c: number) {
    const here = entriesAt(r, c);
    const preferred = here.find((e) => e.direction === "across") ?? here[0];
    setActiveCell([r, c]);
    if (preferred) setActiveDirection(preferred.direction);
  }

  function nextCell(r: number, c: number, dir: Direction): [number, number] {
    return dir === "across" ? [r, c + 1] : [r + 1, c];
  }

  function prevCell(r: number, c: number, dir: Direction): [number, number] {
    return dir === "across" ? [r, c - 1] : [r - 1, c];
  }

  function isWhite(r: number, c: number) {
    return r >= 0 && r < built.size && c >= 0 && c < built.size && !built.grid[r][c].isBlack;
  }

  function computeMarks(grid: string[][]): CheckMark[][] {
    return grid.map((row, r) =>
      row.map((val, c) => {
        if (built.grid[r][c].isBlack || val === "") return null;
        return val === built.grid[r][c].letter ? "correct" : "wrong";
      })
    );
  }

  function handleCellChange(r: number, c: number, value: string) {
    const next = userGrid.map((row) => [...row]);
    next[r][c] = value;
    setUserGrid(next);

    const allFilled = built.grid.every((row, ri) =>
      row.every((cell, ci) => cell.isBlack || next[ri][ci] !== "")
    );

    if (allFilled) {
      const nextCheck = computeMarks(next);
      setCheckGrid(nextCheck);

      if (!wasFullRef.current) {
        wasFullRef.current = true;
        setAttempts((a) => a + 1);
      }

      const allCorrect = nextCheck.every((row) => row.every((mark) => mark !== "wrong"));
      if (allCorrect && !completed) {
        setCompleted(true);
        setTimeout(() => setShowModal(true), 500);
        onGameEnd?.(true);
      }
    } else {
      wasFullRef.current = false;
      setCheckGrid((prev) => {
        const nextCheck = prev.map((row) => [...row]);
        nextCheck[r][c] = null;
        return nextCheck;
      });
    }

    if (value) {
      const [nr, nc] = nextCell(r, c, activeDirection);
      if (isWhite(nr, nc)) focusCell(nr, nc);
    }
  }

  function handleCellBackspace(r: number, c: number) {
    const [pr, pc] = prevCell(r, c, activeDirection);
    if (isWhite(pr, pc)) {
      wasFullRef.current = false;
      setUserGrid((prev) => {
        const next = prev.map((row) => [...row]);
        next[pr][pc] = "";
        return next;
      });
      focusCell(pr, pc);
    }
  }

  function handleSelectEntry(entry: BuiltEntry) {
    setActiveDirection(entry.direction);
    setActiveCell([entry.row, entry.col]);
    focusCell(entry.row, entry.col);
  }

  const activeEntry = activeCell
    ? built.entries.find(
        (e) =>
          e.direction === activeDirection &&
          getEntryCells(e).some(([r, c]) => r === activeCell[0] && c === activeCell[1])
      )
    : undefined;

  const activeCells = new Set(
    activeEntry ? getEntryCells(activeEntry).map(([r, c]) => `${r}-${c}`) : []
  );
  const activeEntryKey = activeEntry ? `${activeEntry.row}-${activeEntry.col}-${activeEntry.direction}` : null;

  const shareText = `Codaily — CruzaDev\n${puzzle.category}\nCompletada em ${attempts} ${
    attempts === 1 ? "verificação" : "verificações"
  }`;

  return (
    <div className="flex flex-1 flex-col items-center gap-4 py-6">
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
        <CheckCircle2 size={13} />
        {puzzle.category}
      </div>

      <CruzaDevGrid
        built={built}
        userGrid={userGrid}
        checkGrid={checkGrid}
        activeCell={activeCell}
        activeDirection={activeDirection}
        activeCells={activeCells}
        disabled={completed}
        onCellFocus={handleCellFocus}
        onCellChange={handleCellChange}
        onCellBackspace={handleCellBackspace}
      />

      <CluesList entries={built.entries} activeEntryKey={activeEntryKey} onSelect={handleSelectEntry} />

      <CruzaDevCompletionModal
        open={showModal}
        category={puzzle.category}
        entries={built.entries}
        attempts={attempts}
        shareText={shareText}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
