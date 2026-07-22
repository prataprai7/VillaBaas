import { VillaMongoRepository } from "../repositories/villa.repository";
import { CreateVillaDTO, UpdateVillaDTO } from "../dtos/villa.dto";
import { IVilla } from "../models/villa.model";
import { HttpException } from "../exceptions/http-exception";

const villaRepository = new VillaMongoRepository();

export class VillaService {
    async createVilla(data: CreateVillaDTO & { img: string; additionalImages: string[] }): Promise<IVilla> {
        return villaRepository.createVilla(data);
    }

    async updateVilla(id: string, data: UpdateVillaDTO & { img?: string; additionalImages?: string[] }): Promise<IVilla> {
        const existing = await villaRepository.getVillaById(id);
        if (!existing) throw new HttpException(404, "Villa not found");

        const updated = await villaRepository.update(id, data);
        if (!updated) throw new HttpException(500, "Failed to update villa");
        return updated;
    }

    async deleteVilla(id: string): Promise<boolean> {
        const existing = await villaRepository.getVillaById(id);
        if (!existing) throw new HttpException(404, "Villa not found");

        const deleted = await villaRepository.delete(id);
        if (!deleted) throw new HttpException(500, "Failed to delete villa");
        return deleted;
    }

    async getVillaById(id: string): Promise<IVilla> {
        const villa = await villaRepository.getVillaById(id);
        if (!villa) throw new HttpException(404, "Villa not found");
        return villa;
    }

    async getAllVillasPaginated(page?: string, limit?: string, search?: string) {
        const currentPage   = page  && parseInt(page)  > 0 ? parseInt(page)  : 1;
        const currentLimit  = limit && parseInt(limit) > 0 ? parseInt(limit) : 10;
        const currentSearch = search && search.trim() !== "" ? search : undefined;

        const { data, total } = await villaRepository.getAllPaginated(currentPage, currentLimit, currentSearch);
        const totalPages = Math.ceil(total / currentLimit);

        return {
            data,
            pagination: { page: currentPage, limit: currentLimit, total, totalPages },
        };
    }
}