// SocketComponent.js
import store, {
    addFriendRequest,
    addNewMessageToGroupChat,
    addNewMessageToPrivateChat,
    setGameState,
    setGroupChats,
    setNotifications,
    setPrivateChats,
    setSocket,
} from "@/store/store";
import { useEffect, useState } from "react";
import socketGame from "./gameSocket";
import chatSocket from "./chatSocket";
import { NotificationType } from "./types";

type MessageType = {
    content: string;
    createdAt: string;
    sender: string;
    avatarUrl?: string;
};

const SocketComponent = () => {
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        if (!socketGame.connected) {
            socketGame.connect();
        } else {
            setConnected(false);
        }
        if (!chatSocket.connected) {
            chatSocket.connect();
        } else {
            setConnected(false);
        }
    }, [connected]);

    useEffect(() => {
        // Connect to the socket server
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
            store.dispatch(addNewMessageToPrivateChat(data));
        });

        chatSocket.on("PublicMessage", (newMessage: any) => {
            // console.log("@@>PublicMessage", newMessage)

            store.dispatch(addNewMessageToGroupChat(newMessage));
        });

        chatSocket.on("notifications", (data: NotificationType[]) => {
            // add the notification to the store
            store.dispatch(setNotifications(data));
        });

        chatSocket.on("notification", (data: NotificationType) => {
            store.dispatch(addFriendRequest(data));
        });

        chatSocket.on("privateChat", (data) => {
            // console.log("privateChat", data);
            store.dispatch(setPrivateChats(data));
        });

        chatSocket.on("publicChat", (data) => {
            store.dispatch(setGroupChats(data));
        });

        // listen to all events from server
        // chatSocket.onAny((event, ...args) => {
        //     console.log(event, args);
        // });
        return () => {
            chatSocket.disconnect();
            socketGame.disconnect();
        };
    }, [socketGame, chatSocket]);

    return <></>;
};

export default SocketComponent;
