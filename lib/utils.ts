export type LetterStatus = "correct" | "present" | "absent" | "empty" | "typing";

export type EvaluatedLetter = {
  letter: string;
  status: LetterStatus;
};

/**
 * Avalia uma tentativa contra a palavra-alvo seguindo a regra clássica do
 * Wordle: primeiro marca acertos exatos, depois resolve "presentes"
 * respeitando a contagem de letras restantes na palavra-alvo.
 */
export function evaluateGuess(guess: string, target: string): EvaluatedLetter[] {
  const g = guess.toUpperCase().split("");
  const t = target.toUpperCase().split("");
  const result: EvaluatedLetter[] = g.map((letter) => ({ letter, status: "absent" }));

  const remaining: Record<string, number> = {};
  t.forEach((letter, i) => {
    if (g[i] === letter) {
      result[i].status = "correct";
    } else {
      remaining[letter] = (remaining[letter] ?? 0) + 1;
    }
  });

  g.forEach((letter, i) => {
    if (result[i].status === "correct") return;
    if (remaining[letter] > 0) {
      result[i].status = "present";
      remaining[letter] -= 1;
    }
  });

  return result;
}

export function mergeKeyboardStatus(
  current: Record<string, LetterStatus>,
  evaluated: EvaluatedLetter[]
): Record<string, LetterStatus> {
  const priority: Record<LetterStatus, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    typing: 0,
    empty: 0,
  };
  const next = { ...current };
  evaluated.forEach(({ letter, status }) => {
    const existing = next[letter];
    if (!existing || priority[status] > priority[existing]) {
      next[letter] = status;
    }
  });
  return next;
}

export function buildShareGrid(
  rows: EvaluatedLetter[][],
  attemptsUsed: number,
  maxAttempts: number
): string {
  const emojiFor: Record<LetterStatus, string> = {
    correct: "🟩",
    present: "🟨",
    absent: "⬛",
    typing: "⬜",
    empty: "⬜",
  };
  const grid = rows
    .map((row) => row.map((cell) => emojiFor[cell.status]).join(""))
    .join("\n");
  return `Codaily — DevTermo ${attemptsUsed}/${maxAttempts}\n\n${grid}`;
}
