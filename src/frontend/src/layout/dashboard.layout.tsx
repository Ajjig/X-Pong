// Import dependencies
import { useEffect, useRef, useState } from "react";
import { useMantineTheme, Box, Grid, MediaQuery, Space } from "@mantine/core";

// Import components
import HeaderDashboard from "../Components/header";
import List_of_chats from "../Components/dashboard/list_of_chats";
import PublicGroups from "../Components/dashboard/popular_groups";
import { Chat } from "@/Components/dashboard/chat/private_chat/chat";

// Import store
import store from "@/store/store";
import UserInfo from "@/Components/dashboard/userInfo";
import { ChatGroup } from "@/Components/dashboard/chat/group_chat/group";

export function DashboardLayout() {
    const [chat, setChat] = useState<any>(null);
    const [Group, setGroup] = useState<any>(null);
    const HeaderRef = useRef<HTMLDivElement>(null);
    const [fullHeight, setFullHeight] = useState<any>({
        height: `calc(100vh - ${HeaderRef.current?.clientHeight}px)`,
    });

    useEffect(() => {
        setChat(store.getState().chats.currentChat);
        setGroup(store.getState().chats.currentChatGroup);

        store.subscribe(() => {
            const s = store.getState().chats.currentChat;
            if (s) {
                setChat(s);
                setGroup(null);
            }

            const g = store.getState().chats.currentChatGroup;
            if (g) {
                setGroup(g);
                setChat(null);
            }

            if (!s && !g) {
                setChat(null);
                setGroup(null);
            }
        });
        setFullHeight({
            height: `calc(100vh - ${HeaderRef.current?.clientHeight}px)`,
        });
    }, []);

    return (
        <Box h="100vh" pos="relative">
            <HeaderDashboard HeaderRef={HeaderRef} />
            <Grid gutter="0" w={"100%"} px="0" pt={0}>
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <Grid.Col
                        span={5}
                        lg={4}
                        xl={3}
                        sx={{ display: "flex", flexDirection: "column", height: `calc(100vh - ${HeaderRef.current?.clientHeight}px)` }}
                        p="sm"
                    >
                        <Box>
                            <UserInfo />
                        </Box>
                        <Space h="15px" />
                        <List_of_chats />
                    </Grid.Col>
                </MediaQuery>

                <Grid.Col span={12} sm={7} lg={8} xl={9} style={fullHeight} p="sm">
                    {chat && <Chat user={chat} setSelected={setChat} chat={chat} key={chat && chat.privateChannelId} />}
                    {Group && <ChatGroup user={Group} setSelected={setGroup} chat={Group} key={Group && Group.id} />}
                    {!chat && !Group && <PublicGroups HeaderHeight={HeaderRef.current?.clientHeight} />}
                </Grid.Col>
            </Grid>
        </Box>
    );
}
