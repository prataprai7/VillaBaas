import { getTokenCookie } from "@/lib/api/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

export type BookingStatus = "paid" | "unpaid" | "cancelled" | "completed";

export interface Booking {
  _id: string;
  userId: string;
  villaName: string;
  villaType: string;
  location: string;
  image: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  pricePerNight: number;
  totalPrice: number;
  nights: number;
  status: BookingStatus;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiEnvelope<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

function authHeaders(): HeadersInit {
  const token = getTokenCookie();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function unwrap<T>(res: Response): Promise<T> {
  const body: ApiEnvelope<T> = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Request failed");
  }
  return body.data;
}

export interface CreateBookingPayload {
  villaName: string;
  villaType: string;
  location: string;
  image: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  pricePerNight: number;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const res = await fetch(`${API_URL}/api/v1/auth/bookings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return unwrap<Booking>(res);
}

export async function getMyBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/api/v1/auth/bookings/my`, {
    headers: authHeaders(),
  });
  return unwrap<Booking[]>(res);
}

export async function getBookingById(id: string): Promise<Booking> {
  const res = await fetch(`${API_URL}/api/v1/auth/bookings/${id}`, {
    headers: authHeaders(),
  });
  return unwrap<Booking>(res);
}

export async function cancelBooking(id: string): Promise<Booking> {
  const res = await fetch(`${API_URL}/api/v1/auth/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return unwrap<Booking>(res);
}

export interface KhaltiInitiateResult {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

export async function initiateKhaltiPayment(bookingId: string): Promise<KhaltiInitiateResult> {
  const res = await fetch(`${API_URL}/api/v1/payments/khalti/initiate`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ bookingId }),
  });
  return unwrap<KhaltiInitiateResult>(res);
}

export interface KhaltiVerifyResult {
  status?: string; // present when NOT completed (e.g. "Pending")
  _id?: string;     // present when payment succeeded — this is the paid booking
  [key: string]: unknown;
}

export async function verifyKhaltiPayment(pidx: string, bookingId: string): Promise<KhaltiVerifyResult> {
  const res = await fetch(
    `${API_URL}/api/v1/payments/khalti/verify?pidx=${encodeURIComponent(pidx)}&bookingId=${encodeURIComponent(bookingId)}`,
    { headers: authHeaders() }
  );
  return unwrap<KhaltiVerifyResult>(res);
}