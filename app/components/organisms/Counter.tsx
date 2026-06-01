"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useTimer } from "react-timer-hook";
import { createBrowserClient } from "@/lib/supabase/client";
import { incrementCounter, decrementCounter, resetCounter } from "@/app/actions";
import { RESET_TIMEOUT_SECONDS } from "@/lib/constants";
import type { CounterData } from "@/lib/types";
import CounterButton from "@/app/components/atoms/CounterButton";
import { Loader2 } from "lucide-react";
import moment from "moment";

export default function Counter({ initial }: { initial: CounterData }) {
  const [counterValue, setCounterValue] = useState(initial.value);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() =>
    moment(initial.lastUpdatedAt),
  );

  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  const [optimisticValue, setOptimisticValue] = useState(initial.value);

  const counterValueRef = useRef(counterValue);
  counterValueRef.current = counterValue;
  const optimisticValueRef = useRef(optimisticValue);
  optimisticValueRef.current = optimisticValue;

  const expiryTimestamp = lastUpdatedAt.clone().add(20, "minutes").toDate();

  const { minutes, seconds, restart } = useTimer({
    expiryTimestamp,
    autoStart: true,
  });

  const remainingSeconds = minutes * 60 + seconds;
  const progress = remainingSeconds / RESET_TIMEOUT_SECONDS;
  
  const hasActivity = isMounted && remainingSeconds > 0 && optimisticValue !== 0;

  const handleIncrement = useCallback(() => {
    setOptimisticValue((v) => v + 1);
    startTransition(async () => {
      try {
        await incrementCounter();
      } catch {
        setOptimisticValue(counterValue);
      }
    });
  }, [counterValue]);

  const handleDecrement = useCallback(() => {
    setOptimisticValue((v) => v - 1);
    startTransition(async () => {
      try {
        await decrementCounter();
      } catch {
        setOptimisticValue(counterValue);
      }
    });
  }, [counterValue]);

  useEffect(() => {
    restart(lastUpdatedAt.clone().add(20, "minutes").toDate());
  }, [lastUpdatedAt]);

  useEffect(() => {
    if (!isMounted || remainingSeconds !== 0 || optimisticValueRef.current === 0) return;
    setOptimisticValue(0);
    startTransition(async () => {
      try {
        await resetCounter();
      } catch {
        setOptimisticValue(counterValueRef.current);
      }
    });
  }, [remainingSeconds, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createBrowserClient();
    const channel = supabase
      .channel("counter-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "counters", filter: "id=eq.1" },
        (payload) => {
          if (payload.new && typeof payload.new === "object") {
            const row = payload.new as {
              value: number;
              last_updated_at: string;
            };
            setCounterValue(row.value);
            setOptimisticValue(row.value);
            setLastUpdatedAt(moment(row.last_updated_at));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex flex-col items-center gap-8 rounded-2xl border border-zinc-800 bg-zinc-900 px-16 py-12 shadow-sm">
        <div
          aria-label={isPending ? "Saving…" : undefined}
          className="absolute -bottom-7 flex items-center justify-center"
        >
          <Loader2
            size={16}
            aria-hidden="true"
            className={[
              "text-zinc-600 transition-opacity duration-150 motion-reduce:transition-none",
              isPending ? "animate-spin opacity-100" : "opacity-0",
            ].join(" ")}
          />
        </div>

        <div
          role="status"
          aria-label={`Counter value: ${optimisticValue}`}
          className={`${isPending ? "opacity-50" : "opacity-100"} font-mono text-9xl font-bold tracking-tight text-zinc-50 transition-opacity duration-150 motion-reduce:transition-none select-none`}
          style={{
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {optimisticValue}
        </div>

        <div
          role="group"
          aria-label="Counter controls"
          className="flex items-center gap-5"
        >
          <CounterButton variant="decrement" onClick={handleDecrement} disabled={isPending} />
          <CounterButton variant="increment" onClick={handleIncrement} disabled={isPending} />
        </div>

      </div>

      <div className="flex h-10 flex-col items-center justify-center gap-2.5">
        {hasActivity ? (
          <>
            <p className="text-sm text-zinc-400">
              Se reinicia en{" "}
              <span
                className="font-medium text-zinc-300"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {`${minutes}m ${String(seconds).padStart(2, "0")}s`}
              </span>{" "}
              de inactividad
            </p>
            <div
              className="h-1 w-48 overflow-hidden rounded-full bg-zinc-800"
              aria-label="Time until counter reset"
            >
              <div
                className="h-full rounded-full bg-zinc-500 transition-[width] duration-1000 motion-reduce:transition-none"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-600">
            Sin actividad reciente
          </p>
        )}
      </div>
    </div>
  );
}
