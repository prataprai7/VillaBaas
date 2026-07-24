import { Router } from "express";
import { AssistantController } from "../controllers/assistant.controller";

const router = Router();
const assistantController = new AssistantController();

router.post("/chat", assistantController.chat);

export default router;