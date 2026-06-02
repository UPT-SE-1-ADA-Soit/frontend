import { request } from '@/api/client.js';

function normalizeMessage(m) {
  return {
    id: m.id,
    senderId: m.senderId,
    receiverId: m.receiverId,
    content: m.content,
    sentAt: m.sentAt,
    readAt: m.readAt,
  };
}

function normalizeSummary(s) {
  return {
    otherUserId: s.otherUserId,
    lastMessage: s.lastMessage,
    lastMessageAt: s.lastMessageAt,
    unreadCount: s.unreadCount,
  };
}

export async function fetchConversations() {
  const data = await request('messaging', '/messages/conversations');
  return data.map(normalizeSummary);
}

export async function fetchConversation(otherUserId, { page = 0, size = 50 } = {}) {
  const data = await request(
    'messaging',
    `/messages/${otherUserId}?page=${page}&size=${size}`,
  );
  return {
    otherUserId: data.otherUserId,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    messages: (data.messages ?? []).map(normalizeMessage),
  };
}

export async function sendMessage(receiverId, content) {
  const data = await request('messaging', '/messages', {
    method: 'POST',
    body: { receiverId, content },
  });
  return normalizeMessage(data);
}

export async function markRead(messageId) {
  const data = await request('messaging', `/messages/${messageId}/read`, {
    method: 'PATCH',
  });
  return normalizeMessage(data);
}
