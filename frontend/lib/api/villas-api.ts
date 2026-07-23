const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

export interface Villa {
  _id: string;
  name: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  guests: number;
  rooms: number;
  baths: number;
  tag: "popular" | "new" | "immediate";
  type: string;
  img: string;
  additionalImages: string[];
  amenities: string[];
  breakfastIncluded: boolean;
  dinnerIncluded: boolean;
  description: string;
  houseRules: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiEnvelope<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

async function unwrap<T>(res: Response): Promise<T> {
  const body: ApiEnvelope<T> = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Request failed");
  }
  return body.data;
}

export async function getAllVillas(params?: { page?: number; limit?: number; search?: string }): Promise<Villa[]> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);

  const qs = query.toString();
  const res = await fetch(`${API_URL}/api/v1/villas${qs ? `?${qs}` : ""}`);
  return unwrap<Villa[]>(res);
}

export async function getVillaById(id: string): Promise<Villa> {
  const res = await fetch(`${API_URL}/api/v1/villas/${id}`);
  return unwrap<Villa>(res);
}