import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface ExtractedFilters {
  location: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  guests: number | null;
  type: string | null;
  isGeneralQuestion: boolean;
}

/**
 * Turns a natural-language message into structured search filters.
 * isGeneralQuestion=true means the message isn't a villa search at all
 * (e.g. "how do I cancel a booking") — the caller should skip villa
 * filtering entirely and just let Gemini answer conversationally.
 */
export async function extractFilters(message: string): Promise<ExtractedFilters> {
  const prompt = `You are a filter-extraction engine for a Nepal villa booking site called VillaBaas.
Given a user's message, extract search filters as strict JSON only — no markdown, no explanation, no code fences.

Schema:
{
  "location": string | null,      // e.g. "Pokhara", "Kathmandu" — a city/area name if mentioned, else null
  "minPrice": number | null,      // minimum NPR per night, if mentioned
  "maxPrice": number | null,      // maximum NPR per night, if mentioned (e.g. "under 20000" -> maxPrice: 20000)
  "guests": number | null,        // minimum guest capacity needed, if mentioned
  "type": string | null,          // one of: "Lakeside", "Mountain", "Jungle", "Heritage" if clearly implied, else null
  "isGeneralQuestion": boolean    // true if this is NOT a villa search (e.g. "how do I cancel my booking", "hi", "what payment methods do you accept")
}

User message: "${message}"

Respond with ONLY the JSON object.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    // Strip markdown code fences if Gemini adds them despite instructions
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    return JSON.parse(cleaned) as ExtractedFilters;
  } catch {
    // Fall back to treating it as a general question if parsing fails
    return { location: null, minPrice: null, maxPrice: null, guests: null, type: null, isGeneralQuestion: true };
  }
}

export interface VillaSummary {
  name: string;
  location: string;
  price: number;
  guests: number;
  type: string;
  rating: number;
}

/**
 * Generates a natural reply. When matchedVillas is provided, Gemini is
 * instructed to reference ONLY those villas by name — never invent ones
 * that aren't in the list, since this is grounded in real DB results.
 */
export async function generateReply(
  userMessage: string,
  matchedVillas: VillaSummary[] | null
): Promise<string> {
  let prompt: string;

  if (matchedVillas === null) {
    prompt = `You are Hari-style friendly assistant for VillaBaas, a luxury villa booking platform in Nepal.
Answer this general question helpfully and briefly (2-4 sentences, no markdown headers).
If it's about booking/payment/cancellation and you don't know specifics, give general guidance and suggest checking the Bookings page.

User: "${userMessage}"`;
  } else if (matchedVillas.length === 0) {
    prompt = `You are a friendly assistant for VillaBaas, a villa booking platform in Nepal.
The user searched for villas matching: "${userMessage}"
No villas matched those filters in our database. Write a brief (1-2 sentence), friendly reply letting them know, and suggest they try a broader search (e.g. different location or budget). Do not invent any villa names.`;
  } else {
    const villaList = matchedVillas
      .map((v) => `- ${v.name} in ${v.location}, NPR ${v.price.toLocaleString()}/night, sleeps ${v.guests}, ${v.type} type, rated ${v.rating}`)
      .join("\n");

    prompt = `You are a friendly assistant for VillaBaas, a villa booking platform in Nepal.
The user asked: "${userMessage}"

Here are the ONLY real villas that matched their search (do not mention any villa not in this list):
${villaList}

Write a brief, warm reply (2-3 sentences) introducing these results conversationally. Do not repeat the full price/location details since they'll be shown as cards below your message — just give a friendly intro sentence or two.`;
  }

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}