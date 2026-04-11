import { NextResponse } from 'next/server';
import { getStore } from '@/lib/autonomous/store';

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    running: store.kairosRunning,
    lastBeat: store.kairosLastBeat
  });
}
