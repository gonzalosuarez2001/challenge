import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-12 py-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl font-bold text-zinc-700">404</span>
          <h2 className="text-lg font-semibold text-zinc-50">Página no encontrada</h2>
          <p className="text-sm text-zinc-400">
            La página que buscás no existe o fue movida.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
