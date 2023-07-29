import { configureStore } from "@reduxjs/toolkit";

import { profileSlice } from "./profile";
import { ChatsSlice } from "./chats";
import { socketSlice } from "./socket";
import { NotificationsSlice } from "./notifications";

const rootReducer = {
    profile: profileSlice.reducer,
    chats: ChatsSlice.reducer,
    io: socketSlice.reducer,
    notifications: NotificationsSlice.reducer,
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const { setPrivateChats, setGroupChats, setCurrentChat, setNewMessage } = ChatsSlice.actions;
export const { setSocket, setGame } = socketSlice.actions;
export const { setProfile } = profileSlice.actions;
export const { setNotifications } = NotificationsSlice.actions;
export default store;
