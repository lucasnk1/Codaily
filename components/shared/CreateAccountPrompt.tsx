"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import AccountNameForm from "./AccountNameForm";

export default function CreateAccountPrompt({ onCreate }: { onCreate: (name: string) => void }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
      >
        <UserPlus size={16} />
        Criar conta e salvar estatísticas
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-border bg-bg-subtle p-3">
      <p className="mb-2 text-xs text-text-secondary">
        Conta local neste navegador — sem senha, sem e-mail.
      </p>
      <AccountNameForm onSubmit={onCreate} submitLabel="Criar e salvar" />
    </div>
  );
}
