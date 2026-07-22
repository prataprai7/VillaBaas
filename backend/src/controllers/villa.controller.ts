import { VillaService } from "../services/villa.service";
import { z } from "zod";
import { CreateVillaDTO, UpdateVillaDTO } from "../dtos/villa.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";

const villaService = new VillaService();

interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}

// req.files comes from uploads.fields([{ name: "img", maxCount: 1 }, { name: "additionalImages", maxCount: 8 }])
type VillaFiles = {
    img?: Express.Multer.File[];
    additionalImages?: Express.Multer.File[];
};

export class AdminVillaController {
    async createVilla(req: Request, res: Response) {
        try {
            const parsed = CreateVillaDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }

            const files = req.files as VillaFiles;
            if (!files?.img?.[0]) {
                return ApiResponseHelper.error(res, "A main villa image is required", 400);
            }

            const img = "/uploads/" + files.img[0].filename;
            const additionalImages = (files.additionalImages || []).map(f => "/uploads/" + f.filename);

            const villa = await villaService.createVilla({ ...parsed.data, img, additionalImages });
            return ApiResponseHelper.success(res, villa, "Villa created successfully", 201);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateVilla(req: Request, res: Response) {
        try {
            const villaId = req.params.id;
            const parsed = UpdateVillaDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }

            const files = req.files as VillaFiles;
            const updateData: any = { ...parsed.data };

            if (files?.img?.[0]) {
                updateData.img = "/uploads/" + files.img[0].filename;
            }
            if (files?.additionalImages?.length) {
                updateData.additionalImages = files.additionalImages.map(f => "/uploads/" + f.filename);
            }

            const updatedVilla = await villaService.updateVilla(villaId, updateData);
            return ApiResponseHelper.success(res, updatedVilla, "Villa updated successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteVilla(req: Request, res: Response) {
        try {
            const villaId = req.params.id;
            await villaService.deleteVilla(villaId);
            return ApiResponseHelper.success(res, null, "Villa deleted successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getVillaById(req: Request, res: Response) {
        try {
            const villaId = req.params.id;
            const villa = await villaService.getVillaById(villaId);
            return ApiResponseHelper.success(res, villa, "Villa retrieved successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getAllVillasPaginated(req: Request, res: Response) {
        try {
            const { page, limit, search }: QueryParams = req.query;
            const { data, pagination } = await villaService.getAllVillasPaginated(page, limit, search);
            return ApiResponseHelper.success(res, data, "Villas retrieved successfully", 200, pagination);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}