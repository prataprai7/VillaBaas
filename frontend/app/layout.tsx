import type { Metadata } from "next";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export const metadata: Metadata = {
    title: "VillaBaas",
    description: "Curated luxury villa bookings in Nepal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <AuthProvider>
                <body style={{
                    margin: 0, padding: 0,
                    background: "#1A1A1A",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {children}
                </body>
            </AuthProvider>
        </html>
    );
}
