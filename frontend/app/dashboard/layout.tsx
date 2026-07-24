import AssistantWidget from "@/components/AssistantWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ margin: 0, padding: 0, minHeight: "100vh" }}>
      {children}
      <AssistantWidget />
    </div>
  );
}