import { combineReducers } from "redux";
import authSlice from "./slices/authSlice";
import meetSlice from "./slices/meetSlice";
import usersSlice from "./slices/usersSlice";
import socketSlice from "./slices/socketSlice";
import chatSlice from "./slices/chatSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  meet: meetSlice,
  users: usersSlice,
  socket: socketSlice,
  chat: chatSlice,
});
export default rootReducer;
