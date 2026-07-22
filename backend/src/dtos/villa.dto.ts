import { z } from "zod";
import { VillaSchema } from "../types/villa.type";

export const CreateVillaDTO = VillaSchema;
export type CreateVillaDTO = z.infer<typeof CreateVillaDTO>;

export const UpdateVillaDTO = VillaSchema.partial();
export type UpdateVillaDTO = z.infer<typeof UpdateVillaDTO>;