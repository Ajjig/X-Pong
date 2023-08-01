// SocketComponent.js
import store, { setCurrentChat, setGameState, setNewMessage, setNotifications, setPrivateChats, setSocket } from "@/store/store";
import { use, useEffect } from "react";
import io from "socket.io-client";
import socketGame from "./gameSocket";
import chatSocket from "./chatSocket";

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
        chatSocket.connect();
        socketGame.connect();

        socketGame.on("gameState", (gameState: any) => {
            store.dispatch(setGameState(gameState));
        });

        store.dispatch(setSocket(socketGame));
        store.dispatch(setSocket(chatSocket));

        // Event handler for socket connection
        chatSocket.on("connect", () => {
            console.log("/chat: Connected to server");
        });

        // Event handler for socket disconnection
        chatSocket.on("disconnect", () => {
            console.log("/chat: Disconnected from server");
        });

        socketGame.on("connect", () => {
            console.log("/game: Connected to server");
        });

        socketGame.on("disconnect", () => {
            console.log("/game: Disconnected from server");
        });

        // @@@@@@@@@@@@@@

        chatSocket.on("message", (data: any) => {
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

        chatSocket.on("notifications", (data) => {
            console.log("notifications: ", data);
            // add the notification to the store
            store.dispatch(setNotifications(data));
        });

        chatSocket.on("privateChat", (data) => {
            // console.log("privateChat: loaded");
            store.dispatch(setPrivateChats(data));
        });

        chatSocket.on("publicChat", (data) => {
            // console.log("publicChat: ", data);
        });

        // // listen to all events from server
        // socket.onAny((event, ...args) => {
        //     console.log(event, args);
        // });

        // @@@@@@@@@@@@@@

        // Clean up the socket connection when component unmounts
        return () => {
            chatSocket.disconnect();
            socketGame.disconnect();
        };
    }, []);

    return <></>;
};

export default SocketComponent;
