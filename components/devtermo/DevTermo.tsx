"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DevTermoGrid, { type Cell } from "./DevTermoGrid";
import Keyboard from "./Keyboard";
import CompletionModal from "./CompletionModal";
import { getWordOfTheDay } from "@/lib/words";
import {
  buildShareGrid,
  evaluateGuess,
  mergeKeyboardStatus,
  type EvaluatedLetter,
  type LetterStatus,
} from "@/lib/utils";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

type GameStatus = "playing" | "won" | "lost";

export default function DevTermo({ onGameEnd }: { onGameEnd?: (won: boolean) => void }) {
  const wordEntry = useMemo(() => getWordOfTheDay(), []);
  const target = wordEntry.word;

  const [guesses, setGuesses] = useState<EvaluatedLetter[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<GameStatus>("playing");
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [keyStatuses, setKeyStatuses] = useState<Record<string, LetterStatus>>({});

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH || status !== "playing") return;

    const evaluated = evaluateGuess(currentGuess, target);
    const nextGuesses = [...guesses, evaluated];
    setGuesses(nextGuesses);
    setKeyStatuses((prev) => mergeKeyboardStatus(prev, evaluated));
    setCurrentGuess("");

    const isWin = currentGuess.toUpperCase() === target;
    const isLastAttempt = nextGuesses.length === MAX_ATTEMPTS;

    if (isWin) {
      setStatus("won");
      setTimeout(() => setShowModal(true), 900);
      onGameEnd?.(true);
    } else if (isLastAttempt) {
      setStatus("lost");
      setTimeout(() => setShowModal(true), 900);
      onGameEnd?.(false);
    }
  }, [currentGuess, guesses, status, target, onGameEnd]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (status !== "playing") return;

      if (key === "ENTER") {
        if (currentGuess.length !== WORD_LENGTH) {
          setShakeRow(guesses.length);
          setTimeout(() => setShakeRow(null), 400);
          return;
        }
        submitGuess();
        return;
      }

      if (key === "BACKSPACE") {
        setCurrentGuess((g) => g.slice(0, -1));
        return;
      }

      if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((g) => g + key);
      }
    },
    [currentGuess, guesses.length, status, submitGuess]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") return handleKeyPress("ENTER");
      if (e.key === "Backspace") return handleKeyPress("BACKSPACE");
      if (/^[a-zA-Z]$/.test(e.key)) return handleKeyPress(e.key.toUpperCase());
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyPress]);

  const rows: Cell[][] = useMemo(() => {
    const completed: Cell[][] = guesses.map((row) => row);
    if (status === "playing" && completed.length < MAX_ATTEMPTS) {
      const typingRow: Cell[] = Array.from({ length: WORD_LENGTH }, (_, i) => ({
        letter: currentGuess[i] ?? "",
        status: "empty" as LetterStatus,
      }));
      return [...completed, typingRow];
    }
    return completed;
  }, [guesses, currentGuess, status]);

  const shareText = useMemo(
    () => buildShareGrid(guesses, guesses.length, MAX_ATTEMPTS),
    [guesses]
  );

  return (
    <div className="flex flex-1 flex-col">
      <DevTermoGrid
        rows={rows}
        maxAttempts={MAX_ATTEMPTS}
        wordLength={WORD_LENGTH}
        currentRow={guesses.length}
        shakeRow={shakeRow}
      />

      <div className="mt-auto">
        <Keyboard
          statuses={keyStatuses}
          onKeyPress={handleKeyPress}
          disabled={status !== "playing"}
        />
      </div>

      <CompletionModal
        open={showModal}
        won={status === "won"}
        word={wordEntry}
        attemptsUsed={guesses.length}
        maxAttempts={MAX_ATTEMPTS}
        shareText={shareText}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
