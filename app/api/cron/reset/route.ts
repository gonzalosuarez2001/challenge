import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COUNTER_ID, RESET_TIMEOUT_MS } from "@/lib/constants";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const counter = await prisma.counter.findUnique({ where: { id: COUNTER_ID } });

  if (!counter) {
    return NextResponse.json({ message: "No counter found" });
  }

  const elapsed = Date.now() - counter.lastUpdatedAt.getTime();

  if (elapsed >= RESET_TIMEOUT_MS && counter.value !== 0) {
    await prisma.counter.update({
      where: { id: COUNTER_ID },
      data: { value: 0 },
    });
    return NextResponse.json({ message: "Counter reset to 0" });
  }

  return NextResponse.json({ message: "No reset needed", value: counter.value });
}
