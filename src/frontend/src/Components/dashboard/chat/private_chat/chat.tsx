import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Input, Text, useMantineTheme, Avatar, MantineTheme, Paper, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import store, { addNewMessageToPrivateChat } from "@/store/store";
import { IconChevronLeft, IconSend } from "@tabler/icons-react";
import { PrivateChatMenu } from "../../list_of_chats/private_chats/privateChatMenu";
import { Message } from "./message";
import chatSocket from "@/socket/chatSocket";
import { TypeMessage } from "../../type";
import { PrivateMessageRequest } from "./type";
import api from "@/api";
import { useRouter } from "next/router";

export function Chat({ user, setSelected, chat }: { user: any; setSelected: any; chat: any }) {
    const [friend] = useState<any>(chat.otherUser);
    const theme: MantineTheme = useMantineTheme();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [messages, setMessages] = useState<any>([]);
    const router = useRouter();

    useEffect(() => {
        if (!chatSocket.connected) chatSocket.connect();

        store.getState().chats.PrivateChats.forEach((chat: any) => {
            if (chat.privateChannelId == chat.privateChannelId) {
                setMessages(chat.chat);
            }
        });

        chatSocket.on("message", (data: TypeMessage) => {
            if (data.privateChannelId == chat.privateChannelId) {
                setMessages((prev: any) => [...prev, data]);
            }
        });
    }, []);

    const [message, setMessage] = useState("");
    const scrollRef = useRef<Readonly<HTMLDivElement> | null>(null);

    const sendMessage = (message: any) => {
        message.message = message.message.trim();
        if (!message || message.message === "") return;

        let newMessageReq: PrivateMessageRequest = {
            content: message.message,
            receiverID: friend.id,
        };

        chatSocket.emit("message", newMessageReq);

        // create the new message object
        const newMessage: TypeMessage = {
            privateChannelId: chat.privateChannelId,
            createdAt: new Date(),
            receiverId: friend.id,
            senderId: user.id,
            content: message.message,
            avatarUrl: user.avatarUrl,
            receiverName: friend.name,
            senderName: user.name,
            senderUsername: user.username,
            receiverUsername: friend.username,
            channelId: chat.channelId,
            channelName: chat.channelName,
            updatedAt: new Date(),
        };

        // add message to messages
        setMessages((prev: any) => [...prev, newMessage]);
        store.dispatch(addNewMessageToPrivateChat(newMessage));
        setMessage("");
    };

    useEffect(() => {
        //get the last message
        const lastMessage = scrollRef.current?.lastElementChild;
        // scroll to the last message
        lastMessage?.scrollIntoView();
    }, [messages]);

    return (
        <Paper
            h="100%"
            bg="cos_black.2"
            radius="lg"
            sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* header */}
            <Paper bg="none" p="none" w="100%">
                <Flex justify="flex-start" align="center" p="md" h="auto">
                    <Button p={0} h="auto" onClick={() => setSelected(null)}>
                        <IconChevronLeft size={25} />
                        {friend?.id && <Avatar src={api.getUri() + `user/avatar/${friend.id}`} size={45} radius="xl" m={4} />}
                    </Button>
                    <Flex justify="space-between" align="center" w="100%">
                        <Stack
                            w={"100%"}
                            spacing={0}
                            ml="sm"
                            sx={{
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                router.push(`/profile/${friend.id}`);
                            }}
                        >
                            <Text fw="bold" fz="lg">
                                {friend.name}
                            </Text>
                            <Text color="gray.5" fz="sm">
                                @{friend.username}
                            </Text>
                        </Stack>
                        {isMobile || 1 ? <PrivateChatMenu user={friend} /> : null}
                    </Flex>
                </Flex>
            </Paper>

            {/* messages */}
            <Box
                px={10}
                pt={0}
                sx={{
                    flex: 1,
                    overflowY: "scroll",
                    /* ===== Scrollbar CSS ===== */
                    /* Firefox */
                    scrollbarColor: `${theme.colors.gray[8]} transparent`,
                    scrollbarWidth: "thin",
                    /* Chrome, Edge, and Safari */
                    "&::-webkit-scrollbar": {
                        width: "5px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: theme.colors.gray[8],
                        borderRadius: theme.radius.md,
                    },
                    background: `linear-gradient(rgba(21, 21, 26, 1), rgba(21, 21, 26, 0.8)), url(/chatBackground.png)`,
                    backgroundSize: "50%",
                }}
                ref={scrollRef}
            >
                {messages.map((message: any, index: number) => {
                    return (
                        <Box key={message.createdAt ?? index} mb={10}>
                            <Message message={message} friend={friend} />
                        </Box>
                    );
                })}
            </Box>

            {/* input */}
            <Flex justify="center" gap={10} align="center" p="md" bg="cos_black.0">
                <Input
                    variant="unstyled"
                    sx={(theme: MantineTheme) => ({
                        "&:focus": {
                            outline: `1px solid ${theme.colors.orange[6]} !important`,
                            outlineOffset: 2,
                        },
                    })}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage({ message: message, from: "me" });
                    }}
                    w="100%"
                />
                <Button
                    variant="outline"
                    color="gray"
                    size="xs"
                    sx={(theme: MantineTheme) => ({
                        padding: 0,
                        width: 50,
                        height: 45,
                    })}
                    onClick={() => {
                        sendMessage({
                            message: message,
                            from: "me",
                        });
                    }}
                >
                    <IconSend size={20} />
                </Button>
            </Flex>
        </Paper>
    );
}
