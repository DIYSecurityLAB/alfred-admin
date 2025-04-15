export function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {children}
    </div>
  );
}
