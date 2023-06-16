import { io } from "socket.io-client";

const socket = io("http://localhost:3000/chat", {
    withCredentials: true,
});

export default socket;
