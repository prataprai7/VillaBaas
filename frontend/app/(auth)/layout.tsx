import "./styles/auth.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#1A1A1A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div className="auth-shell">
        {children}
      </div>
    </div>
  );
}