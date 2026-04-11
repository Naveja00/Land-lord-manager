'use client';

import { useEffect, useState } from 'react';

type DashboardData = {
  kairosRunning: boolean;
  kairosLastBeat?: string;
  unresolvedCount: number;
  averageResponseSeconds: number;
  mascotMood: 'Leveling Up' | 'Stressed';
  conversations: Array<{ messageId: string; guestName: string; guestText: string; response: string; unresolved: boolean }>;
  alerts: Array<{ id: string; question: string; status: 'open' | 'resolved'; resolvedAnswer?: string }>;
};

const initialState: DashboardData = {
  kairosRunning: false,
  unresolvedCount: 0,
  averageResponseSeconds: 0,
  mascotMood: 'Leveling Up',
  conversations: [],
  alerts: []
};

export function BuddyDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData>(initialState);
  const [guestName, setGuestName] = useState('Jamie');
  const [guestText, setGuestText] = useState('Can I check out late tomorrow?');
  const [zipCode, setZipCode] = useState('60601');
  const [hostAnswer, setHostAnswer] = useState('');

  async function refresh() {
    const response = await fetch('/api/dashboard');
    const data = (await response.json()) as DashboardData;
    setDashboard(data);
  }

  useEffect(() => {
    void refresh();
    const interval = setInterval(() => void refresh(), 5000);
    return () => clearInterval(interval);
  }, []);

  async function toggleKairos(nextRunning: boolean) {
    await fetch('/api/kairos/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ running: nextRunning })
    });
    await refresh();
  }

  async function addMessage() {
    await fetch('/api/mock-inbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName, text: guestText, zipCode })
    });
    setGuestText('');
    await refresh();
  }

  async function resolveFirstAlert() {
    const openAlert = dashboard.alerts.find((item) => item.status === 'open');
    if (!openAlert || !hostAnswer) return;

    await fetch('/api/host-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId: openAlert.id, answer: hostAnswer })
    });
    setHostAnswer('');
    await refresh();
  }

  return (
    <section className="card space-y-4">
      <h2 className="text-lg font-semibold">BUDDY Host Dashboard</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border p-3">
          <p className="text-xs uppercase text-concierge-slate">Kairos</p>
          <p className="mt-1 text-sm font-semibold">{dashboard.kairosRunning ? 'Running (60s heartbeat)' : 'Paused'}</p>
          <p className="mt-1 text-xs text-concierge-slate">Last beat: {dashboard.kairosLastBeat ?? 'Not started yet'}</p>
          <button
            type="button"
            className="mt-2 rounded-lg bg-concierge-navy px-3 py-2 text-xs font-semibold text-white"
            onClick={() => toggleKairos(!dashboard.kairosRunning)}
          >
            {dashboard.kairosRunning ? 'Stop Heartbeat' : 'Start Heartbeat'}
          </button>
        </div>

        <div className="rounded-xl border p-3">
          <p className="text-xs uppercase text-concierge-slate">Property Health Mascot</p>
          <p className="mt-1 text-xl">{dashboard.mascotMood === 'Leveling Up' ? '🟢📈' : '😰'}</p>
          <p className="text-sm font-semibold">{dashboard.mascotMood}</p>
          <p className="text-xs text-concierge-slate">Unanswered complaints/questions: {dashboard.unresolvedCount}</p>
        </div>

        <div className="rounded-xl border p-3">
          <p className="text-xs uppercase text-concierge-slate">Response Pulse</p>
          <p className="mt-1 text-sm font-semibold">Avg response: {dashboard.averageResponseSeconds}s</p>
          <p className="text-xs text-concierge-slate">Tracks recent guest interactions.</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border p-3">
          <p className="font-medium">Mock Inbox (Airbnb / Booking.com)</p>
          <input className="w-full rounded-lg border p-2 text-sm" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Guest name" />
          <input className="w-full rounded-lg border p-2 text-sm" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP" />
          <textarea className="w-full rounded-lg border p-2 text-sm" value={guestText} onChange={(e) => setGuestText(e.target.value)} placeholder="Guest message" />
          <button type="button" onClick={addMessage} className="rounded-lg bg-concierge-navy px-3 py-2 text-xs font-semibold text-white">
            Add Guest Message
          </button>
        </div>

        <div className="space-y-2 rounded-xl border p-3">
          <p className="font-medium">AutoDream Host Queue</p>
          <p className="text-xs text-concierge-slate">Open flags: {dashboard.alerts.filter((item) => item.status === 'open').length}</p>
          <textarea
            className="w-full rounded-lg border p-2 text-sm"
            value={hostAnswer}
            onChange={(e) => setHostAnswer(e.target.value)}
            placeholder="Write the host-approved answer for the first open alert"
          />
          <button type="button" onClick={resolveFirstAlert} className="rounded-lg bg-concierge-navy px-3 py-2 text-xs font-semibold text-white">
            Digest Answer to PROPERTY_LOG.md
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Recent Undercover Responses</p>
        <div className="max-h-64 space-y-2 overflow-auto">
          {dashboard.conversations.slice(0, 6).map((item) => (
            <article key={item.messageId} className="rounded-lg border p-3 text-sm">
              <p className="font-semibold">{item.guestName}</p>
              <p className="text-concierge-slate">Guest: {item.guestText}</p>
              <p className="mt-1 whitespace-pre-wrap">Reply: {item.response}</p>
            </article>
          ))}
          {dashboard.conversations.length === 0 && <p className="text-sm text-concierge-slate">No messages processed yet.</p>}
        </div>
      </div>
    </section>
  );
}
