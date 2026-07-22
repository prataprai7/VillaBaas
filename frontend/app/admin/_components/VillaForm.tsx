"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { handleCreateVilla } from "@/lib/actions/admin/villa-action";

const CreateSchema = z.object({
    name:              z.string().min(1, "Name is required"),
    location:          z.string().min(1, "Location is required"),
    address:           z.string().min(1, "Address is required"),
    price:             z.coerce.number().positive("Price must be positive"),
    guests:            z.coerce.number().int().positive("Guests must be a positive integer"),
    rooms:             z.coerce.number().int().positive("Rooms must be a positive integer"),
    baths:             z.coerce.number().int().positive("Baths must be a positive integer"),
    tag:               z.enum(["popular", "new", "immediate"]),
    type:              z.string().min(1, "Type is required"),
    description:       z.string().min(1, "Description is required"),
    amenities:         z.string().optional(),
    houseRules:        z.string().optional(),
    breakfastIncluded: z.boolean(),
    dinnerIncluded:    z.boolean(),
});

type CreateInput = z.infer<typeof CreateSchema>;
type FieldErrors = Partial<Record<keyof CreateInput, string>>;

const inp: React.CSSProperties = {
    width: "100%", height: 48, border: "1.5px solid #E8E2D9",
    borderRadius: 8, padding: "0 14px", fontSize: "0.875rem",
    color: "#1a1a1a", background: "#FAF7F2", outline: "none",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
};

const textarea: React.CSSProperties = {
    ...inp, height: "auto", minHeight: 90, padding: "12px 14px",
    resize: "vertical", lineHeight: 1.5,
};

const lbl: React.CSSProperties = {
    display: "block", fontSize: "0.72rem", fontWeight: 600,
    color: "#3D3D3D", marginBottom: "0.4rem",
    letterSpacing: "0.08em", textTransform: "uppercase",
};

const err: React.CSSProperties = {
    fontSize: "0.7rem", color: "#C0392B", marginTop: 4,
};

export default function VillaForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState<CreateInput>({
        name: "", location: "", address: "", price: 0,
        guests: 1, rooms: 1, baths: 1, tag: "new", type: "",
        description: "", amenities: "", houseRules: "",
        breakfastIncluded: false, dinnerIncluded: false,
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [globalError, setGlobalError] = useState("");

    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    const imgRef = useRef<HTMLInputElement>(null);

    function handleChange(field: keyof CreateInput, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }));
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }

    function handleImgChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImgFile(file);
        setImgPreview(URL.createObjectURL(file));
    }

    function handleAdditionalChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAdditionalFiles(Array.from(e.target.files || []));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setGlobalError("");

        const parsed = CreateSchema.safeParse(form);
        if (!parsed.success) {
            const errors: FieldErrors = {};
            parsed.error.issues.forEach(i => {
                const f = i.path[0] as keyof FieldErrors;
                if (!errors[f]) errors[f] = i.message;
            });
            setFieldErrors(errors);
            return;
        }

        if (!imgFile) {
            setGlobalError("A main villa image is required");
            return;
        }

        startTransition(async () => {
            const fd = new FormData();
            fd.append("name", parsed.data.name);
            fd.append("location", parsed.data.location);
            fd.append("address", parsed.data.address);
            fd.append("price", String(parsed.data.price));
            fd.append("guests", String(parsed.data.guests));
            fd.append("rooms", String(parsed.data.rooms));
            fd.append("baths", String(parsed.data.baths));
            fd.append("tag", parsed.data.tag);
            fd.append("type", parsed.data.type);
            fd.append("description", parsed.data.description);
            fd.append("breakfastIncluded", String(parsed.data.breakfastIncluded));
            fd.append("dinnerIncluded", String(parsed.data.dinnerIncluded));

            // Split comma-separated text into individual array items,
            // matching what Zod's z.array(z.string()) expects on the backend.
            (parsed.data.amenities || "")
                .split(",").map(s => s.trim()).filter(Boolean)
                .forEach(a => fd.append("amenities", a));

            (parsed.data.houseRules || "")
                .split(",").map(s => s.trim()).filter(Boolean)
                .forEach(r => fd.append("houseRules", r));

            fd.append("img", imgFile);
            additionalFiles.forEach(f => fd.append("additionalImages", f));

            const result = await handleCreateVilla(fd);
            if (!result.success) {
                setGlobalError(result.message || "Failed to create villa");
                return;
            }
            router.push("/admin/villas");
            router.refresh();
        });
    }

    return (
        <div style={{ maxWidth: 600 }}>
            {globalError && (
                <div style={{
                    background: "#FDF0EE", border: "1px solid rgba(192,57,43,0.25)",
                    borderRadius: 8, padding: "10px 14px",
                    fontSize: "0.82rem", color: "#C0392B", marginBottom: "1.25rem",
                }}>
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: "1.5rem" }}>
                    <div
                        onClick={() => imgRef.current?.click()}
                        style={{
                            width: "100%", height: 160, borderRadius: 12,
                            overflow: "hidden", cursor: "pointer",
                            border: "1.5px dashed #C9A96E",
                            background: "#FAF7F2",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            marginBottom: "0.5rem",
                        }}
                    >
                        {imgPreview ? (
                            <img src={imgPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <span style={{ fontSize: "0.82rem", color: "#C9A96E", fontWeight: 600 }}>
                                Click to upload main villa image
                            </span>
                        )}
                    </div>
                    <input ref={imgRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleImgChange} />
                    <p style={{ fontSize: "0.72rem", color: "#aaa" }}>Required — JPEG or PNG, max 5MB</p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Additional Images (optional)</label>
                    <input type="file" accept="image/jpeg,image/png" multiple onChange={handleAdditionalChange} style={{ fontSize: "0.82rem" }} />
                    {additionalFiles.length > 0 && (
                        <p style={{ fontSize: "0.72rem", color: "#aaa", marginTop: 4 }}>{additionalFiles.length} file(s) selected</p>
                    )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Villa Name</label>
                    <input style={{ ...inp, borderColor: fieldErrors.name ? "#C0392B" : "#E8E2D9" }}
                        type="text" placeholder="Methlang Villa"
                        value={form.name}
                        onChange={e => handleChange("name", e.target.value)}
                    />
                    {fieldErrors.name && <p style={err}>{fieldErrors.name}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <label style={lbl}>Location</label>
                        <input style={{ ...inp, borderColor: fieldErrors.location ? "#C0392B" : "#E8E2D9" }}
                            type="text" placeholder="Pokhara, Nepal"
                            value={form.location}
                            onChange={e => handleChange("location", e.target.value)}
                        />
                        {fieldErrors.location && <p style={err}>{fieldErrors.location}</p>}
                    </div>
                    <div>
                        <label style={lbl}>Type</label>
                        <input style={{ ...inp, borderColor: fieldErrors.type ? "#C0392B" : "#E8E2D9" }}
                            type="text" placeholder="Lakeside"
                            value={form.type}
                            onChange={e => handleChange("type", e.target.value)}
                        />
                        {fieldErrors.type && <p style={err}>{fieldErrors.type}</p>}
                    </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Address</label>
                    <input style={{ ...inp, borderColor: fieldErrors.address ? "#C0392B" : "#E8E2D9" }}
                        type="text" placeholder="Lakeside, Pokhara, Gandaki"
                        value={form.address}
                        onChange={e => handleChange("address", e.target.value)}
                    />
                    {fieldErrors.address && <p style={err}>{fieldErrors.address}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <label style={lbl}>Price/Night</label>
                        <input style={{ ...inp, borderColor: fieldErrors.price ? "#C0392B" : "#E8E2D9" }}
                            type="number" min={0}
                            value={form.price}
                            onChange={e => handleChange("price", e.target.value)}
                        />
                        {fieldErrors.price && <p style={err}>{fieldErrors.price}</p>}
                    </div>
                    <div>
                        <label style={lbl}>Guests</label>
                        <input style={{ ...inp, borderColor: fieldErrors.guests ? "#C0392B" : "#E8E2D9" }}
                            type="number" min={1}
                            value={form.guests}
                            onChange={e => handleChange("guests", e.target.value)}
                        />
                        {fieldErrors.guests && <p style={err}>{fieldErrors.guests}</p>}
                    </div>
                    <div>
                        <label style={lbl}>Rooms</label>
                        <input style={{ ...inp, borderColor: fieldErrors.rooms ? "#C0392B" : "#E8E2D9" }}
                            type="number" min={1}
                            value={form.rooms}
                            onChange={e => handleChange("rooms", e.target.value)}
                        />
                        {fieldErrors.rooms && <p style={err}>{fieldErrors.rooms}</p>}
                    </div>
                    <div>
                        <label style={lbl}>Baths</label>
                        <input style={{ ...inp, borderColor: fieldErrors.baths ? "#C0392B" : "#E8E2D9" }}
                            type="number" min={1}
                            value={form.baths}
                            onChange={e => handleChange("baths", e.target.value)}
                        />
                        {fieldErrors.baths && <p style={err}>{fieldErrors.baths}</p>}
                    </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Tag</label>
                    <select style={inp}
                        value={form.tag}
                        onChange={e => handleChange("tag", e.target.value)}
                    >
                        <option value="new">New</option>
                        <option value="popular">Popular</option>
                        <option value="immediate">Immediate</option>
                    </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Description</label>
                    <textarea style={textarea}
                        placeholder="A short, appealing description of the villa..."
                        value={form.description}
                        onChange={e => handleChange("description", e.target.value)}
                    />
                    {fieldErrors.description && <p style={err}>{fieldErrors.description}</p>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Amenities (comma-separated)</label>
                    <input style={inp}
                        type="text" placeholder="Pool, WiFi, Kitchen, Parking"
                        value={form.amenities}
                        onChange={e => handleChange("amenities", e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={lbl}>House Rules (comma-separated)</label>
                    <input style={inp}
                        type="text" placeholder="No smoking, Check-in from 2PM"
                        value={form.houseRules}
                        onChange={e => handleChange("houseRules", e.target.value)}
                    />
                </div>

                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "#3D3D3D", cursor: "pointer" }}>
                        <input type="checkbox" checked={form.breakfastIncluded} onChange={e => handleChange("breakfastIncluded", e.target.checked)} />
                        Breakfast Included
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "#3D3D3D", cursor: "pointer" }}>
                        <input type="checkbox" checked={form.dinnerIncluded} onChange={e => handleChange("dinnerIncluded", e.target.checked)} />
                        Dinner Included
                    </label>
                </div>

                <button type="submit" disabled={isPending} style={{
                    width: "100%", height: 48,
                    background: isPending ? "#999" : "#1A1A1A",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
                    fontWeight: 600, letterSpacing: "0.04em",
                    cursor: isPending ? "not-allowed" : "pointer",
                }}>
                    {isPending ? "Creating…" : "Create Villa"}
                </button>
            </form>
        </div>
    );
}