// SocketComponent.js
import store, { addFriendRequest, addNewMessageToPrivateChat, setGameState, setNewMessage, setNotifications, setPrivateChats, setSocket } from "@/store/store";
import { useEffect } from "react";
import socketGame from "./gameSocket";
import chatSocket from "./chatSocket";
import { NotificationType } from "./types";

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
        if (!socketGame.connected) socketGame.connect();
        if (!chatSocket.connected) chatSocket.connect();

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

        chatSocket.on("message", (data: any) => {
            if (store.getState().chats.PrivateChats.length == 0) {
                chatSocket.emit("reconnect", {});
            }

            // add the message to the private chat
            // make a deep copy of the private chats
            // const privateChats: PrivateChat = JSON.parse(JSON.stringify(store.getState().chats.PrivateChats));
            // const newPrivateChats = privateChats.map((chat: any) => {
            //     if (chat.privateChannelId == data.privateChannelId) {
            //         chat.chat.push(data);
            //     }
            //     return chat;
            // });
            // store.dispatch(setPrivateChats(newPrivateChats));
            store.dispatch(addNewMessageToPrivateChat(data));

            // socket.emit("reconnect", {});
            // store.dispatch(setNewMessage(data));
        });

        chatSocket.on("notifications", (data: NotificationType[]) => {
            console.log(">>>>>>>>>>> notifications: ", data);
            // add the notification to the store
            store.dispatch(setNotifications(data));
        });

        chatSocket.on("notification", (data: NotificationType) => {
            console.log("notification: ", data);

            store.dispatch(addFriendRequest(data));
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
