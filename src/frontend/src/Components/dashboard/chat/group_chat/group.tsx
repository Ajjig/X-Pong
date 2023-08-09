import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Input, Text, useMantineTheme, Avatar, MantineTheme, Paper, Stack, Badge } from "@mantine/core";
import { motion } from "framer-motion";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import store, { addNewMessageToGroupChat } from "@/store/store";
import { IconChevronLeft, IconDots, IconLock, IconSend, IconShieldLock, IconUsersGroup } from "@tabler/icons-react";
import chatSocket from "@/socket/chatSocket";
import { Message } from "./message";
import { TypeMessage } from "../../type";
import { SettingGroupChat } from "./settings";
import { notifications } from "@mantine/notifications";

export function ChatGroup({ user, setSelected, chat: _chat }: { user: any; setSelected: any; chat: any }) {
    const theme: MantineTheme = useMantineTheme();
    const [messages, setMessages] = useState<any>([]);
    const [opened, { open, close }] = useDisclosure();
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [chat, setChat] = useState<any>(_chat);

    useEffect(() => {
        if (!chatSocket.connected) chatSocket.connect();
        setMessages(chat?.messages);

        store.subscribe(() => {
            setChat(store.getState().chats.GroupChats.find((chat: any) => chat.id == _chat.id));
        });

        chatSocket.on("PublicMessage", (data: any) => {
            if (data?.status) {
                notifications.show({
                    title: "Error",
                    message: data.message,
                    color: "red",
                });
                setIsMuted(true);
                // remove the last message
                setMessages((prev: any) => prev.slice(0, prev.length - 1));
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

            if (data?.channelId == chat?.id) {
                setMessages((prev: any) => [...prev, newMessage]);
            }
        });

        return () => {
            setMessages([]);
        };
    }, [chat]);

    const scrollRef = useRef<Readonly<HTMLDivElement> | null>(null);

    useEffect(() => {
        //get the last message
        const lastMessage = scrollRef.current?.lastElementChild;
        // scroll to the last message
        lastMessage
            ?.scrollIntoView
            // { behavior: "smooth" }
            ();
    }, [messages]);

    const icon = () => {
        if (chat?.type == "private") {
            return <IconLock size={30} />;
        } else if (chat?.type == "protected") {
            return <IconShieldLock size={30} />;
        }
        return <IconUsersGroup size={30} />;
    };

    const color = () => {
        if (chat?.type == "private") {
            return "red";
        } else if (chat?.type == "protected") {
            return "yellow";
        }
        return "purple";
    };

    if (!chat) return null;

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
                        <Avatar size={45} radius="xl" m={4}>
                            {icon()}
                        </Avatar>
                    </Button>
                    <Flex justify="space-between" align="center" w="100%">
                        <Stack w={"100%"} spacing={0} ml="sm">
                            <Text fw="bold" fz="lg">
                                {chat.name}
                            </Text>
                            <Text color="gray.5" fz="sm">
                                <Badge color={color()} variant="dot" size="xs">
                                    <Text fz="10px" color="gray.5" lineClamp={1}>
                                        {chat.type}
                                    </Text>
                                </Badge>
                            </Text>
                        </Stack>

                        {/* Menu here */}
                        <SettingGroupChat _chat={chat} opened={opened} open={open} close={close} key={chat.id}>
                            <IconDots size={25} />
                        </SettingGroupChat>
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
                {messages.map((message: TypeMessage, index: number) => {
                    return (
                        <Box key={String(message.createdAt) + index} mb={10}>
                            <Message message={message} />
                        </Box>
                    );
                })}
            </Box>
            {!isMuted && <InputMessage user={user} chat={chat} setMessages={setMessages} />}
        </Paper>
    );
}

function InputMessage({ user, chat, setMessages }: { user: any; chat: any; setMessages: any }) {
    const [message, setMessage] = useState("");

    const sendMessage = (message: any) => {
        message.message = message.message.trim();
        // protect from sending empty messages
        if (!message || message.message === "") return;

        // esnd message to the server
        chatSocket.emit("PublicMessage", {
            id: chat.id,
            content: message.message,
        });

        // add message to messages
        const newMessage = {
            content: message.message,
            createdAt: new Date(),
            senderId: store.getState().profile.user.id,
            user: {
                avatarUrl: store.getState().profile.user.avatarUrl,
                username: store.getState().profile.user.username,
            },
            senderUsername: store.getState().profile.user.username,
            channelId: chat.id,
        };

        setMessages((prev: any) => [...prev, newMessage]);
        store.dispatch(addNewMessageToGroupChat(newMessage));
        setMessage("");
    };

    return (
        <Flex justify="center" gap={10} align="center" p="md" bg="cos_black.0">
            <Input
                autoComplete="off"
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
                color="purple"
                size="xs"
                sx={{
                    padding: 0,
                    width: 50,
                    height: 45,
                }}
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
    );
}
