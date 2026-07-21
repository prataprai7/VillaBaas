export type BookingStatus = "upcoming" | "completed" | "cancelled";

export interface StoredBooking {
  id: string;
  villaId: number;
  villaName: string;
  location: string;
  img: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  status: BookingStatus;
  paymentMethod: string;
  createdAt: string;
}

const STORAGE_KEY = "villabaas_bookings";

export function genBookingId(): string {
  return "VB" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function getBookings(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredBooking[]) : [];
  } catch {
    return [];
  }
}

export function addBooking(booking: StoredBooking): void {
  if (typeof window === "undefined") return;
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function updateBookingStatus(id: string, status: BookingStatus): void {
  if (typeof window === "undefined") return;
  const bookings = getBookings().map((b) => (b.id === id ? { ...b, status } : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function getBookingById(id: string): StoredBooking | undefined {
  return getBookings().find((b) => b.id === id);
}