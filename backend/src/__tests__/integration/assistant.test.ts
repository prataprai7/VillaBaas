import request from "supertest";
import app from "../../app";
import { VillaModel } from "../../models/villa.model";

const API = "/api/v1/assistant";

jest.mock("../../services/gemini.service", () => ({
  extractFilters: jest.fn(),
  generateReply: jest.fn(),
}));

import { extractFilters, generateReply } from "../../services/gemini.service";

const mockExtractFilters = extractFilters as jest.Mock;
const mockGenerateReply = generateReply as jest.Mock;

function makeVilla(overrides = {}) {
  return {
    name: "Sunset Villa",
    location: "Pokhara",
    address: "Lakeside, Pokhara",
    price: 15000,
    guests: 6,
    rooms: 3,
    baths: 2,
    type: "Lakeside",
    img: "/uploads/sunset.jpg",
    description: "A beautiful lakeside villa.",
    isActive: true,
    ...overrides,
  };
}

beforeEach(() => {
  mockExtractFilters.mockReset();
  mockGenerateReply.mockReset();
});

describe("Assistant Chat", () => {
  it("rejects an empty message", async () => {
    const res = await request(app).post(`${API}/chat`).send({ message: "" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/message is required/i);
  });

  it("rejects a whitespace-only message", async () => {
    const res = await request(app).post(`${API}/chat`).send({ message: "   " });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects a request with no message field at all", async () => {
    const res = await request(app).post(`${API}/chat`).send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("answers a general question without returning any villas", async () => {
    mockExtractFilters.mockResolvedValue({
      location: null, minPrice: null, maxPrice: null, guests: null, type: null,
      isGeneralQuestion: true,
    });
    mockGenerateReply.mockResolvedValue("You can cancel a booking from the Bookings page.");

    const res = await request(app).post(`${API}/chat`).send({ message: "how do I cancel a booking?" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toMatch(/cancel/i);
    expect(res.body.data.villas).toEqual([]);
  });

  it("returns matching villas for a location-based search", async () => {
    await VillaModel.create(makeVilla({ name: "Pokhara Villa", location: "Pokhara" }));
    await VillaModel.create(makeVilla({ name: "Kathmandu Villa", location: "Kathmandu" }));

    mockExtractFilters.mockResolvedValue({
      location: "Pokhara", minPrice: null, maxPrice: null, guests: null, type: null,
      isGeneralQuestion: false,
    });
    mockGenerateReply.mockResolvedValue("Here are some great villas in Pokhara!");

    const res = await request(app).post(`${API}/chat`).send({ message: "villas in Pokhara" });

    expect(res.status).toBe(200);
    expect(res.body.data.villas.length).toBe(1);
    expect(res.body.data.villas[0].name).toBe("Pokhara Villa");
  });

  it("filters out inactive villas from search results", async () => {
    await VillaModel.create(makeVilla({ name: "Active Villa", isActive: true }));
    await VillaModel.create(makeVilla({ name: "Inactive Villa", isActive: false }));

    mockExtractFilters.mockResolvedValue({
      location: null, minPrice: null, maxPrice: null, guests: null, type: null,
      isGeneralQuestion: false,
    });
    mockGenerateReply.mockResolvedValue("Here are some options!");

    const res = await request(app).post(`${API}/chat`).send({ message: "show me villas" });

    expect(res.status).toBe(200);
    const names = res.body.data.villas.map((v: any) => v.name);
    expect(names).toContain("Active Villa");
    expect(names).not.toContain("Inactive Villa");
  });

  it("respects a maxPrice filter", async () => {
    await VillaModel.create(makeVilla({ name: "Cheap Villa", price: 5000 }));
    await VillaModel.create(makeVilla({ name: "Expensive Villa", price: 50000 }));

    mockExtractFilters.mockResolvedValue({
      location: null, minPrice: null, maxPrice: 10000, guests: null, type: null,
      isGeneralQuestion: false,
    });
    mockGenerateReply.mockResolvedValue("Found some budget-friendly options!");

    const res = await request(app).post(`${API}/chat`).send({ message: "villas under 10000" });

    expect(res.status).toBe(200);
    const names = res.body.data.villas.map((v: any) => v.name);
    expect(names).toContain("Cheap Villa");
    expect(names).not.toContain("Expensive Villa");
  });

  it("returns an empty villa list gracefully when nothing matches", async () => {
    await VillaModel.create(makeVilla({ location: "Pokhara" }));

    mockExtractFilters.mockResolvedValue({
      location: "Everest Base Camp", minPrice: null, maxPrice: null, guests: null, type: null,
      isGeneralQuestion: false,
    });
    mockGenerateReply.mockResolvedValue("No villas matched — try a different location or budget!");

    const res = await request(app).post(`${API}/chat`).send({ message: "villas near Everest Base Camp" });

    expect(res.status).toBe(200);
    expect(res.body.data.villas).toEqual([]);
    expect(res.body.data.reply).toMatch(/no villas matched|try a different/i);
  });

  it("degrades gracefully with the fallback message when Gemini fails", async () => {
    mockExtractFilters.mockResolvedValue({
      location: null, minPrice: null, maxPrice: null, guests: null, type: null,
      isGeneralQuestion: true,
    });
    mockGenerateReply.mockResolvedValue(
      "Our AI assistant is temporarily unavailable right now. You can still browse and filter villas directly on the Villas page in the meantime — sorry for the hassle!"
    );

    const res = await request(app).post(`${API}/chat`).send({ message: "hello" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toMatch(/temporarily unavailable/i);
  });
});