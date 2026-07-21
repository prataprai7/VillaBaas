import { Router } from "express";
import { initiate, verify } from "../controllers/khaltiController";

const router = Router();

router.post("/initiate", initiate);
router.get("/verify", verify);

export default router;

// In your main app.ts / server.ts, mount alongside your existing eSewa routes:
// import khaltiRoutes from "./payment/khaltiRoutes";
// app.use("/api/payments/khalti", khaltiRoutes);