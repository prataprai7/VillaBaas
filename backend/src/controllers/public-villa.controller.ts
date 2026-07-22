import { VillaService } from "../services/villa.service";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";

const villaService = new VillaService();

interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}

export class PublicVillaController {
    async getAllVillasPaginated(req: Request, res: Response) {
        try {
            const { page, limit, search }: QueryParams = req.query;
            const { data, pagination } = await villaService.getAllVillasPaginated(page, limit, search);
            return ApiResponseHelper.success(res, data, "Villas retrieved successfully", 200, pagination);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getVillaById(req: Request, res: Response) {
        try {
            const villa = await villaService.getVillaById(req.params.id);
            return ApiResponseHelper.success(res, villa, "Villa retrieved successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}