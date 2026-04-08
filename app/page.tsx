import { DashboardCard } from '@/components/dashboard-card';
import { MaintenanceFlow } from '@/components/maintenance-flow';

const expenseCategories = ['Repairs', 'Supplies', 'Improvement'];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-concierge-slate shadow-concierge">
          Digital Twin Property Manager
        </p>
        <h1 className="text-2xl font-bold md:text-4xl">Deterministic Operations for Chicago-Style Buildings</h1>
        <p className="max-w-3xl text-sm text-concierge-slate md:text-base">
          A logic-based app for landlords, tenants, and maintenance staff. Every workflow is explicit if-then rules,
          no AI decision making.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="One-Time Setup"
          description="Configure unit templates, bulk-add units, and store building vault details once per property."
        >
          <ul className="list-inside list-disc space-y-1 text-sm text-concierge-slate">
            <li>Template Builder for room dimensions, paint codes, and appliance specs.</li>
            <li>Bulk Inserter to apply a template to Units 1-10 in one action.</li>
            <li>Building Vault for boiler serials, roof age, and exterior brick color.</li>
          </ul>
        </DashboardCard>

        <DashboardCard
          title="Tax-Ready Ledger"
          description="Force receipt capture and export building/year totals for Schedule E prep."
        >
          <ul className="list-inside list-disc space-y-1 text-sm text-concierge-slate">
            <li>Receipt upload required before a work order can be closed.</li>
            <li>Standard category dropdown: {expenseCategories.join(', ')}.</li>
            <li>Year + building filters with totals for repairs vs. improvements.</li>
          </ul>
        </DashboardCard>
      </section>

      <MaintenanceFlow />
    </div>
  );
}
