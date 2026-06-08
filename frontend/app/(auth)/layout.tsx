import type { Metadata } from "next";
import "./styles/auth.css";

export const metadata: Metadata = {
  title: "VillaBaas — Sign In",
  description: "Curated luxury villa bookings worldwide.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-shell">{children}</div>;
}
