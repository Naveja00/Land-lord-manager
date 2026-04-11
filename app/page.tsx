import { BuddyDashboard } from '@/components/buddy-dashboard';
import { DashboardCard } from '@/components/dashboard-card';
import { MaintenanceFlow } from '@/components/maintenance-flow';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-concierge-slate shadow-concierge">
          Autonomous Airbnb Co-Host
        </p>
        <h1 className="text-2xl font-bold md:text-4xl">Multi-Agent Control Room for Short-Term Rental Managers</h1>
        <p className="max-w-3xl text-sm text-concierge-slate md:text-base">
          Kairos heartbeat, AutoDream memory, Coordinator routing, and Undercover guest messaging in one dashboard.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Coordinator Model"
          description="Receives each guest message, consults PROPERTY_LOG.md, decides tool usage, and formats an undercover reply."
        >
          <ul className="list-inside list-disc space-y-1 text-sm text-concierge-slate">
            <li>Routes to Check_Calendar for late checkout requests.</li>
            <li>Routes to Google_Maps for local recommendations by ZIP code.</li>
            <li>Routes to Send_SMS for checkout alerts to the cleaning crew.</li>
          </ul>
        </DashboardCard>

        <DashboardCard
          title="AutoDream + Undercover"
          description="Unknown questions get host-flagged, then learned forever in PROPERTY_LOG.md once answered."
        >
          <ul className="list-inside list-disc space-y-1 text-sm text-concierge-slate">
            <li>Fallback line: “Let me double-check that for you.”</li>
            <li>Host answer is digested into local memory bible.</li>
            <li>Replies always signed as Alex, the local co-host.</li>
          </ul>
        </DashboardCard>
      </section>

      <BuddyDashboard />
      <MaintenanceFlow />
    </div>
  );
}
