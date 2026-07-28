VillaBaas
VillaBaas is a full-stack luxury villa rental and booking platform I built for the Nepali market. It connects travelers with verified villa listings through real-time availability, secure payments, and an AI-powered assistant.
Live: villabaas.com.np / villa-baas.vercel.app

The Problem
Right now, renting a luxury villa in Nepal is a pretty fragmented experience. Listings are scattered across Facebook groups and WhatsApp chains, there's no reliable way to check real-time availability, and payments are usually handled through informal bank transfers with no instant confirmation.
I built VillaBaas to fix this. It's a unified platform with real listings, live availability, and a payment flow that confirms your booking the moment payment clears, using Khalti, which is already trusted across Nepal.

Features
-Villa listings with real MongoDB-backed data, image galleries, and Google Maps location embeds
-Booking system with real-time availability
-Khalti payment integration, going from initiate to redirect to server-side verification to confirmed    booking
-Authentication with signup/login, JWT sessions, and a forgot/reset password flow (SHA-256 hashed tokens, 15 minute expiry)
-AI assistant widget powered by Gemini, with a graceful fallback if the API fails
-Cross-platform mobile app built with Flutter using Riverpod, Hive, and Dio
Admin dashboard for managing villas and bookings, kept separate from the public-facing API

Tech Stack

Frontend (Web)
Next.js (App Router) with TypeScript
Inline styling, except the auth route group which uses CSS Modules

Backend
Express with TypeScript
Layered architecture: Controller to Service to Repository
Mongoose for MongoDB, Zod for validation, JWT for auth, Multer for uploads, Nodemailer for emails

Database and Infra

-MongoDB Atlas
-Frontend deployed on Vercel
-Backend deployed on Render
-Domain (villabaas.com.np) managed through Cloudflare

Architecture
The Next.js client talks to the Express API, which is organized as Controller to Service to Repository and connects to MongoDB Atlas. The backend also integrates with Khalti for payments and Gemini for the AI assistant. The Flutter mobile app talks to the same Express API as the web client.

Every API response follows the same structure:
status, success, message, data