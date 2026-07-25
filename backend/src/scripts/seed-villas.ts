import mongoose from "mongoose";
import dotenv from "dotenv";
import { VillaModel } from "../models/villa.model";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/villabaas-db";

const SEED_VILLAS = [
  {
    name: "Methlang Villa",
    location: "Pokhara, Nepal",
    address: "Lakeside, Pokhara-6, Kaski, Nepal",
    price: 17600,
    rating: 4.6,
    reviews: 92,
    guests: 12,
    rooms: 4,
    baths: 2,
    tag: "popular",
    type: "Villa",
    img: "https://l.icdbcdn.com/oh/bae4bc48-3f95-4610-b83e-0e02eb91110e.jpg",
    additionalImages: [],
    amenities: ["Pool", "Mountain View", "WiFi", "Kitchen"],
    breakfastIncluded: true,
    dinnerIncluded: true,
    description: "A stunning hillside villa in Pokhara offering panoramic mountain views, a private pool, and easy access to Lakeside's restaurants and shops.",
    houseRules: ["No smoking indoors", "No parties or events", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
  {
    name: "The Hideout Villa",
    location: "Pokhara, Nepal",
    address: "Sarangkot Road, Pokhara-15, Kaski, Nepal",
    price: 15200,
    rating: 4.5,
    reviews: 68,
    guests: 8,
    rooms: 4,
    baths: 2,
    tag: "immediate",
    type: "Villa",
    img: "https://villathehideoutpokhara.np-hotel.com/data/Photos/OriginalPhoto/15839/1583906/1583906483/photo-the-hideout-villa-pokhara-pokhara-5.JPEG",
    additionalImages: [],
    amenities: ["WiFi", "Lake View", "Kitchen", "Air Conditioning"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description: "A tranquil retreat overlooking Phewa Lake, perfect for groups seeking privacy and calm away from the city bustle.",
    houseRules: ["No smoking indoors", "Quiet hours after 10 PM", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
  {
    name: "Villa Karma Pokhara",
    location: "Pokhara, Nepal",
    address: "Khapaudi, Pokhara-30, Kaski, Nepal",
    price: 14200,
    rating: 4.5,
    reviews: 54,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "new",
    type: "Villa",
    img: "https://a0.muscache.com/im/pictures/miso/Hosting-1135974458065631357/original/b39e7d07-95cf-40fb-828b-5ae4dd376397.jpeg?im_w=1440",
    additionalImages: [],
    amenities: ["WiFi", "Lake View", "Garden", "Parking"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description: "A newly listed garden villa with sweeping lake views, ideal for small family getaways or a peaceful couples retreat.",
    houseRules: ["No smoking indoors", "No pets", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
  {
    name: "The Pipal Tree",
    location: "Kathmandu, Nepal",
    address: "Budhanilkantha, Kathmandu, Nepal",
    price: 12400,
    rating: 4.3,
    reviews: 41,
    guests: 8,
    rooms: 3,
    baths: 2,
    tag: "new",
    type: "Villa",
    img: "https://media.vrbo.com/lodging/100000000/99800000/99794400/99794388/9ead10f2.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    additionalImages: [],
    amenities: ["WiFi", "Kitchen", "Garden", "Parking"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description: "A cozy garden villa nestled at the foot of the Shivapuri hills, offering quiet mornings and easy access to central Kathmandu.",
    houseRules: ["No smoking indoors", "No parties or events", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
  {
    name: "Villa De Amore",
    location: "Kathmandu, Nepal",
    address: "Budhanilkantha, Kathmandu, Nepal",
    price: 19500,
    rating: 4.8,
    reviews: 116,
    guests: 10,
    rooms: 4,
    baths: 3,
    tag: "immediate",
    type: "Villa",
    img: "https://www.villasnepal.com/storage/802/conversions/01KWTWP3A7QH4BZMQXAXNDW9Y8-hero_avif.webp",
    additionalImages: [],
    amenities: ["Pool", "WiFi", "Kitchen", "Mountain View"],
    breakfastIncluded: true,
    dinnerIncluded: false,
    description: "An elegant villa with a private pool and mountain views, a favorite among guests celebrating anniversaries and special occasions.",
    houseRules: ["No smoking indoors", "No parties or events", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
  {
    name: "Archid Villa",
    location: "Nagarkot, Nepal",
    address: "Nagarkot-7, Bhaktapur, Nepal",
    price: 24000,
    rating: 4.7,
    reviews: 88,
    guests: 12,
    rooms: 5,
    baths: 3,
    tag: "popular",
    type: "Villa",
    img: "https://archidvilla.com/wp-content/uploads/2026/05/6.jpeg",
    additionalImages: [],
    amenities: ["WiFi", "Pool", "Kitchen", "Mountain View", "Heating"],
    breakfastIncluded: true,
    dinnerIncluded: true,
    description: "A spacious villa in Nagarkot known for sunrise Himalayan views, perfect for large group retreats and family reunions.",
    houseRules: ["No smoking indoors", "Quiet hours after 10 PM", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
  {
    name: "Farmhouse In Dhulikhel",
    location: "Kathmandu, Nepal",
    address: "Dhulikhel, Kavrepalanchok, Nepal",
    price: 9500,
    rating: 4.9,
    reviews: 34,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "popular",
    type: "Farmhouse",
    img: "https://www.villasnepal.com/storage/213/conversions/01KCR3VQMHGZC8RC5HFJW17D36-hero_avif.webp",
    additionalImages: [],
    amenities: ["WiFi", "Fireplace", "Heater", "Kitchen"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description: "A charming countryside farmhouse near Dhulikhel offering cozy fireplace evenings and fresh mountain air.",
    houseRules: ["No smoking indoors", "No pets", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
  {
    name: "Bella Vista Thecho",
    location: "Kathmandu, Nepal",
    address: "Thecho, Lalitpur, Nepal",
    price: 11500,
    rating: 4.6,
    reviews: 72,
    guests: 10,
    rooms: 4,
    baths: 4,
    tag: "popular",
    type: "Villa",
    img: "https://www.villasnepal.com/storage/890/conversions/01KXSRPJ7HWBMGA4YRMQGMQF7D-hero_avif.webp",
    additionalImages: [],
    amenities: ["WiFi", "Air Conditioning", "Garden", "Restaurant"],
    breakfastIncluded: true,
    dinnerIncluded: true,
    description: "A well-appointed villa in Thecho with a garden and on-site restaurant, popular for weekend family gatherings.",
    houseRules: ["No smoking indoors", "No parties or events", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
  {
    name: "Leopard Villa at Tiger Palace by Soaltee",
    location: "Lumbini, Nepal",
    address: "Tiger Palace Resort, Bhairahawa, Lumbini, Nepal",
    price: 7500,
    rating: 4.7,
    reviews: 29,
    guests: 5,
    rooms: 2,
    baths: 2,
    tag: "immediate",
    type: "Villa",
    img: "https://www.villasnepal.com/storage/330/conversions/01KHWRQJY78ARMKX5KVWWGX712-thumb_avif.webp",
    additionalImages: [],
    amenities: ["WiFi", "Meditation Space", "Bicycles"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description: "A peaceful villa near Lumbini, the birthplace of Buddha, with meditation spaces and bicycles for exploring the resort grounds.",
    houseRules: ["No smoking indoors", "Quiet hours after 9 PM", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
  {
    name: "Farmhouse In Nagarkot",
    location: "Nagarkot, Nepal",
    address: "Nagarkot-4, Bhaktapur, Nepal",
    price: 8900,
    rating: 4.4,
    reviews: 47,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "new",
    type: "Farmhouse",
    img: "https://www.villasnepal.com/storage/364/conversions/01KK6B9NDV1YBWNYNE92DGEPNS-hero_avif.webp",
    additionalImages: [],
    amenities: ["WiFi", "Garden Terrace", "Tea Tasting", "Kitchen"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description: "A rustic farmhouse in Nagarkot with a garden terrace, known for its tea-tasting sessions and sweeping valley views.",
    houseRules: ["No smoking indoors", "No pets", "Check-in after 2 PM", "Check-out before 11 AM"],
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB:", MONGODB_URL);

    const names = SEED_VILLAS.map(v => v.name);
    const existing = await VillaModel.find({ name: { $in: names } }).select("name");
    const existingNames = new Set(existing.map(v => v.name));

    const toInsert = SEED_VILLAS.filter(v => !existingNames.has(v.name));

    if (toInsert.length === 0) {
      console.log("All seed villas already exist. Nothing to insert.");
    } else {
      const inserted = await VillaModel.insertMany(toInsert);
      console.log(`Inserted ${inserted.length} villas:`);
      inserted.forEach(v => console.log(` - ${v.name} (${v._id})`));
    }

    if (existingNames.size > 0) {
      console.log(`Skipped ${existingNames.size} villas that already exist:`, [...existingNames]);
    }
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seed();