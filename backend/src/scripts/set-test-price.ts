// Run once to make villa #9 cheap enough for the Khalti sandbox test wallet:
// npx ts-node src/scripts/set-test-price.ts
//
// Run again with REVERT=true to restore the original price:
// REVERT=true npx ts-node src/scripts/set-test-price.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { VillaModel } from "../models/villa.model";

dotenv.config();

const VILLA_ID = 9; // Leopard Villa at Tiger Palace — normally NPR 7,500/night
const TEST_PRICE = 10; // NPR 10/night — well within sandbox wallet balance
const ORIGINAL_PRICE = 7500;

async function run() {
  const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/villabaas-db";
  await mongoose.connect(mongoUrl);

  const isRevert = process.env.REVERT === "true";
  const newPrice = isRevert ? ORIGINAL_PRICE : TEST_PRICE;

  const result = await VillaModel.updateOne({ id: VILLA_ID }, { $set: { price: newPrice } });

  if (result.matchedCount === 0) {
    console.log(`No villa found with id ${VILLA_ID} — did you run the seed script yet?`);
  } else {
    console.log(`Villa #${VILLA_ID} price set to NPR ${newPrice}${isRevert ? " (reverted)" : " (test mode)"}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});