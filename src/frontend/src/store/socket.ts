import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

const initialStateProfile = {
    socket: null,
    game: null,
};

const socketSlice = createSlice({
    name: "chats",
    initialState: initialStateProfile as { socket: Socket | null; game: Socket | null },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setGame: (state, action) => {
            state.game = action.payload;
        },
    },
});

export { socketSlice };
