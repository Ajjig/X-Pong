import { Box, Divider, MantineTheme, Navbar, Space, Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import store from "@/store/store";
import { Chat } from "../private_chats/Chat";
import { IconMessage, IconPlus } from "@tabler/icons-react";
import { CreateNewGroup } from "./create_new_group";
import { Group } from "./group";

export function ListGroups({}: {}) {
    const [chats, setChats] = useState<any>([]);

    useEffect(() => {
        setChats(store.getState().chats.GroupChats);
        store.subscribe(() => {
            const chatsFromStore = store.getState().chats.GroupChats;
            setChats(chatsFromStore);
        });
        // console.table(store.getState().chats.GroupChats);
    }, []);

    return (
        <>
            <Box
                w={"100%"}
                h={`calc(100%)`}
                // bg='red'
                p={"12px"}
                sx={(theme: MantineTheme) => ({
                    // flex: 1,
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
                })}
            >
                {chats.length <= 0 && (
                    <Box
                        sx={(theme: MantineTheme) => ({
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            color: theme.colors.gray[6],
                            flexDirection: "column",
                        })}
                    >
                        <IconMessage size={50} />
                    </Box>
                )}
                {chats?.map((chat: any, index: number) => {
                    // if (chat.chat.length == 0) return null;
                    return (
                        <Box key={index}>
                            <Space py={2} />
                            {/* <Chat chat={chat} /> */}
                            <Group groupInfo={chat} />
                            <Space py={2} />
                            {/* <Divider /> */}
                        </Box>
                    );
                })}
            </Box>

            {/* floating add button in the buttom */}
            <Box
                sx={(theme: MantineTheme) => ({
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                })}
            >
                <CreateNewGroup>
                    <Tooltip color="gray" label="Create new group" position="top" withArrow>
                        <Box
                            sx={(theme: MantineTheme) => ({
                                borderRadius: "100%",
                                background: theme.colors.purple[8],
                                width: 50,
                                height: 50,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                color: theme.colors.gray[1],
                            })}
                            onClick={() => {}}
                        >
                            <IconPlus size={25} />
                        </Box>
                    </Tooltip>
                </CreateNewGroup>
            </Box>
        </>
    );
}
