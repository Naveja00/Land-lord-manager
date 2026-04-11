import type { ConversationLog, GuestMessage, HostAlert } from './types';

type RuntimeStore = {
  inbox: GuestMessage[];
  alerts: HostAlert[];
  conversations: ConversationLog[];
  kairosRunning: boolean;
  kairosLastBeat?: string;
};

const globalStore = globalThis as typeof globalThis & { __kairosStore?: RuntimeStore };

export function getStore(): RuntimeStore {
  if (!globalStore.__kairosStore) {
    globalStore.__kairosStore = {
      inbox: [],
      alerts: [],
      conversations: [],
      kairosRunning: false
    };
  }

  return globalStore.__kairosStore;
}
