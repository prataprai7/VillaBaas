import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/auth.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const router = Router();
const adminUserController = new AdminUserController();

router.use(authorizedMiddleware, adminMiddleware);

router.get("/",        adminUserController.getAllUserPaginated);
router.get("/:id",     adminUserController.getUserById);
router.post("/",       adminUserController.createUser);
router.put("/:id",     uploads.single("profileImage"), adminUserController.updateUser);
router.delete("/:id",  adminUserController.deleteUser);

export default router;
