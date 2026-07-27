import request from "supertest";
import app from "../../app";

const API = "/api/v1/auth/bookings";
const AUTH_API = "/api/v1/auth";

jest.mock("../../services/email.service", () => ({
  sendBookingConfirmationEmail: jest.fn(),
  sendBookingCancellationEmail: jest.fn(),
}));

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

function makeBookingPayload(overrides = {}) {
  return {
    villaName: "Sunset Villa",
    villaType: "Villa",
    location: "Pokhara",
    image: "/uploads/sunset.jpg",
    checkIn: "2026-09-01",
    checkOut: "2026-09-05",
    guests: 4,
    pricePerNight: 5000,
    ...overrides,
  };
}

describe("Bookings - Create", () => {
  it("rejects creating a booking without auth token", async () => {
    const res = await request(app).post(API).send(makeBookingPayload());

    expect(res.status).toBe(401);
  });

  it("creates a booking successfully with a valid token", async () => {
    const token = await registerAndLogin("booker1@example.com");

    const res = await request(app)
      .post(API)
      .set("Authorization", `Bearer ${token}`)
      .send(makeBookingPayload());

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nights).toBe(4);
    expect(res.body.data.totalPrice).toBe(20000);
    expect(res.body.data.status).toBe("unpaid");
  });

  it("rejects a booking where check-out is before check-in", async () => {
    const token = await registerAndLogin("booker2@example.com");

    const res = await request(app)
      .post(API)
      .set("Authorization", `Bearer ${token}`)
      .send(makeBookingPayload({ checkIn: "2026-09-10", checkOut: "2026-09-05" }));

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/check-out must be after check-in/i);
  });
});

describe("Bookings - Get my bookings", () => {
  it("only returns bookings belonging to the logged-in user", async () => {
    const tokenA = await registerAndLogin("usera@example.com");
    const tokenB = await registerAndLogin("userb@example.com");

    await request(app).post(API).set("Authorization", `Bearer ${tokenA}`).send(makeBookingPayload());
    await request(app).post(API).set("Authorization", `Bearer ${tokenB}`).send(makeBookingPayload());
    await request(app).post(API).set("Authorization", `Bearer ${tokenB}`).send(makeBookingPayload());

    const res = await request(app).get(`${API}/my`).set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });
});

describe("Bookings - Get by id", () => {
  it("returns a booking by id for its owner", async () => {
    const token = await registerAndLogin("owner@example.com");
    const created = await request(app)
      .post(API)
      .set("Authorization", `Bearer ${token}`)
      .send(makeBookingPayload());

    const res = await request(app)
      .get(`${API}/${created.body.data._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(created.body.data._id);
  });

  it("returns 403 when a different user tries to access someone else's booking", async () => {
    const ownerToken = await registerAndLogin("realowner@example.com");
    const intruderToken = await registerAndLogin("intruder@example.com");

    const created = await request(app)
      .post(API)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send(makeBookingPayload());

    const res = await request(app)
      .get(`${API}/${created.body.data._id}`)
      .set("Authorization", `Bearer ${intruderToken}`);

    expect(res.status).toBe(403);
  });
});

describe("Bookings - Pay", () => {
  it("marks a booking as paid with a valid payment method", async () => {
    const token = await registerAndLogin("payer@example.com");
    const created = await request(app)
      .post(API)
      .set("Authorization", `Bearer ${token}`)
      .send(makeBookingPayload());

    const res = await request(app)
      .patch(`${API}/${created.body.data._id}/pay`)
      .set("Authorization", `Bearer ${token}`)
      .send({ paymentMethod: "khalti" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("paid");
  });

  it("rejects payment without a paymentMethod", async () => {
    const token = await registerAndLogin("payer2@example.com");
    const created = await request(app)
      .post(API)
      .set("Authorization", `Bearer ${token}`)
      .send(makeBookingPayload());

    const res = await request(app)
      .patch(`${API}/${created.body.data._id}/pay`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/paymentmethod is required/i);
  });
});

describe("Bookings - Cancel", () => {
  it("cancels an unpaid booking successfully", async () => {
    const token = await registerAndLogin("canceller@example.com");
    const created = await request(app)
      .post(API)
      .set("Authorization", `Bearer ${token}`)
      .send(makeBookingPayload());

    const res = await request(app)
      .patch(`${API}/${created.body.data._id}/cancel`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("cancelled");
  });

  it("rejects cancelling an already-paid booking", async () => {
    const token = await registerAndLogin("canceller2@example.com");
    const created = await request(app)
      .post(API)
      .set("Authorization", `Bearer ${token}`)
      .send(makeBookingPayload());

    await request(app)
      .patch(`${API}/${created.body.data._id}/pay`)
      .set("Authorization", `Bearer ${token}`)
      .send({ paymentMethod: "khalti" });

    const res = await request(app)
      .patch(`${API}/${created.body.data._id}/cancel`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/cannot cancel a paid booking/i);
  });
});