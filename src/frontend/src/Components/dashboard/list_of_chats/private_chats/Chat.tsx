import { Avatar, Box, Flex, useMantineTheme, Text, Divider } from "@mantine/core";
import React, { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import store, { setCurrentChat, setCurrentChatGroup } from "@/store/store";

export function Chat({ chat }: { chat: any }) {
    const theme = useMantineTheme();
    const [date, setDate] = useState<string>("");

    function get_last_message() {
        if (chat.chat.length == 0) return "No messages";
        const last_message = chat.chat[chat.chat.length - 1];
        return last_message.text;
    }

    function date_last_message(): string {
        if (chat.chat.length == 0) return "";
        const last_message = chat.chat[chat.chat.length - 1];
        
        const date = new Date(last_message.createdAt);
        const date_now = new Date();

        const date_diff = date_now.getTime() - date.getTime();

        const days = Math.floor(date_diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(date_diff / (1000 * 60 * 60));
        const minutes = Math.floor(date_diff / (1000 * 60));
        const seconds = Math.floor(date_diff / 1000);

        if (days > 0) {
            return `${days} days ago`;
        }
        if (hours > 0) {
            return `${hours} hours ago`;
        }
        if (minutes > 0) {
            return `${minutes} minutes ago`;
        }
        if (seconds > 0) {
            return `${seconds} seconds ago`;
        }
        return "now";
    }

    useEffect(() => {
        setDate(date_last_message());
        const timer = setInterval(() => {
            setDate(date_last_message());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Box
            bg={"gray.9"}
            sx={{
                borderRadius: theme.radius.lg,
                "&:hover": {
                    bg: "gray.8",
                },
            }}
            onClick={() => {
                store.dispatch(setCurrentChat(chat));
                store.dispatch(setCurrentChatGroup(null));
            }}
        >
            <Flex p="sm" align="center" sx={{cursor: "pointer"}}>
                <Avatar src={chat.otherUser.avatarUrl} size="45px" radius="xl" />
                <Flex justify="space-between" w="100%">
                    <Box ml={15}>
                        <Text fz="md" fw="bold" color="gray.1">
                            {chat.otherUser.name}
                        </Text>
                        <Text color="gray.5" fz="sm" lineClamp={1}>
                            {get_last_message()}
                        </Text>
                    </Box>
                    <Box color="gray" fz="xs">
                        {/* {date} */}
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
}
