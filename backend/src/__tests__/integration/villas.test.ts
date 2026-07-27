import request from "supertest";
import app from "../../app";
import { VillaModel } from "../../models/villa.model";
import mongoose from "mongoose";

const API = "/api/v1/villas";

function makeVilla(overrides = {}) {
  return {
    name: "Sunset Villa",
    location: "Pokhara",
    address: "Lakeside, Pokhara",
    price: 15000,
    guests: 6,
    rooms: 3,
    baths: 2,
    type: "Villa",
    img: "/uploads/sunset.jpg",
    description: "A beautiful lakeside villa.",
    isActive: true,
    ...overrides,
  };
}

describe("Public Villa API - List", () => {
  it("returns an empty list when no villas exist", async () => {
    const res = await request(app).get(API);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("returns villas after seeding", async () => {
    await VillaModel.create(makeVilla({ name: "Sunset Villa" }));
    await VillaModel.create(makeVilla({ name: "Mountain View Villa" }));

    const res = await request(app).get(API);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("respects the limit query parameter", async () => {
    for (let i = 0; i < 5; i++) {
      await VillaModel.create(makeVilla({ name: `Villa ${i}` }));
    }

    const res = await request(app).get(`${API}?limit=2`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("filters villas by search term", async () => {
    await VillaModel.create(makeVilla({ name: "Sunset Villa" }));
    await VillaModel.create(makeVilla({ name: "Mountain View Villa" }));

    const res = await request(app).get(`${API}?search=Sunset`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe("Sunset Villa");
  });

  it("returns pagination metadata", async () => {
    await VillaModel.create(makeVilla({ name: "Villa A" }));

    const res = await request(app).get(API);

    expect(res.status).toBe(200);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.total).toBe(1);
  });
});

describe("Public Villa API - Single villa", () => {
  it("returns a villa by valid id", async () => {
    const villa = await VillaModel.create(makeVilla({ name: "Sunset Villa" }));

    const res = await request(app).get(`${API}/${villa._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Sunset Villa");
  });

  it("rejects an invalid villa id format", async () => {
    const res = await request(app).get(`${API}/not-a-valid-id`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid villa id/i);
  });

  it("returns 404 for a valid but non-existent villa id", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`${API}/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});