import { NextResponse } from 'next/server';
import { getStore } from '@/lib/autonomous/store';

export async function GET() {
  const store = getStore();
  return NextResponse.json({ inbox: store.inbox, conversations: store.conversations });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    guestName: string;
    text: string;
    zipCode?: string;
  };

  const store = getStore();
  const message = {
    id: `msg-${Date.now()}`,
    guestName: payload.guestName,
    text: payload.text,
    zipCode: payload.zipCode ?? '60601',
    receivedAt: new Date().toISOString(),
    status: 'pending' as const
  };
  store.inbox.unshift(message);

  return NextResponse.json({ ok: true, message });
}
