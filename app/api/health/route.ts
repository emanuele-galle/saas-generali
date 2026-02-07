import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  let dbStatus = "ok";
  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "error";
  }

  const status = dbStatus === "ok" ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      app: "saas-generali",
      db: dbStatus,
    },
    { status: status === "ok" ? 200 : 503 },
  );
}
