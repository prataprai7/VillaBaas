import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { VillaModel } from "../../models/villa.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";

const API = "/api/v1/admin/villas";

async function createAdminAndToken() {
  const hashedPassword = await bcryptjs.hash("adminpass123", 10);
  const admin = await UserModel.create({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    username: "adminuser",
    password: hashedPassword,
    role: "admin",
  });
  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    SECRET_KEY,
    { expiresIn: "1d" }
  );
  return token;
}

async function createRegularUserToken() {
  const hashedPassword = await bcryptjs.hash("userpass123", 10);
  const user = await UserModel.create({
    firstName: "Regular",
    lastName: "User",
    email: "regular@example.com",
    username: "regularuser",
    password: hashedPassword,
    role: "user",
  });
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: "1d" }
  );
  return token;
}

const fakeImage = Buffer.from("fake-image-content");

function buildVillaFormRequest(agentRequest: request.Test, overrides: Record<string, string> = {}) {
  const defaults: Record<string, string> = {
    name: "Sunset Villa",
    location: "Pokhara",
    address: "Lakeside, Pokhara",
    price: "15000",
    guests: "6",
    rooms: "3",
    baths: "2",
    type: "Villa",
    description: "A beautiful lakeside villa.",
    ...overrides,
  };

  let req = agentRequest;
  for (const [key, value] of Object.entries(defaults)) {
    req = req.field(key, value);
  }
  return req.attach("img", fakeImage, "villa.jpg");
}

describe("Admin Villa CRUD - Auth guarding", () => {
  it("rejects access without a token", async () => {
    const res = await request(app).get(API);
    expect(res.status).toBe(401);
  });

  it("rejects access for a non-admin user", async () => {
    const userToken = await createRegularUserToken();
    const res = await request(app)
      .get(API)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/admin access required/i);
  });
});

describe("Admin Villa CRUD - Create", () => {
  it("creates a villa successfully with a valid image and admin token", async () => {
    const token = await createAdminAndToken();

    const res = await buildVillaFormRequest(
      request(app).post(API).set("Authorization", `Bearer ${token}`)
    );

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Sunset Villa");
    expect(res.body.data.img).toMatch(/^\/uploads\//);
  });

  it("rejects creating a villa without a main image", async () => {
    const token = await createAdminAndToken();

    let req = request(app).post(API).set("Authorization", `Bearer ${token}`);
    const fields = {
      name: "No Image Villa",
      location: "Pokhara",
      address: "Lakeside",
      price: "10000",
      guests: "4",
      rooms: "2",
      baths: "1",
      type: "Villa",
      description: "Missing image test",
    };
    for (const [key, value] of Object.entries(fields)) {
      req = req.field(key, value);
    }

    const res = await req;

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/main villa image is required/i);
  });

  it("rejects creating a villa with missing required fields", async () => {
    const token = await createAdminAndToken();

    const res = await request(app)
      .post(API)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Incomplete Villa")
      .attach("img", fakeImage, "villa.jpg");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects creating a villa with a negative price", async () => {
    const token = await createAdminAndToken();

    const res = await buildVillaFormRequest(
      request(app).post(API).set("Authorization", `Bearer ${token}`),
      { price: "-500" }
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("Admin Villa CRUD - Read", () => {
  it("lists all villas with pagination for an admin", async () => {
    const token = await createAdminAndToken();
    await VillaModel.create({
      name: "Villa A", location: "Pokhara", address: "Lakeside", price: 10000,
      guests: 4, rooms: 2, baths: 1, type: "Villa", img: "/uploads/a.jpg",
      description: "Test villa",
    });

    const res = await request(app).get(API).set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it("gets a single villa by id for an admin", async () => {
    const token = await createAdminAndToken();
    const villa = await VillaModel.create({
      name: "Villa B", location: "Pokhara", address: "Lakeside", price: 10000,
      guests: 4, rooms: 2, baths: 1, type: "Villa", img: "/uploads/b.jpg",
      description: "Test villa",
    });

    const res = await request(app)
      .get(`${API}/${villa._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Villa B");
  });
});

describe("Admin Villa CRUD - Update", () => {
  it("updates a villa's fields successfully", async () => {
    const token = await createAdminAndToken();
    const villa = await VillaModel.create({
      name: "Old Name", location: "Pokhara", address: "Lakeside", price: 10000,
      guests: 4, rooms: 2, baths: 1, type: "Villa", img: "/uploads/old.jpg",
      description: "Old description",
    });

    const res = await request(app)
      .put(`${API}/${villa._id}`)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "New Name");

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("New Name");
  });

  it("replaces the image when a new one is uploaded during update", async () => {
    const token = await createAdminAndToken();
    const villa = await VillaModel.create({
      name: "Villa C", location: "Pokhara", address: "Lakeside", price: 10000,
      guests: 4, rooms: 2, baths: 1, type: "Villa", img: "/uploads/oldimg.jpg",
      description: "Test villa",
    });

    const res = await request(app)
      .put(`${API}/${villa._id}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("img", fakeImage, "newimg.jpg");

    expect(res.status).toBe(200);
    expect(res.body.data.img).not.toBe("/uploads/oldimg.jpg");
  });
});

describe("Admin Villa CRUD - Delete", () => {
  it("deletes a villa successfully", async () => {
    const token = await createAdminAndToken();
    const villa = await VillaModel.create({
      name: "To Delete", location: "Pokhara", address: "Lakeside", price: 10000,
      guests: 4, rooms: 2, baths: 1, type: "Villa", img: "/uploads/del.jpg",
      description: "Test villa",
    });

    const res = await request(app)
      .delete(`${API}/${villa._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});