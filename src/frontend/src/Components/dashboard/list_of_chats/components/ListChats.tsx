import { Box, Divider, MantineTheme, Navbar, Space, Text, Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import store from "@/store/store";
import { Chat } from "./Chat";
import { spotlight } from "@mantine/spotlight";
import { IconMessage } from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";

export function ListChats({}: {}) {
    const [chats, setChats] = useState<any>([]);

    useEffect(() => {
        setChats(store.getState().chats.PrivateChats);
    
        store.subscribe(() => {
            const chatsFromStore = store.getState().chats.PrivateChats;
            setChats(() => {
                // filter chats that have no messages
                const filteredChats = chatsFromStore.filter((chat: any) => {
                    return chat.chat.length > 0;
                });
                return filteredChats;
            });
        });
    }, []);

    return (
        <>
            <Box w={"100%"} h="100%" p="md">
                <Navbar.Section>
                    {chats.length <= 0 && (
                        <Box
                            sx={(theme: MantineTheme) => ({
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                height: "30vh",
                                width: "100%",
                                color: theme.colors.gray[6],
                                flexDirection: "column",
                            })}
                        >
                            <IconMessage size={50} />
                            <Space h={5} />
                            <Text>No chats yet</Text>
                        </Box>
                    )}
                    {chats?.map((chat: any, index: number) => {
                        if (chat.chat.length == 0) return null;
                        return (
                            <Box key={index}>
                                <Space py={2} />
                                <Chat chat={chat} />
                                <Space py={2} />
                                <Divider />
                            </Box>
                        );
                    })}
                </Navbar.Section>
            </Box>
            {/* floating add button in the buttom */}
            <Box
                sx={(theme: MantineTheme) => ({
                    position: "absolute",
                    bottom: theme.spacing.md,
                    right: theme.spacing.md,
                })}
            >
                <Tooltip color="gray" label="Search (mod + s)" position="top">
                    <Box
                        sx={(theme: MantineTheme) => ({
                            borderRadius: "100%",
                            background: theme.colors.orange[8],
                            width: 50,
                            height: 50,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            color: theme.colors.orange[1],
                        })}
                        onClick={() => {
                            spotlight.open();
                        }}
                    >
                        <IconSearch size={25} />
                    </Box>
                </Tooltip>
            </Box>
        </>
    );
}
