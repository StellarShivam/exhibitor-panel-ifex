// ----------------------------------------------------------------------

export type IChatAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  createdAt: string;
  modifiedAt: string;
};

export type IChatMessage = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  contentType: string;
  attachments: IChatAttachment[];
};

export type IChatParticipant = {
  id: string;
  name: string;
  role: string;
  email: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  lastActivity: string;
  status: 'online' | 'offline' | 'always' | 'busy';
};

export type IChatConversation = {
  id: string;
  type: string;
  unreadCount: number;
  messages: IChatMessage[];
  participants: IChatParticipant[];
};

export type IChatConversations = {
  byId: Record<string, IChatConversation>;
  allIds: string[];
};
