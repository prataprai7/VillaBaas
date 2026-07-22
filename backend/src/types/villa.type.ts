import { z } from "zod";

export const VillaSchema = z.object({
    name:              z.string().min(1, "Name is required"),
    location:          z.string().min(1, "Location is required"),
    address:           z.string().min(1, "Address is required"),
    price:             z.coerce.number().positive("Price must be positive"),
    guests:            z.coerce.number().int().positive("Guests must be a positive integer"),
    rooms:             z.coerce.number().int().positive("Rooms must be a positive integer"),
    baths:             z.coerce.number().int().positive("Baths must be a positive integer"),
    tag:               z.enum(["popular", "new", "immediate"]).default("new"),
    type:              z.string().min(1, "Type is required"),
    amenities:         z.array(z.string()).default([]),
    breakfastIncluded: z.coerce.boolean().default(false),
    dinnerIncluded:    z.coerce.boolean().default(false),
    description:       z.string().min(1, "Description is required"),
    houseRules:        z.array(z.string()).default([]),
    isActive:          z.coerce.boolean().default(true),
    // img / additionalImages are set from uploaded files in the controller,
    // not from the request body — so they're not part of the create/update DTO input.
});

export type VillaType = z.infer<typeof VillaSchema>;