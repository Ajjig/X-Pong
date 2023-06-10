import { createSlice } from "@reduxjs/toolkit";

const initialStateProfile = {
    PrivateChats: [
        {
            id: 0,
            name: "Rashid",
            last_message: "who are you doing",
            time: "12:00",
            avatar: "https://picsum.photos/200/300",
        },
        {
            id: 1,
            name: "John Doe",
            last_message: "Wanna play?",
            time: "12:00",
            avatar: "https://picsum.photos/200/301",
        },
        {
            id: 2,
            name: "John Doe",
            last_message: "Hello",
            time: "12:00",
            avatar: "https://picsum.photos/200/302",
        },
        {
            id: 4,
            name: "It's Batata",
            last_message: "Hello",
            time: "12:00",
            avatar: "https://picsum.photos/200/303",
        },
    ],
    GroupChats: [],
    currentChat: null,
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
    },
});

export  {
    ChatsSlice
};