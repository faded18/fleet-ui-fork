import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import SOCKET_EVENTS from "@lib/socketEvents";

interface Message {
  _id: string;
  conversationId: string;
  senderId: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
}

interface Conversation {
  _id: string;
  type: "private" | "group";
  participants: Array<{
    _id: string;
    name: string;
    avatar: string;
  }>;
  lastMessage?: Message;
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversation = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      // Update last message in conversations
      const conversation = state.conversations.find(
        (conv) => conv._id === action.payload.conversationId
      );
      if (conversation) {
        conversation.lastMessage = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;