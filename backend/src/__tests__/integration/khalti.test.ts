import request from "supertest";
import app from "../../app";

const AUTH_API = "/api/v1/auth";
const BOOKING_API = "/api/v1/auth/bookings";
const KHALTI_API = "/api/v1/payments/khalti";

jest.mock("../../services/khalti.service", () => ({
  initiateKhaltiPayment: jest.fn(),
  lookupKhaltiPayment: jest.fn(),
}));

jest.mock("../../services/email.service", () => ({
  sendBookingConfirmationEmail: jest.fn(),
  sendBookingCancellationEmail: jest.fn(),
}));

import { initiateKhaltiPayment, lookupKhaltiPayment } from "../../services/khalti.service";

const mockInitiate = initiateKhaltiPayment as jest.Mock;
const mockLookup = lookupKhaltiPayment as jest.Mock;

async function registerAndLogin(email: string) {
  await request(app).post(`${AUTH_API}/register`).send({
    firstName: "Test",
    lastName: "User",
    email,
    password: "password123",
  });
  const res = await request(app)
    .post(`${AUTH_API}/login`)
    .send({ email, password: "password123" });
  return res.body.data.token as string;
}

async function createBooking(token: string, overrides = {}) {
  const res = await request(app)
    .post(BOOKING_API)
    .set("Authorization", `Bearer ${token}`)
    .send({
      villaName: "Sunset Villa",
      villaType: "Villa",
      location: "Pokhara",
      image: "/uploads/sunset.jpg",
      checkIn: "2026-09-01",
      checkOut: "2026-09-05",
      guests: 4,
      pricePerNight: 5000,
      ...overrides,
    });
  return res.body.data;
}

beforeEach(() => {
  mockInitiate.mockReset();
  mockLookup.mockReset();
});

describe("Khalti - Initiate", () => {
  it("initiates a payment successfully for an unpaid booking", async () => {
    const token = await registerAndLogin("khalti1@example.com");
    const booking = await createBooking(token);

    mockInitiate.mockResolvedValue({
      pidx: "test-pidx-123",
      payment_url: "https://dev.khalti.com/pay/test-pidx-123",
      expires_at: "2026-09-01T00:00:00Z",
      expires_in: 1800,
    });

    const res = await request(app)
      .post(`${KHALTI_API}/initiate`)
      .set("Authorization", `Bearer ${token}`)
      .send({ bookingId: booking._id });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pidx).toBe("test-pidx-123");
    expect(mockInitiate).toHaveBeenCalledTimes(1);
  });

  it("rejects initiate without a bookingId", async () => {
    const token = await registerAndLogin("khalti2@example.com");

    const res = await request(app)
      .post(`${KHALTI_API}/initiate`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/bookingid is required/i);
  });

  it("rejects initiating payment for an already-paid booking", async () => {
    const token = await registerAndLogin("khalti3@example.com");
    const booking = await createBooking(token);

    await request(app)
      .patch(`${BOOKING_API}/${booking._id}/pay`)
      .set("Authorization", `Bearer ${token}`)
      .send({ paymentMethod: "khalti" });

    const res = await request(app)
      .post(`${KHALTI_API}/initiate`)
      .set("Authorization", `Bearer ${token}`)
      .send({ bookingId: booking._id });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/not payable/i);
  });

  it("rejects initiating payment for someone else's booking", async () => {
    const ownerToken = await registerAndLogin("khaltiowner@example.com");
    const intruderToken = await registerAndLogin("khaltiintruder@example.com");
    const booking = await createBooking(ownerToken);

    const res = await request(app)
      .post(`${KHALTI_API}/initiate`)
      .set("Authorization", `Bearer ${intruderToken}`)
      .send({ bookingId: booking._id });

    expect(res.status).toBe(403);
  });
});

describe("Khalti - Verify", () => {
  it("marks the booking as paid when Khalti confirms Completed with matching amount", async () => {
    const token = await registerAndLogin("khaltiverify1@example.com");
    const booking = await createBooking(token); // totalPrice = 5000 * 4 = 20000

    mockLookup.mockResolvedValue({
      pidx: "test-pidx-456",
      total_amount: 2000000, // paisa -> 20000 NPR
      status: "Completed",
      transaction_id: "txn-123",
      fee: 0,
      refunded: false,
    });

    const res = await request(app)
      .get(`${KHALTI_API}/verify`)
      .query({ pidx: "test-pidx-456", bookingId: booking._id })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("paid");
  });

  it("does not mark as paid when Khalti status is not Completed", async () => {
    const token = await registerAndLogin("khaltiverify2@example.com");
    const booking = await createBooking(token);

    mockLookup.mockResolvedValue({
      pidx: "test-pidx-789",
      total_amount: 2000000,
      status: "Pending",
      transaction_id: null,
      fee: 0,
      refunded: false,
    });

    const res = await request(app)
      .get(`${KHALTI_API}/verify`)
      .query({ pidx: "test-pidx-789", bookingId: booking._id })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("Pending");
    expect(res.body.message).toMatch(/not completed/i);
  });

  it("rejects verify when the confirmed amount doesn't match the booking total", async () => {
    const token = await registerAndLogin("khaltiverify3@example.com");
    const booking = await createBooking(token); // totalPrice = 20000

    mockLookup.mockResolvedValue({
      pidx: "test-pidx-mismatch",
      total_amount: 500000, // 5000 NPR, doesn't match 20000
      status: "Completed",
      transaction_id: "txn-456",
      fee: 0,
      refunded: false,
    });

    const res = await request(app)
      .get(`${KHALTI_API}/verify`)
      .query({ pidx: "test-pidx-mismatch", bookingId: booking._id })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/does not match booking total/i);
  });

  it("rejects verify without pidx or bookingId", async () => {
    const token = await registerAndLogin("khaltiverify4@example.com");

    const res = await request(app)
      .get(`${KHALTI_API}/verify`)
      .query({ pidx: "only-pidx" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/pidx and bookingid are required/i);
  });

  it("rejects verify when the booking was already paid", async () => {
    const token = await registerAndLogin("khaltiverify5@example.com");
    const booking = await createBooking(token);

    mockLookup.mockResolvedValue({
      pidx: "pidx-first",
      total_amount: 2000000,
      status: "Completed",
      transaction_id: "txn-1",
      fee: 0,
      refunded: false,
    });

    await request(app)
      .get(`${KHALTI_API}/verify`)
      .query({ pidx: "pidx-first", bookingId: booking._id })
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .get(`${KHALTI_API}/verify`)
      .query({ pidx: "pidx-second", bookingId: booking._id })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already been paid/i);
  });
});