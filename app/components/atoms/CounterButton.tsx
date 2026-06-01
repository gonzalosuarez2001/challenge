"use client";

import { Minus, Plus } from "lucide-react";

type Variant = "increment" | "decrement";

interface CounterButtonProps {
  variant: Variant;
  onClick: () => void;
  disabled?: boolean;
}

const BASE =
  "cursor-pointer flex h-14 w-14 items-center justify-center rounded-full border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100";

const VARIANT_CLASSES: Record<Variant, string> = {
  decrement:
    "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700 focus-visible:ring-zinc-100",
  increment:
    "border-zinc-100 bg-zinc-100 text-zinc-900 hover:border-zinc-300 hover:bg-zinc-300 focus-visible:ring-zinc-100",
};

const LABELS: Record<Variant, string> = {
  decrement: "Decrease counter",
  increment: "Increase counter",
};

export default function CounterButton({ variant, onClick, disabled }: CounterButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={LABELS[variant]}
      className={`${BASE} ${VARIANT_CLASSES[variant]}`}
      style={{ touchAction: "manipulation" }}
    >
      {variant === "increment" ? (
        <Plus size={20} aria-hidden="true" />
      ) : (
        <Minus size={20} aria-hidden="true" />
      )}
    </button>
  );
}
