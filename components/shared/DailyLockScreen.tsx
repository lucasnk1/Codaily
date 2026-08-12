"use client";

import { useEffect, useState } from "react";
import { Check, Lock } from "lucide-react";
import { formatCountdown, getMsUntilNextUTCReset } from "@/lib/daily";
import ShareButton from "./ShareButton";

type DailyLockScreenProps = {
  gameName: string;
  won: boolean;
  shareText: string;
};

export default function DailyLockScreen({ gameName, won, shareText }: DailyLockScreenProps) {
  const [msLeft, setMsLeft] = useState(() => getMsUntilNextUTCReset());

  useEffect(() => {
    const id = setInterval(() => setMsLeft(getMsUntilNextUTCReset()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div
        className={[
          "flex h-14 w-14 items-center justify-center rounded-full border",
          won
            ? "border-feedback-correct/40 bg-feedback-correct/10 text-feedback-correct"
            : "border-border bg-bg-card text-text-secondary",
        ].join(" ")}
      >
        {won ? <Check size={22} /> : <Lock size={22} />}
      </div>

      <h2 className="text-lg font-semibold text-text-primary">
        Você já jogou {gameName} hoje
      </h2>
      <p className="text-sm text-text-secondary">
        {won ? "Mandou bem! " : ""}Volte para o próximo desafio quando o dia virar.
      </p>

      <div className="rounded-lg border border-border bg-bg-card px-4 py-2 font-mono text-sm text-text-secondary">
        Próximo em {formatCountdown(msLeft)}
      </div>

      <div className="w-full">
        <ShareButton shareText={shareText} />
      </div>
    </div>
  );
}
