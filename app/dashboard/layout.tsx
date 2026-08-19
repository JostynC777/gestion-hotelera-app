export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-gray-100 min-h-screen">
      {/* Aquí luego pondremos un menú lateral (Sidebar) solo para los administradores */}
      <div className="p-8">
        {children}
      </div>
    </section>
  );
}