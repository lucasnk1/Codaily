"use client";

import { useState } from "react";

type AccountNameFormProps = {
  onSubmit: (name: string) => void;
  submitLabel?: string;
};

export default function AccountNameForm({ onSubmit, submitLabel = "Criar conta" }: AccountNameFormProps) {
  const [name, setName] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed) onSubmit(trimmed);
      }}
      className="flex flex-col gap-2"
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={24}
        placeholder="Seu nome"
        className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}
