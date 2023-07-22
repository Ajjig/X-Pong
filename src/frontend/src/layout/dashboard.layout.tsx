// Import dependencies
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMantineTheme, AppShell, Navbar, Box } from "@mantine/core";

// Import components
import HeaderDashboard from "../Components/header";
import List_of_chats from "../Components/dashboard/list_of_chats";
import PublicGroups from "../Components/dashboard/popular_groups";
import { Chat } from "@/Components/dashboard/chat/private_chat/chat";

// Import store
import store from "@/store/store";

const AsideWidth = "300px";

export function DashboardLayout() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [chat, setChat] = useState<any>(null);

    useEffect(() => {
        setChat(store.getState().chats.currentChat);
        store.subscribe(() => {
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
                        <List_of_chats setChat={setChat} />
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
                                <Chat
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
