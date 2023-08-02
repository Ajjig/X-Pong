import { configureStore } from "@reduxjs/toolkit";

import { profileSlice } from "./profile";
import { ChatsSlice } from "./chats";
import { socketSlice } from "./socket";
import { NotificationsSlice } from "./notifications";
import { gameStateSlice } from "./game_state";

const rootReducer = {
    profile: profileSlice.reducer,
    chats: ChatsSlice.reducer,
    io: socketSlice.reducer,
    notifications: NotificationsSlice.reducer,
    game: gameStateSlice.reducer,
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const { setPrivateChats, addNewMessageToPrivateChat, setGroupChats, setCurrentChat, setNewMessage } = ChatsSlice.actions;
export const { setSocket } = socketSlice.actions;
export const { setProfile } = profileSlice.actions;
export const { setNotifications, addFriendRequest, removeFriendRequest } = NotificationsSlice.actions;
export const { setGameState } = gameStateSlice.actions;
export default store;
