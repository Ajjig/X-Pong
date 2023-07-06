import { Avatar, Box, Button, Divider, Grid, Group, Input, MantineTheme, Space } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useMantineTheme, Flex } from "@mantine/core";
import { AppShell, Navbar, Text } from "@mantine/core";
import HeaderDashboard from "./header";
import Chats from "./list_of_chats/chats";
import PublicGroups from "./public_groups";
import { motion } from "framer-motion";
import { IconArrowNarrowLeft, IconSend } from "@tabler/icons-react";
import { PrivateChatMenu } from "./list_of_chats/components/privateChatMenu";
import { useMediaQuery } from "@mantine/hooks";
import { AnimatePresence } from "framer-motion";

import store, { setCurrentChat, setNewMessage } from "@/store/store";

export function DashboardLayout() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    const AsideWidth = "300px";
    const [chat, setChat] = useState<any>(null);

    useEffect(() => {
        setChat(store.getState().chats.currentChat);
        store.subscribe(() => {
            // console.log("container app just updated", store.getState().chats.currentChat);
            const s = store.getState().chats.currentChat;
            if (s) setChat(s);
        });
    }, []);

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
                    height: "100vh",
                    overflow: "hidden",
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar hiddenBreakpoint="xs" hidden={!opened} width={{ xs: 350, lg: 400 }}>
                    <Chats setChat={setChat} />
                </Navbar>
            }
            header={<HeaderDashboard />}
        >
            <AnimatePresence>
                {chat && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, transform: "translateX(-40%)", scale: 0.8 }}
                        animate={{ opacity: 1, transform: "translateX(0%)", scale: 1 }}
                        exit={{ opacity: 0, transform: "translateX(-40%) translateY(10%)", scale: 0 }}
                    >
                        <Box p="md">
                            <ChatContainer
                                // key={chat && chat.chat[chat.chat.length - 1].text}
                                user={chat}
                                setSelected={setChat}
                                AsideWidth={AsideWidth}
                                opened={opened}
                                chat={chat}
                            />
                        </Box>
                    </motion.div>
                )}
                {!chat && (
                    <motion.div key="modal2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Box
                            p="md"
                            mah="90vh"
                            sx={{
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
                        >
                            <PublicGroups />
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppShell>
    );
}

function ChatContainer({ user, setSelected, chat }: { user: any; setSelected: any; AsideWidth: any; opened: any; chat: any }) {
    const [friend, setFriend] = useState<any>(chat.otherUser);
    const theme = useMantineTheme();
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
    }, []);

    const [message, setMessage] = useState("");
    const scrollRef = useRef<Readonly<HTMLDivElement> | null>(null);

    const sendMessage = (message: any) => {
        if (!message || message.message === "") return;
        store.getState().io.socket?.emit("message", {
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
        <Box>
            <Flex>
                <motion.div
                    style={{
                        cursor: "pointer",
                    }}
                    transition={{
                        duration: 0.1,
                    }}
                    key="modal"
                    initial={{
                        opacity: 0,
                        background: "rgba(0,0,0,0)",
                        borderRadius: theme.radius.md,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        background: "rgba(0,0,0,0)",
                        borderRadius: theme.radius.md,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    whileHover={{
                        scale: 1.2,
                        background: theme.colors.gray[9],
                        borderRadius: theme.radius.md,
                    }}
                    onClick={() => setSelected(null)}
                >
                    <IconArrowNarrowLeft size={25} />
                </motion.div>
                <Space w={10} />
                <Flex justify="space-between" w="100%">
                    <Group w={"100%"}>
                        <Avatar src={friend.avatarUrl} size="md" radius="xl" />
                        <Box ml={-6}>
                            <Text fw="bold" fz="md">
                                {friend.name}
                            </Text>
                        </Box>
                    </Group>
                    {isMobile || 1 ? <PrivateChatMenu user={friend} /> : null}
                </Flex>
            </Flex>
            <Divider mt="md" size="xs" color="gray.7" />
            <Box
                px={10}
                pt={0}
                sx={{
                    overflowY: "scroll",
                    height: "calc(100vh - 237px)",

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
                key={chat && chat.chat[chat.chat.length - 1].text}
            >
                {messages.map((message: any, index: number) => {
                    return (
                        <Box key={index + message.text} mb={10}>
                            <Message message={message} friend={friend} />
                        </Box>
                    );
                })}
            </Box>
            <Divider mb="xs" size="xs" color="gray.7" />
            <Box>
                <Flex justify="space-between" gap={10} align="center">
                    <Input
                        sx={(theme: MantineTheme) => ({
                            // change outline color on focus
                            "&:focus": {
                                outline: `1px solid ${theme.colors.orange[6]} !important`,
                                outlineOffset: 2,
                            },
                        })}
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage({
                                    message: message,
                                    from: "me",
                                });
                            }
                        }}
                        w="100%"
                    />
                    <Button
                        variant="outline"
                        color="gray"
                        size="xs"
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
            </Box>
        </Box>
    );
}

function Message({ message, friend }: { message: any; friend: any }) {
    const theme = useMantineTheme();

    return (
        <Flex justify={friend.id !== message.senderId ? "flex-end" : "flex-start"}>
            <Box
                m={10}
                p={10}
                bg={friend.id !== message.senderId ? "gray.9" : "gray.8"}
                sx={{
                    borderRadius:
                        friend.id !== message.senderId
                            ? `${theme.radius.lg} ${theme.radius.lg} ${0} ${theme.radius.lg}`
                            : `${theme.radius.lg} ${theme.radius.lg} ${theme.radius.lg} ${0}`,
                    maxWidth: "500px",
                    wordWrap: "break-word",
                    minWidth: "200px",
                    [theme.fn.smallerThan("sm")]: {
                        minWidth: "auto",
                    },
                }}
            >
                {/* name and message */}
                <Flex justify="space-between">
                    <Text fz="10px" color="gray.6">
                        {friend.id !== message.senderId ? "Me" : friend.name}
                    </Text>
                    <Space h={20} />
                </Flex>
                <Text fz="sm">{message.text}</Text>
            </Box>
        </Flex>
    );
}
