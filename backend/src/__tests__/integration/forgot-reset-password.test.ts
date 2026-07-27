import request from "supertest";
import app from "../../app";

const API = "/api/v1/auth";

// Mock the email module so forgotPassword doesn't hit the real Resend API.
// We capture the resetUrl argument to extract the raw token for reset tests.
jest.mock("../../configs/email", () => ({
  sendPasswordResetEmail: jest.fn(),
}));

import { sendPasswordResetEmail } from "../../configs/email";

const mockedSendEmail = sendPasswordResetEmail as jest.Mock;

const testUser = {
  firstName: "Pratap",
  lastName: "Rai",
  email: "resettest@example.com",
  password: "password123",
};

function extractTokenFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

describe("Auth - Forgot Password", () => {
  beforeEach(async () => {
    mockedSendEmail.mockClear();
    await request(app).post(`${API}/register`).send(testUser);
  });

  it("sends a reset email for an existing account", async () => {
    const res = await request(app)
      .post(`${API}/forgot-password`)
      .send({ email: testUser.email });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockedSendEmail).toHaveBeenCalledTimes(1);
  });

  it("returns the same success response for a non-existent email (no enumeration)", async () => {
    const res = await request(app)
      .post(`${API}/forgot-password`)
      .send({ email: "doesnotexist@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it("rejects an invalid email format", async () => {
    const res = await request(app)
      .post(`${API}/forgot-password`)
      .send({ email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });
});

describe("Auth - Reset Password", () => {
  let rawToken: string;

  beforeEach(async () => {
    mockedSendEmail.mockClear();
    await request(app).post(`${API}/register`).send(testUser);
    await request(app).post(`${API}/forgot-password`).send({ email: testUser.email });

    const resetUrl = mockedSendEmail.mock.calls[0][1]; // (to, resetUrl, firstName)
    rawToken = extractTokenFromUrl(resetUrl);
  });

  it("resets the password successfully with a valid token", async () => {
    const res = await request(app)
      .post(`${API}/reset-password/${rawToken}`)
      .send({ password: "NewPass123", confirmPassword: "NewPass123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/reset successfully/i);
  });

  it("allows login with the new password after reset", async () => {
    await request(app)
      .post(`${API}/reset-password/${rawToken}`)
      .send({ password: "NewPass123", confirmPassword: "NewPass123" });

    const loginRes = await request(app)
      .post(`${API}/login`)
      .send({ email: testUser.email, password: "NewPass123" });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.token).toBeDefined();
  });

  it("rejects reset with an invalid/expired token", async () => {
    const res = await request(app)
      .post(`${API}/reset-password/invalidtoken1234567890`)
      .send({ password: "NewPass123", confirmPassword: "NewPass123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid or has expired/i);
  });

  it("rejects reset when passwords do not match", async () => {
    const res = await request(app)
      .post(`${API}/reset-password/${rawToken}`)
      .send({ password: "NewPass123", confirmPassword: "Different123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects a password missing an uppercase letter", async () => {
    const res = await request(app)
      .post(`${API}/reset-password/${rawToken}`)
      .send({ password: "newpass123", confirmPassword: "newpass123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects a password missing a number", async () => {
    const res = await request(app)
      .post(`${API}/reset-password/${rawToken}`)
      .send({ password: "NewPassword", confirmPassword: "NewPassword" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});