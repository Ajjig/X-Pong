import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Input, Text, useMantineTheme, Avatar, MantineTheme, Paper, Stack, Badge } from "@mantine/core";
import { motion } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";
import store, { addNewMessageToGroupChat } from "@/store/store";
import { IconChevronLeft, IconLock, IconSend, IconShieldLock, IconUsersGroup } from "@tabler/icons-react";
import { PrivateChatMenu } from "../../list_of_chats/private_chats/privateChatMenu";
import chatSocket from "@/socket/chatSocket";
import { Message } from "./message";
import { TypeMessage } from "../../type";


export function ChatGroup({ user, setSelected, chat }: { user: any; setSelected: any; chat: any }) {
    const [friend] = useState<any>(chat.otherUser);
    const theme: MantineTheme = useMantineTheme();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [messages, setMessages] = useState<any>([]);

    useEffect(() => {
        if (!chatSocket.connected) chatSocket.connect();

        // store.getState().chats.GroupChats.forEach((chat: any) => {
        //     if (chat.name == chat.name) {
        //         setMessages(chat.messages);
        //         console.table(chat.messages);
        //     }
        // });

        chatSocket.on("PublicMessage", (data: TypeMessage) => {
            console.table(data);
            if (data.channelName == chat.name) {
                setMessages((prev: any) => [...prev, message]);
            }
        });

        setMessages(chat.messages);
        return () => {
            setMessages([]);
        };
    }, [chat]);

    const [message, setMessage] = useState("");
    const scrollRef = useRef<Readonly<HTMLDivElement> | null>(null);

    const sendMessage = (message: any) => {
        // protect from sending empty messages
        if (!message || message.message === "") return;

        // esnd message to the server
        chatSocket.emit("PublicMessage", {
            id: chat.id,
            msg: message.message,
        });

        const newMessage = {
            content: message.message,
            createdAt: new Date(),
            sender: store.getState().profile.user.username,
            name: chat.name,
        };
        // add message to messages
        setMessages((prev: any) => [...prev, newMessage]);
        store.dispatch(addNewMessageToGroupChat(newMessage));
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

    const icon = () => {
        if (chat.type == "private") {
            return <IconLock size={30} />;
        } else if (chat.type == "protected") {
            return <IconShieldLock size={30} />;
        }
        return <IconUsersGroup size={30} />;
    };

    const color = () => {
        if (chat.type == "private") {
            return "red";
        } else if (chat.type == "protected") {
            return "yellow";
        }
        return "purple";
    };

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
                >
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
                        {/* {isMobile || 1 ? <PrivateChatMenu user={} /> : null} */}
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
