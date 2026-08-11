"use client";

import { Bug } from "lucide-react";

export default function AttemptsIndicator({
  total,
  used,
}: {
  total: number;
  used: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <Bug
          key={i}
          size={16}
          className={i < total - used ? "text-feedback-present" : "text-bg-subtle"}
          fill="currentColor"
        />
      ))}
    </div>
  );
}
