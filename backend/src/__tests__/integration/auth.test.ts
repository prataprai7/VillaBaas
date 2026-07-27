import request from "supertest";
import app from "../../app";
const API = "/api/v1/auth";

const validUser = {
  firstName: "Pratap",
  lastName: "Rai",
  email: "pratap@example.com",
  password: "password123",
};

describe("Auth - Register", () => {
  it("registers a new user successfully", async () => {
    const res = await request(app).post(`${API}/register`).send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.data.email).toBe(validUser.email);
    expect(res.body.data.password).not.toBe(validUser.password); // should be hashed, not raw
  });

  it("rejects duplicate email registration", async () => {
    await request(app).post(`${API}/register`).send(validUser);
    const res = await request(app).post(`${API}/register`).send(validUser);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("rejects registration with missing firstName", async () => {
    const { firstName, ...incomplete } = validUser;
    const res = await request(app).post(`${API}/register`).send(incomplete);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects registration with invalid email format", async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .send({ ...validUser, email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects registration with password under 6 characters", async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .send({ ...validUser, email: "another@example.com", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects registration with missing password", async () => {
    const { password, ...incomplete } = validUser;
    const res = await request(app).post(`${API}/register`).send(incomplete);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("Auth - Login", () => {
  beforeEach(async () => {
    await request(app).post(`${API}/register`).send(validUser);
  });

  it("logs in successfully with correct credentials", async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(validUser.email);
  });

  it("rejects login with wrong password", async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ email: validUser.email, password: "wrongpassword" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it("rejects login for a non-existent email", async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ email: "doesnotexist@example.com", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it("rejects login with missing password field", async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ email: validUser.email });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects login with malformed email", async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ email: "not-an-email", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});