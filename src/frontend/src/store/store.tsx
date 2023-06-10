import { configureStore } from "@reduxjs/toolkit";
import { socketSlice } from "./socket";
import { profileSlice } from "./profile";
import { ChatsSlice } from "./chats";

const rootReducer = {
    socket: socketSlice.reducer,
    profile: profileSlice.reducer,
    chats: ChatsSlice.reducer,
};

const store = configureStore({
    reducer: rootReducer,
});

export const { setPrivateChats, setGroupChats, setCurrentChat } = ChatsSlice.actions;
export const {} = socketSlice.actions;
export const { setProfile } = profileSlice.actions;
export default store;
