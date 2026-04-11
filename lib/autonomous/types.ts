export type GuestMessage = {
  id: string;
  guestName: string;
  text: string;
  zipCode: string;
  receivedAt: string;
  status: 'pending' | 'processed';
};

export type HostAlert = {
  id: string;
  messageId: string;
  question: string;
  createdAt: string;
  status: 'open' | 'resolved';
  resolvedAnswer?: string;
};

export type ConversationLog = {
  messageId: string;
  guestName: string;
  guestText: string;
  response: string;
  usedTools: string[];
  createdAt: string;
  unresolved: boolean;
};

export type PropertyKnowledge = {
  question: string;
  answer: string;
  source: 'host';
  updatedAt: string;
};
