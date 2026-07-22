import { Router } from "express";
import { AdminVillaController } from "../controllers/villa.controller";
import { authorizedMiddleware, adminMiddleware } from "../middlewares/auth.middleware";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();
const adminVillaController = new AdminVillaController();

router.use(authorizedMiddleware, adminMiddleware);

const villaImageUpload = uploads.fields([
    { name: "img", maxCount: 1 },
    { name: "additionalImages", maxCount: 8 },
]);

router.get("/",       adminVillaController.getAllVillasPaginated);
router.get("/:id",    adminVillaController.getVillaById);
router.post("/",      villaImageUpload, adminVillaController.createVilla);
router.put("/:id",    villaImageUpload, adminVillaController.updateVilla);
router.delete("/:id", adminVillaController.deleteVilla);

export default router;