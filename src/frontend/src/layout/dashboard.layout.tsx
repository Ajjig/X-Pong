// Import dependencies
import { use, useEffect, useRef, useState } from "react";
import { useMantineTheme, Box, Grid, Button, MediaQuery, Space, MantineTheme, LoadingOverlay, Modal, Loader, Flex, createStyles } from "@mantine/core";

// Import components
import HeaderDashboard from "../Components/header";
import List_of_chats from "../Components/dashboard/list_of_chats";
import PublicGroups from "../Components/dashboard/popular_groups";
import { Chat } from "@/Components/dashboard/chat/private_chat/chat";

// Import store
import store, { setCurrentChat, setOpp } from "@/store/store";
import UserInfo from "@/Components/dashboard/userInfo";

export function DashboardLayout() {
    const theme = useMantineTheme();
    const [chat, setChat] = useState<any>(null);
    const HeaderRef = useRef<HTMLDivElement>(null);
    const [fullHeight, setFullHeight] = useState<any>({
        height: `calc(100vh - ${HeaderRef.current?.clientHeight}px)`,
    });
    const userInfoCardRef = useRef<HTMLDivElement>(null);
    const [List_chats_heigth, setList_chats_heigth] = useState<any>({
        maxHeight: `calc(100% - ${userInfoCardRef.current?.clientHeight ?? 0 + 15}px)`,
    });

    useEffect(() => {
        setChat(store.getState().chats.currentChat);
        store.subscribe(() => {
            const s = store.getState().chats.currentChat;
            if (s) setChat(s);
        });
        setFullHeight({
            height: `calc(100vh - ${HeaderRef.current?.clientHeight}px)`,
        });
        setList_chats_heigth({
            height: `calc(100% - ${userInfoCardRef.current?.clientHeight ?? 0 + 15}px)`,
        });
    }, []);

    const setSelected = (chat: any) => {
        setChat(chat);
        // set current chat in store to chat
        store.dispatch(store.dispatch(setCurrentChat(chat)));
    };

    return (
        <Box mih="100vh" pos="relative">
            <HeaderDashboard HeaderRef={HeaderRef} />
            <Grid gutter="0" w={"100%"} px="lg" pt={0}>
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <Grid.Col span={5} lg={4} xl={3} sx={{ display: "flex", flexDirection: "column" }} p={"md"} pt={0}>
                        <Box>
                            <UserInfo />
                        </Box>
                        <Space h="15px" />
                        <Box sx={{ flex: 1 }}>
                            <List_of_chats />
                        </Box>
                    </Grid.Col>
                </MediaQuery>

                <Grid.Col span={7} lg={8} xl={9} sx={fullHeight} p="md" pt={0}>
                    {chat ? (
                        <Chat user={chat} setSelected={setSelected} chat={chat} />
                    ) : (
                        <Box
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
                            {/* <PublicGroups /> */}
                        </Box>
                    )}
                </Grid.Col>
            </Grid>

            <Box
                w={"auto"}
                h={50}
                sx={(theme: MantineTheme) => ({
                    position: "absolute",
                    bottom: 30,
                    right: 30,
                })}
            >
                {<Play />}
            </Box>
        </Box>
    );
}

import { Menu } from "@mantine/core";
import { IconUserCircle, IconArrowsRandom } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import socketGame from "@/socket/gameSocket";
import { useRouter } from "next/router";

const useModelStyle = createStyles((theme) => ({
    content: {
        backgroundColor: "transparent",
    },
    overlay: {
        backdropFilter: "blur(5px)",
    },
}));

function Play() {
    const [visible, { close, open }] = useDisclosure(false);
    const ModelStyle = useModelStyle();
    const router = useRouter();

    const join = () => {
        open();
        // join request
        socketGame.emit("join", { msg: "join" });
    };

    const cancel = () => {
        close();
        // cancel request
        socketGame.emit("cancel-join", { msg: "cancel" });
    };

    useEffect(() => {
        socketGame.on("match", (data) => {
            console.log(data);
            store.dispatch(setOpp(data));
            router.push(`/game/${data.roomName}`);
        });
    }, []);

    return (
        <>
            <Modal opened={visible} onClose={close} title="" centered withCloseButton={false} closeOnClickOutside={false} classNames={ModelStyle.classes}>
                <Flex direction="column" align="center" justify="center">
                    <Loader />
                    <Space h={50} />
                    <Button variant="outline" onClick={cancel}>
                        Cancel
                    </Button>
                </Flex>
            </Modal>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <Button size="md">Play</Button>
                </Menu.Target>

                <Menu.Dropdown ml={-15}>
                    <Menu.Label>Play</Menu.Label>
                    <Menu.Item icon={<IconUserCircle size={18} />}>Challenge a friend</Menu.Item>
                    <Menu.Item icon={<IconArrowsRandom size={18} />} onClick={join}>
                        Play with random
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
}
