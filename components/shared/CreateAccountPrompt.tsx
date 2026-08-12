"use client";

import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import AccountNameForm from "./AccountNameForm";
import EmailLoginForm from "./EmailLoginForm";

type Mode = "closed" | "local" | "email";

export default function CreateAccountPrompt({ onCreate }: { onCreate: (name: string) => void }) {
  const [mode, setMode] = useState<Mode>("closed");

  if (mode === "closed") {
    return (
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setMode("local")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
        >
          <UserPlus size={14} />
          Conta local
        </button>
        <button
          onClick={() => setMode("email")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
        >
          <Mail size={14} />
          Entrar com e-mail
        </button>
      </div>
    );
  }

  if (mode === "email") {
    return (
      <div className="mt-3 rounded-lg border border-border bg-bg-subtle p-3">
        <p className="mb-2 text-xs text-text-secondary">
          Sincroniza entre dispositivos e entra no leaderboard global.
        </p>
        <EmailLoginForm />
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-border bg-bg-subtle p-3">
      <p className="mb-2 text-xs text-text-secondary">
        Conta local neste navegador — sem senha, sem e-mail, mas não entra no leaderboard global.
      </p>
      <AccountNameForm onSubmit={onCreate} submitLabel="Criar e salvar" />
    </div>
  );
}
