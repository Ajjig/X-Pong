import api from "@/api";
import { io } from "socket.io-client";

const chatSocket = io(api.getUri() + "chat", {
    withCredentials: true,
    autoConnect: false,
});

export default chatSocket;