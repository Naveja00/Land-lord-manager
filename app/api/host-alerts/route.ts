import { NextResponse } from 'next/server';
import { resolveAlert } from '@/lib/autonomous/kairos';
import { getStore } from '@/lib/autonomous/store';

export async function GET() {
  const store = getStore();
  return NextResponse.json({ alerts: store.alerts });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { alertId: string; answer: string };
  const alert = await resolveAlert(payload.alertId, payload.answer);

  if (!alert) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  return NextResponse.json({ ok: true, alert });
}
