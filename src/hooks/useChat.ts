import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setActiveConversation } from "@redux/slices/chatSlice";
import SOCKET_EVENTS from "@lib/socketEvents";

const useChat = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socket.socket);
  const activeConversation = useSelector(
    (state: RootState) => state?.chat?.activeConversation
  );

  const sendMessage = (content: string) => {
    if (!socket || !activeConversation || !content.trim()) return;

    socket.emit(SOCKET_EVENTS.SEND_PRIVATE_MESSAGE, {
      receiverId: activeConversation,
      content,
    });
  };

  const loadChatHistory = (conversationId: string) => {
    if (!socket) return;

    dispatch(setActiveConversation(conversationId));
    socket.emit(SOCKET_EVENTS.GET_CHAT_HISTORY, {
      conversationId,
      limit: 50,
      skip: 0,
    });
  };

  return {
    sendMessage,
    loadChatHistory,
  };
};

export default useChat;