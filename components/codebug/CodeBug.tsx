"use client";

import { useMemo, useState } from "react";
import CodeBlock from "./CodeBlock";
import AttemptsIndicator from "./AttemptsIndicator";
import CodeBugCompletionModal from "./CodeBugCompletionModal";
import DailyLockScreen from "@/components/shared/DailyLockScreen";
import { useDailyLock } from "@/components/shared/useDailyLock";
import { useActiveAccount } from "@/components/shared/useActiveAccount";
import { recordGameResult } from "@/lib/account";
import { getSnippetOfTheDay } from "@/lib/codebug";
import { buildShareGrid, type EvaluatedLetter } from "@/lib/utils";

const MAX_ATTEMPTS = 3;

type GameStatus = "playing" | "won" | "lost";

export default function CodeBug() {
  const { status: lockStatus, result, complete } = useDailyLock("codebug");
  const { account, create: createAccount } = useActiveAccount();
  const snippet = useMemo(() => getSnippetOfTheDay(), []);
  const [wrongLines, setWrongLines] = useState<number[]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [showModal, setShowModal] = useState(false);

  const attemptsUsed = status === "won" ? wrongLines.length + 1 : wrongLines.length;

  const rows: EvaluatedLetter[][] = useMemo(() => {
    const wrongRows: EvaluatedLetter[][] = wrongLines.map(() => [
      { letter: "", status: "absent" },
    ]);
    if (status === "won") {
      return [...wrongRows, [{ letter: "", status: "correct" }]];
    }
    return wrongRows;
  }, [wrongLines, status]);

  const shareText = buildShareGrid(rows, attemptsUsed, MAX_ATTEMPTS).replace(
    "DevTermo",
    "CodeBug"
  );

  function handleLineClick(index: number) {
    if (status !== "playing") return;

    if (index === snippet.buggyLine) {
      setStatus("won");
      setTimeout(() => setShowModal(true), 700);
      if (account) recordGameResult("codebug", true);
      complete({ won: true, shareText: buildShareGrid(rows, wrongLines.length + 1, MAX_ATTEMPTS).replace("DevTermo", "CodeBug") });
      return;
    }

    const nextWrong = [...wrongLines, index];
    setWrongLines(nextWrong);

    if (nextWrong.length >= MAX_ATTEMPTS) {
      setStatus("lost");
      setTimeout(() => setShowModal(true), 700);
      if (account) recordGameResult("codebug", false);
      const lostRows: EvaluatedLetter[][] = nextWrong.map(() => [{ letter: "", status: "absent" }]);
      complete({ won: false, shareText: buildShareGrid(lostRows, nextWrong.length, MAX_ATTEMPTS).replace("DevTermo", "CodeBug") });
    }
  }

  function handleCreateAccount(name: string) {
    createAccount(name);
    recordGameResult("codebug", status === "won");
  }

  if (lockStatus === "loading") return null;
  if (lockStatus === "locked" && result) {
    return <DailyLockScreen gameName="CodeBug" won={result.won} shareText={result.shareText} />;
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-4 py-6">
      <div className="flex w-full max-w-lg items-center justify-between">
        <h2 className="text-sm font-medium text-text-secondary">{snippet.title}</h2>
        <AttemptsIndicator total={MAX_ATTEMPTS} used={wrongLines.length} />
      </div>

      <p className="text-center text-xs text-text-muted">
        Clique na linha que contém o bug.
      </p>

      <CodeBlock
        code={snippet.code}
        buggyLine={snippet.buggyLine}
        wrongLines={wrongLines}
        revealed={status !== "playing"}
        disabled={status !== "playing"}
        onLineClick={handleLineClick}
      />

      <CodeBugCompletionModal
        open={showModal}
        won={status === "won"}
        snippet={snippet}
        attemptsUsed={attemptsUsed}
        maxAttempts={MAX_ATTEMPTS}
        shareText={shareText}
        showAccountPrompt={!account}
        onCreateAccount={handleCreateAccount}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
