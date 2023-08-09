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
import { AchievementDto, NotificationType, SocketResponse } from "./types";
import { notifications } from "@mantine/notifications";
import api from "@/api";
import { Image } from "@mantine/core";
import { useRouter } from "next/router";

const SocketComponent = () => {
    const [connectedChat, setConnectedChat] = useState(false);
    const [connectedGame, setConnectedGame] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!socketGame.connected) {
            // socketGame.connect();
        } else {
            setConnectedGame(!connectedChat);
        }
        if (!chatSocket.connected) {
            // chatSocket.connect();
        } else {
            setConnectedChat(!connectedGame);
        }
    }, [connectedChat, connectedGame]);

    useEffect(() => {
        // Connect to the socket server

        store.dispatch(setSocket(socketGame));
        store.dispatch(setSocket(chatSocket));

        socketGame.on("gameState", (gameState: any) => {
            store.dispatch(setGameState(gameState));
        });

        socketGame.on("error", (err: string) => {
            notifications.show({
                title: "Error",
                message: err,
                color: "red",
            });
        });

        socketGame.on("end-game", () => {
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        });

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

        chatSocket.on("PublicMessage", (data: SocketResponse | any) => {
            if (data?.status) {
                return;
            }
            const newMessage = {
                content: data.content,
                createdAt: new Date(),
                senderId: data.senderId,
                user: {
                    avatarUrl: data.avatarUrl,
                    username: data.senderUsername,
                },
                senderUsername: data.senderUsername,
                channelId: data.channelId,
            };
            store.dispatch(addNewMessageToGroupChat(newMessage));
        });

        chatSocket.on("notifications", (data: NotificationType[]) => {
            // add the notification to the store
            store.dispatch(setNotifications(data));
        });

        chatSocket.on("notification", (data: NotificationType) => {
            store.dispatch(addFriendRequest(data));
            if (data.type == "AcceptRequest") {
                chatSocket.emit("reconnect");
            }
        });

        socketGame.on("achievement", (data: AchievementDto) => {
            notifications.show({
                title: data.name,
                message: data.description,
                color: "blue",
                icon: <Image src={api.getUri() + data.iconUrl} width={40} height={40} radius="xl" />,
            });
        });

        chatSocket.on("privateChat", (data) => {
            // console.log("privateChat", data);
            store.dispatch(setPrivateChats(data));
        });

        chatSocket.on("publicChat", (data) => {
            // console.log("publicChat", data);
            store.dispatch(setGroupChats(data));
        });

        return () => {
            chatSocket.disconnect();
            socketGame.disconnect();
        };
    }, [socketGame, chatSocket]);

    return <></>;
};

export default SocketComponent;
