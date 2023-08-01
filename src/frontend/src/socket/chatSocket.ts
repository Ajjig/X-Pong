import { io } from "socket.io-client";

const chatSocket = io("http://localhost:3000/chat", {
    withCredentials: true,
});

export default chatSocket;