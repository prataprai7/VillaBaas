import { Router } from "express";
import { KhaltiController } from "../controllers/khalti.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

const khaltiRouter = Router();
const khaltiController = new KhaltiController();

khaltiRouter.post("/initiate", authorizedMiddleware, khaltiController.initiate);
khaltiRouter.get("/verify",    authorizedMiddleware, khaltiController.verify);

export default khaltiRouter;