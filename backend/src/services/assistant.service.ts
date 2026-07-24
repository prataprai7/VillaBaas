import { VillaService } from "./villa.service";
import { extractFilters, generateReply, VillaSummary } from "./gemini.service";
import { IVilla } from "../models/villa.model";

const villaService = new VillaService();

export interface AssistantResponse {
  reply: string;
  villas: IVilla[];
}

export class AssistantService {
  async chat(message: string): Promise<AssistantResponse> {
    const filters = await extractFilters(message);

    if (filters.isGeneralQuestion) {
      const reply = await generateReply(message, null);
      return { reply, villas: [] };
    }

    // Fetch a broad set of real villas, then filter in-memory against the
    // extracted criteria. Reuses your existing VillaService — no duplicate
    // DB logic, and never returns anything not actually in MongoDB.
    const { data: allVillas } = await villaService.getAllVillasPaginated("1", "200");

    const matched = allVillas.filter((v) => {
      if (v.isActive === false) return false;
      if (filters.location && !v.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.minPrice !== null && v.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && v.price > filters.maxPrice) return false;
      if (filters.guests !== null && v.guests < filters.guests) return false;
      if (filters.type && v.type.toLowerCase() !== filters.type.toLowerCase()) return false;
      return true;
    });

    const summaries: VillaSummary[] = matched.map((v) => ({
      name: v.name,
      location: v.location,
      price: v.price,
      guests: v.guests,
      type: v.type,
      rating: v.rating,
    }));

    const reply = await generateReply(message, summaries);

    return { reply, villas: matched.slice(0, 6) };
  }
}