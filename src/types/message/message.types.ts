import { UserType } from "../users/users.types";

export interface Conversation {
  _id: string;
  participants: UserType[];
  type: "private" | "group";
  name?: string;
  groupAdmin?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageContent?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
}

export interface AllConversationState {
  loading: boolean;
  data: {
    conversations: Conversation[];
    page?: number;
    limit?: number;
    totalCount?: number;
  };
  error: string | null;
}

export interface ConversationsState {
  allConversations: AllConversationState;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: UserType;
  content: string;
  timestamp: string;
  readBy?: string[];
}
