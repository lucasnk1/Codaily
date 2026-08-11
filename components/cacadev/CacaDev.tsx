"use client";

import { useEffect, useMemo, useState } from "react";
import { Timer } from "lucide-react";
import CacaDevBoard from "./CacaDevBoard";
import CacaDevWordList from "./CacaDevWordList";
import CacaDevCompletionModal from "./CacaDevCompletionModal";
import { generateBoard, getPuzzleOfTheDay } from "@/lib/cacadev";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CacaDev({ onGameEnd }: { onGameEnd?: (won: boolean) => void }) {
  const puzzle = useMemo(() => getPuzzleOfTheDay(), []);
  const board = useMemo(() => generateBoard(puzzle), [puzzle]);

  const allWords = useMemo(() => puzzle.words.map((w) => w.word), [puzzle]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const remainingWords = allWords.filter((w) => !foundWords.has(w));

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [completed]);

  function handleWordFound(word: string) {
    setFoundWords((prev) => {
      const next = new Set(prev);
      next.add(word);
      return next;
    });

    const placement = board.placements.find((p) => p.word === word);
    if (placement) {
      setFoundCells((prev) => {
        const next = new Set(prev);
        placement.cells.forEach(([r, c]) => next.add(`${r}-${c}`));
        return next;
      });
    }

    if (foundWords.size + 1 === allWords.length) {
      setCompleted(true);
      setTimeout(() => setShowModal(true), 500);
      onGameEnd?.(true);
    }
  }

  const shareText = `Codaily — Caça-Dev\n${puzzle.category}\n${allWords.length}/${allWords.length} palavras em ${formatTime(
    elapsed
  )}`;

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="mt-2 flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-sm font-mono text-text-secondary">
        <Timer size={14} />
        {formatTime(elapsed)}
      </div>

      <CacaDevWordList words={allWords} foundWords={foundWords} />

      <CacaDevBoard
        board={board}
        remainingWords={remainingWords}
        foundCells={foundCells}
        onWordFound={handleWordFound}
      />

      <CacaDevCompletionModal
        open={showModal}
        puzzle={puzzle}
        elapsedSeconds={elapsed}
        shareText={shareText}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
