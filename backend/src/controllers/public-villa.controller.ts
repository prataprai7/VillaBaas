import { Request, Response } from "express";
import mongoose from "mongoose";
import { VillaService } from "../services/villa.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

const villaService = new VillaService();

interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}

// Public-facing villa browsing — no auth required. Reuses the same
// VillaService your admin panel already uses; this never touches or
// duplicates that logic, it just exposes read access without the admin gate.
export class PublicVillaController {
    async getAllVillas(req: Request, res: Response) {
        try {
            const { page, limit, search }: QueryParams = req.query;
            const { data, pagination } = await villaService.getAllVillasPaginated(page, limit, search);
            return ApiResponseHelper.success(res, data, "Villas fetched successfully", 200, pagination);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getVillaById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ApiResponseHelper.error(res, "Invalid villa id", 400);
            }

            const villa = await villaService.getVillaById(id);
            return ApiResponseHelper.success(res, villa, "Villa fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}