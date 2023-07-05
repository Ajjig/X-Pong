import { createSlice } from "@reduxjs/toolkit";

const initialStateProfile = {
    PrivateChats: [],
    GroupChats: [],
    currentChat: null,
    newMessage: null,
};

const ChatsSlice = createSlice({
    name: "chats",
    initialState: initialStateProfile,
    reducers: {
        setPrivateChats: (state, action) => {
            state.PrivateChats = action.payload;
        },
        setGroupChats: (state, action) => {
            state.GroupChats = action.payload;
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setNewMessage: (state, action) => {
            state.newMessage = action.payload;
        }
        
    },
});

export { ChatsSlice };
