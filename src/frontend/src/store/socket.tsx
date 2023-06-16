import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialStateSocket = {
    socket: io("http://localhost:3000/chat", {
        withCredentials: true,
    }),
};

const socketSlice = createSlice({
    name: "socket",
    initialState: initialStateSocket,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
    },
});

export { socketSlice };
