"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import CruzaDevGrid from "./CruzaDevGrid";
import CluesList from "./CluesList";
import CruzaDevCompletionModal from "./CruzaDevCompletionModal";
import DailyLockScreen from "@/components/shared/DailyLockScreen";
import { useDailyLock } from "@/components/shared/useDailyLock";
import { getCruzadevPuzzle, getEntryCells, type BuiltEntry, type Direction } from "@/lib/cruzadev";

type CheckMark = "correct" | "wrong" | null;

function focusCell(r: number, c: number) {
  const el = document.querySelector<HTMLInputElement>(`input[data-r="${r}"][data-c="${c}"]`);
  el?.focus();
}

function entryKeyOf(e: { row: number; col: number; direction: Direction }) {
  return `${e.row}-${e.col}-${e.direction}`;
}

export default function CruzaDev() {
  const { status: lockStatus, result, complete } = useDailyLock("cruzadev");
  const built = useMemo(() => getCruzadevPuzzle(), []);

  const [userGrid, setUserGrid] = useState<string[][]>(() =>
    Array.from({ length: built.rows }, () => Array(built.cols).fill(""))
  );
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [activeDirection, setActiveDirection] = useState<Direction>("across");
  const [solvedEntries, setSolvedEntries] = useState<Set<string>>(new Set());
  const [mistakeEntries, setMistakeEntries] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const intentDirectionRef = useRef<Direction | null>(null);

  function entriesAt(r: number, c: number) {
    return built.entries.filter((e) => getEntryCells(e).some(([er, ec]) => er === r && ec === c));
  }

  const lockedCells = useMemo(() => {
    const cells = new Set<string>();
    built.entries.forEach((e) => {
      if (solvedEntries.has(entryKeyOf(e))) {
        getEntryCells(e).forEach(([r, c]) => cells.add(`${r}-${c}`));
      }
    });
    return cells;
  }, [built.entries, solvedEntries]);

  function computeCheckGrid(grid: string[][]): CheckMark[][] {
    return grid.map((row, r) =>
      row.map((val, c) => {
        if (built.grid[r][c].isBlack || val === "") return null;
        const cellEntries = entriesAt(r, c);
        const anyFilled = cellEntries.some((e) =>
          getEntryCells(e).every(([er, ec]) => grid[er][ec] !== "")
        );
        if (!anyFilled) return null;
        return val === built.grid[r][c].letter ? "correct" : "wrong";
      })
    );
  }

  function evaluateEntries(grid: string[][]) {
    const solved = new Set(solvedEntries);
    const mistakes = new Set(mistakeEntries);

    built.entries.forEach((entry) => {
      const key = entryKeyOf(entry);
      if (solved.has(key)) return;

      const cells = getEntryCells(entry);
      const filled = cells.every(([r, c]) => grid[r][c] !== "");
      if (!filled) return;

      const value = cells.map(([r, c]) => grid[r][c]).join("");
      if (value === entry.word) {
        solved.add(key);
      } else {
        mistakes.add(key);
      }
    });

    return { solved, mistakes };
  }

  function handleCellFocus(r: number, c: number) {
    const here = entriesAt(r, c);
    const intent = intentDirectionRef.current;
    intentDirectionRef.current = null;

    let nextDir: Direction | undefined;
    if (intent && here.some((e) => e.direction === intent)) {
      nextDir = intent;
    } else {
      const stillValid = here.some((e) => e.direction === activeDirection);
      nextDir = stillValid
        ? activeDirection
        : (here.find((e) => e.direction === "across") ?? here[0])?.direction;
    }

    setActiveCell([r, c]);
    if (nextDir) setActiveDirection(nextDir);
  }

  function nextCell(r: number, c: number, dir: Direction): [number, number] {
    return dir === "across" ? [r, c + 1] : [r + 1, c];
  }

  function prevCell(r: number, c: number, dir: Direction): [number, number] {
    return dir === "across" ? [r, c - 1] : [r - 1, c];
  }

  function isWhite(r: number, c: number) {
    return r >= 0 && r < built.rows && c >= 0 && c < built.cols && !built.grid[r][c].isBlack;
  }

  function handleCellChange(r: number, c: number, value: string) {
    if (lockedCells.has(`${r}-${c}`)) return;

    const next = userGrid.map((row) => [...row]);
    next[r][c] = value;
    setUserGrid(next);

    const { solved, mistakes } = evaluateEntries(next);
    setSolvedEntries(solved);
    setMistakeEntries(mistakes);

    if (solved.size === built.entries.length && !completed) {
      setCompleted(true);
      setTimeout(() => setShowModal(true), 500);
      complete({ won: true, shareText: buildShareText(solved.size, mistakes.size) });
    }

    if (value) {
      const [nr, nc] = nextCell(r, c, activeDirection);
      if (isWhite(nr, nc) && !lockedCells.has(`${nr}-${nc}`)) focusCell(nr, nc);
    }
  }

  function handleCellBackspace(r: number, c: number) {
    const [pr, pc] = prevCell(r, c, activeDirection);
    if (isWhite(pr, pc) && !lockedCells.has(`${pr}-${pc}`)) {
      setUserGrid((prev) => {
        const next = prev.map((row) => [...row]);
        next[pr][pc] = "";
        return next;
      });
      focusCell(pr, pc);
    }
  }

  function handleSelectEntry(entry: BuiltEntry) {
    intentDirectionRef.current = entry.direction;
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
  const activeEntryKey = activeEntry ? entryKeyOf(activeEntry) : null;
  const checkGrid = useMemo(() => computeCheckGrid(userGrid), [userGrid, solvedEntries]);

  function buildShareText(solvedCount: number, mistakeCount: number) {
    const mistakesLabel = mistakeCount === 0 ? "sem erros" : `com ${mistakeCount} erro${mistakeCount === 1 ? "" : "s"}`;
    return `Codaily — CruzaDev\n${built.category}\n${solvedCount}/${built.entries.length} palavras, ${mistakesLabel}`;
  }

  const shareText = buildShareText(solvedEntries.size, mistakeEntries.size);

  if (lockStatus === "loading") return null;
  if (lockStatus === "locked" && result) {
    return <DailyLockScreen gameName="CruzaDev" won={result.won} shareText={result.shareText} />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-6">
      <div className="mx-auto flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
        <CheckCircle2 size={13} />
        {built.category} · {solvedEntries.size}/{built.entries.length} palavras
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 lg:flex-row">
        <div className="w-full lg:w-auto lg:shrink-0">
          <CruzaDevGrid
            built={built}
            userGrid={userGrid}
            checkGrid={checkGrid}
            activeCell={activeCell}
            activeCells={activeCells}
            lockedCells={lockedCells}
            disabled={completed}
            onCellFocus={handleCellFocus}
            onCellChange={handleCellChange}
            onCellBackspace={handleCellBackspace}
          />
        </div>

        <div className="h-[420px] w-full lg:h-[560px] lg:flex-1">
          <CluesList
            entries={built.entries}
            activeEntryKey={activeEntryKey}
            solvedKeys={solvedEntries}
            onSelect={handleSelectEntry}
          />
        </div>
      </div>

      <CruzaDevCompletionModal
        open={showModal}
        category={built.category}
        entries={built.entries}
        mistakes={mistakeEntries.size}
        shareText={shareText}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
