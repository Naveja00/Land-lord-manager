type DashboardCardProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function DashboardCard({ title, description, children }: DashboardCardProps) {
  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-concierge-slate">{description}</p>
      {children}
    </section>
  );
}
