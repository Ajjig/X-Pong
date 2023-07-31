import { io } from "socket.io-client";

const socketGame = io("http://localhost:3000/game", {
    withCredentials: true,
});

export default socketGame;