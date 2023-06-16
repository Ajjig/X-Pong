import { Avatar, Box, Button, Divider, Grid, Group, Input, MantineTheme, Space } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useMantineTheme, Flex } from "@mantine/core";
// import Header from "./header";

import { AppShell, Navbar, Header, Footer, Aside, Text, MediaQuery, Burger } from "@mantine/core";
import HeaderDashboard from "./header";
import Chats from "./list_of_chats/chats";
import PublicGroups from "./public_groups";
import store from "@/store/store";
import { motion } from "framer-motion";
import { IconArrowNarrowLeft, IconSend } from "@tabler/icons-react";
import { PrivateChatMenu } from "./list_of_chats/components/privateChatMenu";
import AsideChatInfo from "./aside";
import { useMediaQuery } from "@mantine/hooks";

import { AnimatePresence } from "framer-motion";

export function DashboardLayout() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [chat, setChat] = useState<any>(null);

    const AsideWidth = "300px";

    useEffect(() => {
        setChat(store.getState().chats.currentChat);
        store.subscribe(() => {
            setChat(store.getState().chats.currentChat);
            console.log("chat", store.getState().chats.currentChat);
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
                    <motion.div
                        key="modal2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
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

function ChatContainer({
    user,
    setSelected,
    AsideWidth,
    opened,
    chat,
}: {
    user: any;
    setSelected: any;
    AsideWidth: any;
    opened: any;
    chat: any;
}) {
    const theme = useMantineTheme();
    const isMobile = useMediaQuery("(max-width: 768px)");
    // const [user, setUser] = useState(user);

    const [messages, setMessages] = useState([
        {
            id: 0,
            message: "Hello",
            time: "12:00",
            from: "me",
        },
        {
            id: 1,
            message: "Hello",
            time: "12:00",
            from: "other",
        },
        {
            id: 2,
            message: "fin awlad latifa? 💁👌🎍😍",
            time: "12:00",
            from: "me",
        },
    ]);

    const [message, setMessage] = useState("");
    const scrollRef = useRef<Readonly<HTMLDivElement> | null>(null);

    const sendMessage = (message: any) => {
        if (!message || message.message === "") return;
        setMessages([...messages, message]);
        setMessage("");
    };

    useEffect(() => {
        //get the last message
        const lastMessage = scrollRef.current?.lastElementChild;
        // scroll to the last message
        lastMessage?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Box>
            <Flex>
                <motion.div
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
                        <Avatar src={user.avatar} size="md" radius="xl" />
                        <Box ml={-6}>
                            <Text fw="bold" fz="md">
                                {user.name}
                            </Text>
                        </Box>
                    </Group>
                    {isMobile || 1 ? <PrivateChatMenu user={user} /> : null}
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
            >
                {messages.map((message, index) => (
                    <Box key={index} mb={10}>
                        <Message message={message} username={user.name} />
                    </Box>
                ))}
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
                                    id: 1,
                                    message: message,
                                    time: "12:00",
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
                                id: 1,
                                message: message,
                                time: "12:00",
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

function Message({ message, username }: { message: any; username: string }) {
    const theme = useMantineTheme();
    return (
        <Box>
            <Flex justify={message.from === "me" ? "flex-end" : "flex-start"}>
                <Box
                    m={10}
                    p={10}
                    bg={message.from === "me" ? "gray.9" : "gray.8"}
                    sx={{
                        borderRadius:
                            message.from !== "me"
                                ? `${theme.radius.lg} ${theme.radius.lg} ${theme.radius.lg} ${0}`
                                : `${theme.radius.lg} ${theme.radius.lg} ${0} ${theme.radius.lg}`,
                        maxWidth: "500px",
                        wordWrap: "break-word",
                    }}
                >
                    {/* name and message */}
                    <Flex justify="space-between">
                        <Text fz="xs" color="gray.5">
                            {message.from === "me" ? "Me" : username}
                        </Text>
                        <Space w={20} />
                        <Text fz="xs" color="gray.5">
                            {message.time}
                        </Text>
                    </Flex>
                    <Text fz="sm">{message.message}</Text>
                </Box>
            </Flex>
        </Box>
    );
}
