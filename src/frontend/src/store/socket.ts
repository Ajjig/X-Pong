import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

const initialStateProfile = {
    socket: null,
};

const socketSlice = createSlice({
    name: "sockets",
    initialState: initialStateProfile as { socket: Socket | null; game: Socket | null },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
    },
});

export { socketSlice };
