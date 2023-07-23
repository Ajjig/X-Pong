// Import dependencies
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMantineTheme, AppShell, Navbar, Box, Grid, Container, rem, MediaQuery } from "@mantine/core";

// Import components
import HeaderDashboard from "../Components/header";
import List_of_chats from "../Components/dashboard/list_of_chats";
import PublicGroups from "../Components/dashboard/popular_groups";
import { Chat } from "@/Components/dashboard/chat/private_chat/chat";

// Import store
import store from "@/store/store";

export function DashboardLayout() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [chat, setChat] = useState<any>(null);
    const HeaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChat(store.getState().chats.currentChat);
        store.subscribe(() => {
            const s = store.getState().chats.currentChat;
            if (s) setChat(s);
        });
        // console.log("Header Height: ", HeaderRef.current?.clientHeight);
    }, []);

    const fullHeight = {
        height: `calc(100vh - ${HeaderRef.current?.clientHeight}px)`,
    };

    return (
        <Box mih="100vh">
            <Box
                w="100%"
                bg={"blue"}
                sx={{
                    width: "100%",
                    height: "100%",
                }}
            >
                {/* <HeaderDashboard /> */}
            </Box>

            <HeaderDashboard HeaderRef={HeaderRef} />
            <Grid gutter="0" w={"100%"} px="lg" pt={0}>
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <Grid.Col span={5} lg={4} xl={3} sx={fullHeight} p="md" pt={0}>
                        <List_of_chats />
                    </Grid.Col>
                </MediaQuery>

                <Grid.Col span={7} lg={8} xl={9} sx={fullHeight} p="md" pt={0}>
                        {chat ? (
                            <Chat user={chat} setSelected={setChat} opened={opened} chat={chat} />
                        ) : (
                            <Box
                                bg={"red"}
                                p="md"
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
                        )}
                </Grid.Col>
            </Grid>

            {/* <Grid>
				<Grid.Col span={3}>
					<List_of_chats setChat={setChat} />
				</Grid.Col>
				<Grid.Col span={9}>
					<PublicGroups />
				</Grid.Col>
			</Grid> */}
        </Box>

        //     <AppShell
        //         styles={{
        //             main: {
        //                 background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        //                 height: "100vh",
        //                 overflow: "hidden",
        //             },
        //         }}
        //         navbarOffsetBreakpoint="sm"
        //         asideOffsetBreakpoint="sm"
        //         navbar={
        //             <Navbar hiddenBreakpoint="xs" hidden={!opened} width={{ xs: 350, lg: 400 }}>
        //                 <List_of_chats setChat={setChat} />
        //             </Navbar>
        //         }
        //         header={<HeaderDashboard />}
        //     >
        //         <AnimatePresence>
        //             {chat && (
        //                 <motion.div
        //                     key="modal"
        //                     initial={{ opacity: 0, transform: "translateX(-40%)", scale: 0.8 }}
        //                     animate={{ opacity: 1, transform: "translateX(0%)", scale: 1 }}
        //                     exit={{ opacity: 0, transform: "translateX(-40%) translateY(10%)", scale: 0 }}
        //                 >
        //                     <Box p="md">
        //                         <Chat
        //                             user={chat}
        //                             setSelected={setChat}
        //                             AsideWidth={AsideWidth}
        //                             opened={opened}
        //                             chat={chat}
        //                         />
        //                     </Box>
        //                 </motion.div>
        //             )}
        //             {!chat && (
        //                 <motion.div key="modal2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        //                     <Box
        //                         p="md"
        //                         mah="90vh"
        //                         sx={{
        //                             overflowY: "scroll",
        //                             /* ===== Scrollbar CSS ===== */
        //                             /* Firefox */
        //                             scrollbarColor: `${theme.colors.gray[8]} transparent`,
        //                             scrollbarWidth: "thin",
        //                             /* Chrome, Edge, and Safari */
        //                             "&::-webkit-scrollbar": {
        //                                 width: "5px",
        //                             },
        //                             "&::-webkit-scrollbar-track": {
        //                                 background: "transparent",
        //                             },
        //                             "&::-webkit-scrollbar-thumb": {
        //                                 background: theme.colors.gray[8],
        //                                 borderRadius: theme.radius.md,
        //                             },
        //                         }}
        //                     >
        //                         <PublicGroups />
        //                     </Box>
        //                 </motion.div>
        //             )}
        //         </AnimatePresence>
        //     </AppShell>
    );
}
