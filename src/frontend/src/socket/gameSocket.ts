import api from "@/api";
import { io } from "socket.io-client";

const socketGame = io(api.getUri() + "game", {
    withCredentials: true,
    autoConnect: false,
});

export default socketGame;