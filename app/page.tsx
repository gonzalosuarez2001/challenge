import { getCounter } from "@/app/actions";
import Counter from "@/app/components/organisms/Counter";

export const dynamic = "force-dynamic";

export default async function Home() {
  const counter = await getCounter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-950">
      <main className="flex flex-col items-center gap-10 px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 text-balance">
            Contador Global
          </h1>
          <p className="text-sm text-zinc-400">
            Compartido entre todas las sesiones · Se reinicia tras 20 minutos de inactividad
          </p>
        </div>

        <Counter initial={counter} />
      </main>
    </div>
  );
}
