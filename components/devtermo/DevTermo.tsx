"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DevTermoGrid, { type Cell } from "./DevTermoGrid";
import Keyboard from "./Keyboard";
import CompletionModal from "./CompletionModal";
import DailyLockScreen from "@/components/shared/DailyLockScreen";
import { useDailyLock } from "@/components/shared/useDailyLock";
import { useActiveAccount } from "@/components/shared/useActiveAccount";
import { recordGameResult } from "@/lib/account";
import { getWordsOfTheDay } from "@/lib/words";
import {
  evaluateGuess,
  mergeKeyboardStatus,
  type EvaluatedLetter,
  type LetterStatus,
} from "@/lib/utils";

const WORD_LENGTH = 5;
const MODE_OPTIONS = [1, 2, 3] as const;
type WordCount = (typeof MODE_OPTIONS)[number];

type GameStatus = "playing" | "won" | "lost";

function maxAttemptsFor(wordCount: WordCount) {
  return 5 + wordCount;
}

export default function DevTermo() {
  const { status: lockStatus, result, complete } = useDailyLock("devtermo");
  const { account, create: createAccount } = useActiveAccount();
  const [wordCount, setWordCount] = useState<WordCount>(1);
  const words = useMemo(() => getWordsOfTheDay(wordCount), [wordCount]);
  const maxAttempts = maxAttemptsFor(wordCount);

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<GameStatus>("playing");
  const [solvedAt, setSolvedAt] = useState<(number | null)[]>(() => words.map(() => null));
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [keyStatuses, setKeyStatuses] = useState<Record<string, LetterStatus>>({});

  function changeMode(count: WordCount) {
    if (guesses.length > 0) return;
    setWordCount(count);
    setSolvedAt(Array.from({ length: count }, () => null));
  }

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH || status !== "playing") return;

    const guessIndex = guesses.length;
    const nextGuesses = [...guesses, currentGuess];
    setGuesses(nextGuesses);

    let mergedStatuses = keyStatuses;
    const nextSolvedAt = [...solvedAt];
    words.forEach((w, i) => {
      const evaluated = evaluateGuess(currentGuess, w.word);
      mergedStatuses = mergeKeyboardStatus(mergedStatuses, evaluated);
      if (nextSolvedAt[i] === null && currentGuess.toUpperCase() === w.word) {
        nextSolvedAt[i] = guessIndex;
      }
    });
    setKeyStatuses(mergedStatuses);
    setSolvedAt(nextSolvedAt);
    setCurrentGuess("");

    const allSolved = nextSolvedAt.every((s) => s !== null);
    const outOfAttempts = nextGuesses.length >= maxAttempts;

    if (allSolved) {
      setStatus("won");
      setTimeout(() => setShowModal(true), 900);
    } else if (outOfAttempts) {
      setStatus("lost");
      setTimeout(() => setShowModal(true), 900);
    }
  }, [currentGuess, guesses, status, words, keyStatuses, solvedAt, maxAttempts]);

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

  function boardRows(target: string, solvedIndex: number | null): Cell[][] {
    const limit = solvedIndex !== null ? solvedIndex + 1 : guesses.length;
    return guesses.slice(0, limit).map((g) => evaluateGuess(g, target));
  }

  const shareText = useMemo(() => {
    const emojiFor: Record<LetterStatus, string> = {
      correct: "🟩",
      present: "🟨",
      absent: "⬛",
      typing: "⬜",
      empty: "⬜",
    };
    const boards = words.map((w, i) => {
      const rows = boardRows(w.word, solvedAt[i]);
      return rows.map((row) => (row as EvaluatedLetter[]).map((c) => emojiFor[c.status]).join("")).join("\n");
    });
    const label = wordCount === 1 ? "DevTermo" : `DevTermo (${wordCount} palavras)`;
    return `Codaily — ${label}\n${guesses.length}/${maxAttempts}\n\n${boards.join("\n\n")}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, solvedAt, guesses, maxAttempts, wordCount]);

  useEffect(() => {
    if (status === "playing") return;
    if (account) recordGameResult("devtermo", status === "won");
    complete({ won: status === "won", shareText });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function handleCreateAccount(name: string) {
    createAccount(name);
    recordGameResult("devtermo", status === "won");
  }

  if (lockStatus === "loading") return null;
  if (lockStatus === "locked" && result) {
    return <DailyLockScreen gameName="DevTermo" won={result.won} shareText={result.shareText} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex items-center gap-1 rounded-full border border-border bg-bg-card p-1">
        {MODE_OPTIONS.map((count) => (
          <button
            key={count}
            onClick={() => changeMode(count)}
            disabled={guesses.length > 0}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed",
              count === wordCount
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary disabled:hover:text-text-secondary",
            ].join(" ")}
          >
            {count} {count === 1 ? "palavra" : "palavras"}
          </button>
        ))}
      </div>

      <div
        className={[
          "mx-auto grid w-full gap-6 py-4",
          wordCount === 1 ? "grid-cols-1" : wordCount === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3",
        ].join(" ")}
      >
        {words.map((w, i) => {
          const solvedIndex = solvedAt[i];
          const evaluatedRows = boardRows(w.word, solvedIndex);
          const showTyping = solvedIndex === null && status === "playing" && evaluatedRows.length < maxAttempts;
          const rows: Cell[][] = showTyping
            ? [
                ...evaluatedRows,
                Array.from({ length: WORD_LENGTH }, (_, ci) => ({
                  letter: currentGuess[ci] ?? "",
                  status: "empty" as LetterStatus,
                })),
              ]
            : evaluatedRows;

          return (
            <DevTermoGrid
              key={i}
              rows={rows}
              maxAttempts={maxAttempts}
              wordLength={WORD_LENGTH}
              currentRow={evaluatedRows.length}
              shakeRow={shakeRow}
            />
          );
        })}
      </div>

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
        words={words}
        attemptsUsed={guesses.length}
        maxAttempts={maxAttempts}
        shareText={shareText}
        showAccountPrompt={!account}
        onCreateAccount={handleCreateAccount}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
