import { Router } from "express";
import { PublicVillaController } from "../controllers/public-villa.controller";

const router = Router();
const publicVillaController = new PublicVillaController();

router.get("/",    publicVillaController.getAllVillas);
router.get("/:id", publicVillaController.getVillaById);

export default router;