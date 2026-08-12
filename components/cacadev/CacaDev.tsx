"use client";

import { useEffect, useMemo, useState } from "react";
import { Timer } from "lucide-react";
import CacaDevBoard from "./CacaDevBoard";
import CacaDevWordList from "./CacaDevWordList";
import CacaDevCompletionModal from "./CacaDevCompletionModal";
import DailyLockScreen from "@/components/shared/DailyLockScreen";
import { useDailyLock } from "@/components/shared/useDailyLock";
import { useGameRecorder } from "@/components/shared/useGameRecorder";
import { recordGameResult } from "@/lib/account";
import { generateBoard, getPuzzleOfTheDay } from "@/lib/cacadev";

const BOARD_SIZE = 13;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CacaDev() {
  const { status: lockStatus, result, complete } = useDailyLock("cacadev");
  const { hasIdentity, record, createLocalAccount } = useGameRecorder("cacadev");
  const puzzle = useMemo(() => getPuzzleOfTheDay(), []);
  const board = useMemo(() => generateBoard(puzzle, BOARD_SIZE), [puzzle]);

  const allWords = useMemo(() => puzzle.words.map((w) => w.word), [puzzle]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const remainingWords = allWords.filter((w) => !foundWords.has(w));

  useEffect(() => {
    if (completed || lockStatus !== "unlocked") return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [completed, lockStatus]);

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
      record(true);
      complete({ won: true, shareText: buildShareText() });
    }
  }

  function buildShareText() {
    return `Codaily — Caça-Dev\n${puzzle.category}\n${allWords.length}/${allWords.length} palavras em ${formatTime(
      elapsed
    )}`;
  }

  const shareText = buildShareText();

  function handleCreateAccount(name: string) {
    createLocalAccount(name);
    recordGameResult("cacadev", true);
  }

  if (lockStatus === "loading") return null;
  if (lockStatus === "locked" && result) {
    return <DailyLockScreen gameName="Caça-Dev" won={result.won} shareText={result.shareText} />;
  }

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
        showAccountPrompt={!hasIdentity}
        onCreateAccount={handleCreateAccount}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
