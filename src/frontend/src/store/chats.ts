import { createSlice } from "@reduxjs/toolkit";

const initialStateProfile = {
    PrivateChats: [],
    GroupChats: [],
    currentChat: null,
    currentChatGroup: null,
    newMessage: null,
};

const ChatsSlice = createSlice({
    name: "chats",
    initialState: initialStateProfile,
    reducers: {
        setPrivateChats: (state, action) => {
            state.PrivateChats = action.payload;
        },
        addNewMessageToPrivateChat: (state, action) => {
            const privateChats: any = state.PrivateChats.find((chat: any) => chat.privateChannelId === action.payload.privateChannelId);
            if (privateChats) {
                privateChats.chat.push(action.payload);
            }
        },
        setGroupChats: (state, action) => {
            state.GroupChats = action.payload;
        },
        addNewMessageToGroupChat: (state, action) => {
            const groupChats: any = state.GroupChats.find((chat: any) => chat.name === action.payload.name);
            if (groupChats) {
                groupChats.messages.push(action.payload);
            }
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setCurrentChatGroup: (state, action) => {
            state.currentChatGroup = action.payload;
        },
        setNewMessage: (state, action) => {
            state.newMessage = action.payload;
        }
        
    },
});

export { ChatsSlice };
