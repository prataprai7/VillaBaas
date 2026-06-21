import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";
import { uploads } from "../middlewares/upload.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login",    userController.loginUser);

// Protected routes
userRouter.get("/whoami",
    authorizedMiddleware,
    userController.whoami
);

userRouter.put("/update",
    authorizedMiddleware,
    uploads.single("profileImage"),  // multer handles file
    userController.updateUser
);

export default userRouter;
