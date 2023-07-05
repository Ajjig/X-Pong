import { configureStore } from "@reduxjs/toolkit";

import { profileSlice } from "./profile";
import { ChatsSlice } from "./chats";
import { socketSlice } from "./socket";

const rootReducer = {
    profile: profileSlice.reducer,
    chats: ChatsSlice.reducer,
    io: socketSlice.reducer,
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const { setPrivateChats, setGroupChats, setCurrentChat, setNewMessage } = ChatsSlice.actions;
export const { setSocket } = socketSlice.actions;
export const { setProfile } = profileSlice.actions;
export default store;
