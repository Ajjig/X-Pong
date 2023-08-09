import { Box, Divider, MantineTheme, Navbar, Space, Text, Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import store from "@/store/store";
import { Chat } from "./Chat";
import { spotlight } from "@mantine/spotlight";
import { IconMessage } from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";

export function ListChats({ SegRef }: { SegRef: any }) {
    const [chats, setChats] = useState<any>([]);

    useEffect(() => {
        setChats(store.getState().chats.PrivateChats);
        store.subscribe(() => {
            const chatsFromStore = store.getState().chats.PrivateChats;

            setChats(() => {
                return chatsFromStore;
            });
        });
    }, []);

    return (
        <>
            <Box
                w={"100%"}
                h={`calc(100% - ${SegRef.current?.clientHeight}px)`}
                p={"12px"}
                sx={(theme: MantineTheme) => ({
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
                        <Box key={chat?.privateChannelId ?? index} py={4}>
                            <Chat chat={chat} />
                        </Box>
                    );
                })}
            </Box>
        </>
    );
}
