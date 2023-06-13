import { Avatar, Box, Flex, useMantineTheme, Text, Divider } from "@mantine/core";
import React from "react";
import { motion } from "framer-motion";
import store, { setCurrentChat } from "@/store/store";

export function Chat({ chat }: { chat: any }) {
    const theme = useMantineTheme();
    return (
        <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.1,
            }}
            initial={{
                opacity: 0,
                background: "#1a1b1e",
                borderRadius: theme.radius.md,
            }}
            whileHover={{
                background: theme.colors.gray[9],
                borderRadius: theme.radius.md,
            }}
            onClick={() => {
                store.dispatch(setCurrentChat(chat));
            }}
        >
            <Flex p="sm" align="center">
                <Avatar src={chat.avatar} size="45px" radius="xl" />
                <Flex justify="space-between" w="100%">
                    <Box ml={15}>
                        <Text fz="md" fw="bold" color="gray.1">
                            {chat.name}
                        </Text>
                        <Text color="gray.5" fz="sm">
                            {chat.last_message}
                        </Text>
                    </Box>
                    <Box color="gray" fz="xs">
                        {chat.time}
                    </Box>
                </Flex>
            </Flex>
        </motion.div>
    );
}
