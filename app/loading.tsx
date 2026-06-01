import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={32} className="animate-spin text-zinc-500" aria-hidden="true" />
        <p className="text-sm text-zinc-500">Cargando…</p>
      </div>
    </div>
  );
}
