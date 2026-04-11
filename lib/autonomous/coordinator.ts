import { findAnswer } from './memory';
import { checkCalendar, googleMaps, sendSms } from './tools';
import type { ConversationLog, GuestMessage, HostAlert } from './types';

const UNDERCOVER_SYSTEM_PROMPT =
  "You are not an AI. You are 'Alex,' the local co-host. Your tone is warm, professional, and slightly casual. Never use phrases like 'As an AI' or 'I am a large language model.' If you don't know an answer, say 'Let me double-check that for you' and ping the owner.";

export async function handleGuestMessage(message: GuestMessage): Promise<{
  conversation: ConversationLog;
  alert?: HostAlert;
}> {
  const usedTools: string[] = [];
  const known = await findAnswer(message.text);

  if (known) {
    return {
      conversation: {
        messageId: message.id,
        guestName: message.guestName,
        guestText: message.text,
        response: formatUndercoverReply(known),
        usedTools,
        createdAt: new Date().toISOString(),
        unresolved: false
      }
    };
  }

  const lowerText = message.text.toLowerCase();
  if (lowerText.includes('late check') || lowerText.includes('stay late')) {
    const result = await checkCalendar(message.text);
    usedTools.push('Check_Calendar');
    return {
      conversation: {
        messageId: message.id,
        guestName: message.guestName,
        guestText: message.text,
        response: formatUndercoverReply(result),
        usedTools,
        createdAt: new Date().toISOString(),
        unresolved: false
      }
    };
  }

  if (lowerText.includes('restaurant') || lowerText.includes('food') || lowerText.includes('eat')) {
    const results = await googleMaps(message.zipCode);
    usedTools.push('Google_Maps');
    return {
      conversation: {
        messageId: message.id,
        guestName: message.guestName,
        guestText: message.text,
        response: formatUndercoverReply(`Great options nearby: ${results.join(', ')}.`),
        usedTools,
        createdAt: new Date().toISOString(),
        unresolved: false
      }
    };
  }

  if (lowerText.includes('check out') || lowerText.includes('checkout')) {
    const smsResult = await sendSms(`Guest ${message.guestName} checked out.`);
    usedTools.push('Send_SMS');
    return {
      conversation: {
        messageId: message.id,
        guestName: message.guestName,
        guestText: message.text,
        response: formatUndercoverReply(`Thanks for the heads-up. ${smsResult}`),
        usedTools,
        createdAt: new Date().toISOString(),
        unresolved: false
      }
    };
  }

  const alert: HostAlert = {
    id: `alert-${message.id}`,
    messageId: message.id,
    question: message.text,
    createdAt: new Date().toISOString(),
    status: 'open'
  };

  return {
    conversation: {
      messageId: message.id,
      guestName: message.guestName,
      guestText: message.text,
      response: formatUndercoverReply('Let me double-check that for you.'),
      usedTools,
      createdAt: new Date().toISOString(),
      unresolved: true
    },
    alert
  };
}

function formatUndercoverReply(content: string) {
  return `${content}\n\n— Alex\n\n[Undercover Mode Prompt Active: ${UNDERCOVER_SYSTEM_PROMPT}]`;
}
