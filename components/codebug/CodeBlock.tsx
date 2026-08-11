"use client";

import { motion } from "framer-motion";

type CodeBlockProps = {
  code: string[];
  buggyLine: number;
  wrongLines: number[];
  revealed: boolean;
  disabled: boolean;
  onLineClick: (index: number) => void;
};

export default function CodeBlock({
  code,
  buggyLine,
  wrongLines,
  revealed,
  disabled,
  onLineClick,
}: CodeBlockProps) {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-bg-card">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-feedback-absent" />
        <span className="h-2.5 w-2.5 rounded-full bg-feedback-absent" />
        <span className="h-2.5 w-2.5 rounded-full bg-feedback-absent" />
      </div>

      <div className="py-2">
        {code.map((line, i) => {
          const isWrong = wrongLines.includes(i);
          const isBuggy = i === buggyLine;
          const showAsCorrect = revealed && isBuggy;
          const showAsWrong = isWrong;

          return (
            <motion.button
              key={i}
              disabled={disabled || isWrong}
              onClick={() => onLineClick(i)}
              animate={isWrong ? { x: [0, -4, 4, 0] } : {}}
              transition={{ duration: 0.3 }}
              className={[
                "flex w-full items-start gap-3 px-4 py-1 text-left font-mono text-[13px] leading-relaxed transition-colors sm:text-sm",
                showAsCorrect
                  ? "bg-feedback-correct/15"
                  : showAsWrong
                  ? "bg-red-500/10"
                  : "hover:bg-bg-subtle disabled:hover:bg-transparent",
                disabled || isWrong ? "cursor-default" : "cursor-pointer",
              ].join(" ")}
            >
              <span className="w-4 shrink-0 select-none text-right text-text-muted">{i + 1}</span>
              <span
                className={[
                  "whitespace-pre-wrap",
                  showAsCorrect
                    ? "text-feedback-correct"
                    : showAsWrong
                    ? "text-red-400"
                    : "text-text-primary",
                ].join(" ")}
              >
                {line || " "}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
