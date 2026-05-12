import { Router, type IRouter } from "express";
import healthRouter from "./health";
import doctorsRouter from "./doctors";
import appointmentsRouter from "./appointments";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(doctorsRouter);
router.use(appointmentsRouter);
router.use(statsRouter);

export default router;
