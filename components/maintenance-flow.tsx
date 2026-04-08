'use client';

import { useMemo, useState } from 'react';
import { logicTree, type Category, type Room } from '@/lib/logic-tree';

const rooms = Object.keys(logicTree) as Room[];
const categories: Category[] = ['Electrical', 'Plumbing', 'Appliance'];

export function MaintenanceFlow() {
  const [room, setRoom] = useState<Room | ''>('');
  const [category, setCategory] = useState<Category | ''>('');
  const [issue, setIssue] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [hasStaffAssigned, setHasStaffAssigned] = useState(true);

  const issues = useMemo(() => {
    if (!room || !category) return [];
    return logicTree[room][category];
  }, [room, category]);

  const selectedIssue = issues.find((item) => item.issue === issue);
  const canSubmit = Boolean(selectedIssue && (!selectedIssue.needsConfirmation || confirmed));
  const routeLabel = hasStaffAssigned ? 'Maintenance Staff (Assigned)' : 'Landlord (DIY Mode)';

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Logic-Tree Maintenance Flow</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">1) Select Room</span>
          <select className="w-full rounded-lg border p-2" value={room} onChange={(e) => setRoom(e.target.value as Room)}>
            <option value="">Choose room...</option>
            {rooms.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">2) Select Category</span>
          <select
            className="w-full rounded-lg border p-2"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as Category);
              setIssue('');
              setConfirmed(false);
            }}
          >
            <option value="">Choose category...</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-1 text-sm">
        <span className="font-medium">3) Select Issue</span>
        <select
          className="w-full rounded-lg border p-2"
          value={issue}
          onChange={(e) => {
            setIssue(e.target.value);
            setConfirmed(false);
          }}
          disabled={issues.length === 0}
        >
          <option value="">Choose issue...</option>
          {issues.map((option) => (
            <option key={option.issue} value={option.issue}>
              {option.issue}
            </option>
          ))}
        </select>
      </label>

      {selectedIssue && (
        <div className="rounded-xl border border-concierge-steel bg-concierge-cloud p-3 text-sm">
          <p className="font-semibold">Troubleshooting buffer</p>
          <p className="mt-1">{selectedIssue.troubleshootingTip}</p>
          <label className="mt-3 flex items-center gap-2">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
            I tried this and it didn&apos;t work.
          </label>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasStaffAssigned}
            onChange={(e) => setHasStaffAssigned(e.target.checked)}
          />
          Building has assigned maintenance staff
        </label>
        <p className="text-concierge-slate">Automatic route: {routeLabel}</p>
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        className="w-full rounded-xl bg-concierge-navy px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Submit Work Order
      </button>
    </div>
  );
}
