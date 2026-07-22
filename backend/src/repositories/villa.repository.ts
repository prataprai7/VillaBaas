import { VillaModel, IVilla } from "../models/villa.model";
import { VillaType } from "../types/villa.type";

export class VillaMongoRepository {
    async createVilla(data: Partial<VillaType> & { img: string; additionalImages: string[] }): Promise<IVilla> {
        return VillaModel.create(data);
    }

    async getVillaById(id: string): Promise<IVilla | null> {
        return VillaModel.findById(id);
    }

    async update(id: string, data: Partial<VillaType> & { img?: string; additionalImages?: string[] }): Promise<IVilla | null> {
        return VillaModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await VillaModel.findByIdAndDelete(id);
        return !!result;
    }

    async getAllPaginated(page: number, limit: number, search?: string) {
        const filter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { location: { $regex: search, $options: "i" } },
                      { type: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const total = await VillaModel.countDocuments(filter);
        const data = await VillaModel.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return { data, total };
    }
}