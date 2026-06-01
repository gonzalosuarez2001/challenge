"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-12 py-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold text-zinc-50">Algo salió mal</h2>
          <p className="text-sm text-zinc-400">
            Ocurrió un error inesperado. Podés intentar de nuevo.
          </p>
        </div>
        <button
          onClick={reset}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
