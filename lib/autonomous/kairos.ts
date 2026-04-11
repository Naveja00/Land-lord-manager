import { handleGuestMessage } from './coordinator';
import { digestHostAnswer } from './memory';
import { getStore } from './store';

const globalKairos = globalThis as typeof globalThis & {
  __kairosInterval?: NodeJS.Timeout;
};

export async function processInboxOnce() {
  const store = getStore();
  const pending = store.inbox.filter((message) => message.status === 'pending');

  for (const message of pending) {
    const result = await handleGuestMessage(message);
    store.conversations.unshift(result.conversation);
    message.status = 'processed';
    if (result.alert) {
      store.alerts.unshift(result.alert);
    }
  }

  store.kairosLastBeat = new Date().toISOString();
}

export function startKairos() {
  const store = getStore();
  if (globalKairos.__kairosInterval) {
    store.kairosRunning = true;
    return;
  }

  store.kairosRunning = true;
  void processInboxOnce();
  globalKairos.__kairosInterval = setInterval(() => {
    void processInboxOnce();
  }, 60000);
}

export function stopKairos() {
  const store = getStore();
  if (globalKairos.__kairosInterval) {
    clearInterval(globalKairos.__kairosInterval);
    globalKairos.__kairosInterval = undefined;
  }
  store.kairosRunning = false;
}

export async function resolveAlert(alertId: string, answer: string) {
  const store = getStore();
  const alert = store.alerts.find((item) => item.id === alertId);
  if (!alert) return null;

  alert.status = 'resolved';
  alert.resolvedAnswer = answer;
  await digestHostAnswer(alert.question, answer);
  return alert;
}
