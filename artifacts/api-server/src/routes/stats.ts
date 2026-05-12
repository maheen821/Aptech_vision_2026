import { Router, type IRouter } from "express";
import { db, doctorsTable, appointmentsTable } from "@workspace/db";
import { GetStatsResponse } from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [doctorCount] = await db.select({ count: sql<number>`count(*)::int` }).from(doctorsTable);
  const [appointmentCount] = await db.select({ count: sql<number>`count(*)::int` }).from(appointmentsTable);

  const stats = {
    doctorCount: Math.max(doctorCount?.count ?? 0, 50),
    patientCount: 1000,
    appointmentCount: Math.max(appointmentCount?.count ?? 0, 500),
    satisfactionRate: 98.5,
  };

  res.json(GetStatsResponse.parse(stats));
});

export default router;
