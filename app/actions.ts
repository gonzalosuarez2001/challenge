"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { COUNTER_ID } from "@/lib/constants";
import type { CounterData } from "@/lib/types";

function serialize(counter: {
  id: number;
  value: number;
  lastUpdatedAt: Date;
}): CounterData {
  return { ...counter, lastUpdatedAt: counter.lastUpdatedAt.toISOString() };
}

export async function getCounter(): Promise<CounterData> {
  const counter = await prisma.counter.upsert({
    where: { id: COUNTER_ID },
    create: { id: COUNTER_ID, value: 0 },
    update: {},
  });
  return serialize(counter);
}

export async function incrementCounter(): Promise<CounterData> {
  const updated = await prisma.counter.upsert({
    where: { id: COUNTER_ID },
    create: { id: COUNTER_ID, value: 1 },
    update: { value: { increment: 1 } },
  });
  revalidatePath("/");
  return serialize(updated);
}

export async function decrementCounter(): Promise<CounterData> {
  const updated = await prisma.counter.upsert({
    where: { id: COUNTER_ID },
    create: { id: COUNTER_ID, value: 0 },
    update: { value: { decrement: 1 } },
  });
  revalidatePath("/");
  return serialize(updated);
}

export async function resetCounter(): Promise<CounterData> {
  const updated = await prisma.counter.upsert({
    where: { id: COUNTER_ID },
    create: { id: COUNTER_ID, value: 0 },
    update: { value: 0 },
  });
  revalidatePath("/");
  return serialize(updated);
}
