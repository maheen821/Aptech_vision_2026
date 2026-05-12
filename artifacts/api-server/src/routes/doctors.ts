import { Router, type IRouter } from "express";
import { ilike, eq, and } from "drizzle-orm";
import { db, doctorsTable } from "@workspace/db";
import {
  ListDoctorsQueryParams,
  ListDoctorsResponse,
  GetDoctorParams,
  GetDoctorResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/doctors", async (req, res): Promise<void> => {
  const query = ListDoctorsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { specialty, search } = query.data;

  const conditions = [];
  if (specialty) {
    conditions.push(eq(doctorsTable.specialty, specialty));
  }
  if (search) {
    conditions.push(ilike(doctorsTable.name, `%${search}%`));
  }

  const doctors = conditions.length > 0
    ? await db.select().from(doctorsTable).where(and(...conditions))
    : await db.select().from(doctorsTable);

  res.json(ListDoctorsResponse.parse(doctors));
});

router.get("/doctors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetDoctorParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [doctor] = await db
    .select()
    .from(doctorsTable)
    .where(eq(doctorsTable.id, params.data.id));

  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  res.json(GetDoctorResponse.parse(doctor));
});

export default router;
