import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    MantineProvider,
    Text,
    useMantineTheme,
    Space,
    Avatar,
    Group,
    MantineTheme,
    Divider,
    Paper,
    UnstyledButton,
    Stack,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";
import store, { setNewMessage } from "@/store/store";
import { IconArrowBadgeLeft, IconArrowBadgeLeftFilled, IconArrowNarrowLeft, IconChevronLeft, IconSend } from "@tabler/icons-react";
import { PrivateChatMenu } from "../../list_of_chats/private_chats/privateChatMenu";
import { Message } from "./message";
import chatSocket from "@/socket/chatSocket";

export function Chat({ user, setSelected, chat }: { user: any; setSelected: any; chat: any }) {
    const [friend] = useState<any>(chat.otherUser);
    const theme: MantineTheme = useMantineTheme();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [messages, setMessages] = useState<any>(chat.chat ?? []);

    useEffect(() => {
        // subscribe to check if this store.getState().chats.newMessage has a new value
        store.subscribe(() => {
            let newMsg: any = store.getState().chats.newMessage;
            if (newMsg != null && newMsg.privateChannelId == chat.privateChannelId) {
                setMessages((prev: any) => [...prev, newMsg]);
                // set new message to null
                store.dispatch(setNewMessage(null));
            }
        });
        if (!chatSocket.connected) chatSocket.connect();
    }, []);

    const [message, setMessage] = useState("");
    const scrollRef = useRef<Readonly<HTMLDivElement> | null>(null);

    const sendMessage = (message: any) => {
        if (!message || message.message === "") return;
        chatSocket.emit("message", {
            receiver: friend.username,
            msg: message.message,
        });
        // add message to messages
        setMessages((prev: any) => [
            ...prev,
            {
                receiverId: friend.id,
                text: message.message,
            },
        ]);
        setMessage("");
    };

    useEffect(() => {
        //get the last message
        const lastMessage = scrollRef.current?.lastElementChild;
        // scroll to the last message
        lastMessage
            ?.scrollIntoView
            // { behavior: "smooth" }
            ();
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
                <Flex
                    justify="flex-start"
                    align="center"
                    p="md"
                    h="auto"
                    sx={(theme: MantineTheme) => ({ borderBottom: `3px solid ${theme.colors.cos_black[0]}` })}
                >
                    <Button p={0} h="auto" onClick={() => setSelected(null)}>
                        <IconChevronLeft size={25} />
                        <Avatar src={friend.avatarUrl} size={45} radius="xl" m={4} />
                    </Button>
                    <Flex justify="space-between" align="center" w="100%">
                        <Stack w={"100%"} spacing={0} ml="sm">
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
                }}
                ref={scrollRef}
                key={chat && chat.chat[chat.chat.length]?.text + chat.chat?.length}
            >
                {messages.map((message: any, index: number) => {
                    return (
                        <Box key={index + message.text} mb={10}>
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
