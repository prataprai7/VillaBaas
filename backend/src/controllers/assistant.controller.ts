import { Request, Response } from "express";
import { AssistantService } from "../services/assistant.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

const assistantService = new AssistantService();

export class AssistantController {
  async chat(req: Request, res: Response) {
    try {
      const { message } = req.body as { message?: string };

      if (!message || !message.trim()) {
        return ApiResponseHelper.error(res, "Message is required", 400);
      }

      const result = await assistantService.chat(message.trim());
      return ApiResponseHelper.success(res, result, "Assistant response generated");
    } catch (error: any) {
      console.error("Assistant chat error:", error);
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}