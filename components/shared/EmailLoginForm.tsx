"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { sendMagicLink } from "@/lib/supabaseAccount";

export default function EmailLoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("sending");
    const { error } = await sendMagicLink(trimmed);
    if (error) {
      setError(error);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-feedback-correct/30 bg-feedback-correct/10 p-3 text-sm text-feedback-correct">
        Link enviado! Confira {email} e clique nele para entrar — sincroniza entre dispositivos e
        entra no leaderboard global.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        maxLength={120}
        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
      />
      <button
        type="submit"
        disabled={status === "sending" || !email.trim()}
        className="flex items-center justify-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
        Enviar link mágico
      </button>
      {status === "error" && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}
