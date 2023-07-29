// SocketComponent.js
import store, { setCurrentChat, setNewMessage, setNotifications, setPrivateChats, setSocket } from "@/store/store";
import { useEffect } from "react";
import io from "socket.io-client";

type PrivateChat = [
    {
        chat: any[];
        otherUser: {};
        privateChannelId: string;
    }
];

const SocketComponent = () => {
    useEffect(() => {
        // Connect to the socket server
        const socket = io("http://localhost:3000/chat", {
            withCredentials: true,
        });

        const socketGame = io("http://localhost:3000/game", {
            withCredentials: true,
        });

        store.dispatch(setSocket(socketGame));
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
            // add the message to the private chat
            // make a deep copy of the private chats
            const privateChats: PrivateChat = JSON.parse(JSON.stringify(store.getState().chats.PrivateChats));

            console.warn("@> ", privateChats);
            const newPrivateChats = privateChats.map((chat: any) => {
                if (chat.privateChannelId == data.privateChannelId) {
                    chat.chat.push(data);
                }
                return chat;
            });
            store.dispatch(setPrivateChats(newPrivateChats));

            // socket.emit("reconnect", {});
            store.dispatch(setNewMessage(data));
        });

        socket.on("notifications", (data) => {
            console.log("notifications: ", data);
            // add the notification to the store
            store.dispatch(setNotifications(data));
        });


        socket.on("privateChat", (data) => {
            // console.log("privateChat: loaded");
            store.dispatch(setPrivateChats(data));
        });

        socket.on("publicChat", (data) => {
            // console.log("publicChat: ", data);
        });

        // // listen to all events from server
        // socket.onAny((event, ...args) => {
        //     console.log(event, args);
        // });

        // @@@@@@@@@@@@@@

        // Clean up the socket connection when component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    return <></>;
};

export default SocketComponent;
