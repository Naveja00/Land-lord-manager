import { NextResponse } from 'next/server';
import { startKairos, stopKairos } from '@/lib/autonomous/kairos';
import { getStore } from '@/lib/autonomous/store';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { running?: boolean };

  if (body.running === false) {
    stopKairos();
  } else {
    startKairos();
  }

  const store = getStore();
  return NextResponse.json({
    running: store.kairosRunning,
    lastBeat: store.kairosLastBeat
  });
}
