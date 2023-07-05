// SocketComponent.js
import store, { setCurrentChat, setNewMessage, setPrivateChats, setSocket } from "@/store/store";
import { useEffect } from "react";
import io from "socket.io-client";

const SocketComponent = () => {
    useEffect(() => {
        // Connect to the socket server
        const socket = io("http://localhost:3000/chat", {
            withCredentials: true,
        });

        store.dispatch(setSocket(socket));

        // Event handler for socket connection
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        // Event handler for socket disconnection
        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        // @@@@@@@@@@@@@@

        socket.on("message", (data: any) => {
            // console.log("New Message: ", data);
            socket.emit("reconnect", {});
            console.warn("new message: ", data);
            store.dispatch(setNewMessage(data));
            
        });

        socket.on("privateChat", (data) => {
            // console.log("privateChat: loaded");
            store.dispatch(setPrivateChats(data));
        });

        socket.on("publicChat", (data) => {
            // console.log("publicChat: ", data);
        });

        // listen to all events from server
        socket.onAny((event, ...args) => {
            console.log(event, args);
        });

        // @@@@@@@@@@@@@@

        // socket.emit("message", {
        //     receiver: "roudouch",
        //     msg: "Hello",
        // });

        // Clean up the socket connection when component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    return <></>;
};

export default SocketComponent;
