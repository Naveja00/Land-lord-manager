import { NextResponse } from 'next/server';
import { getStore } from '@/lib/autonomous/store';

export async function GET() {
  const store = getStore();
  const recent = store.conversations.slice(0, 10);
  const unresolvedCount = store.alerts.filter((item) => item.status === 'open').length;
  const averageResponseSeconds = recent.length === 0 ? 0 : 8;
  const mascotMood = unresolvedCount > 0 ? 'Stressed' : 'Leveling Up';

  return NextResponse.json({
    kairosRunning: store.kairosRunning,
    kairosLastBeat: store.kairosLastBeat,
    unresolvedCount,
    averageResponseSeconds,
    mascotMood,
    conversations: store.conversations,
    inbox: store.inbox,
    alerts: store.alerts
  });
}
