import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Input, MantineProvider, Text, useMantineTheme, Space, Avatar } from "@mantine/core";
import store from "@/store/store";
import { TypeMessage } from "../../type";

export function Message({ message }: { message: TypeMessage }) {
    const theme = useMantineTheme();

    return (
        <Flex justify={message.senderUsername == store.getState().profile.user.username ? "flex-end" : "flex-start"}>
            <Flex align="flex-end" direction={message.senderUsername == store.getState().profile.user.username ? "row-reverse" : "row"}>
                <Avatar size={25} radius="xl" m={4} src={message?.avatarUrl} mr={message.senderUsername == store.getState().profile.user.username ? 0 : -10} />
                <Box
                    mr={message.senderUsername == store.getState().profile.user.username ? -10 : 0}
                    mb={20}
                    m={5}
                    p={10}
                    bg={message.senderUsername == store.getState().profile.user.username ? "gray.9" : "gray.8"}
                    sx={{
                        borderRadius:
                            message.senderUsername == store.getState().profile.user.username
                                ? `${theme.radius.lg} ${theme.radius.lg} ${0} ${theme.radius.lg}`
                                : `${theme.radius.lg} ${theme.radius.lg} ${theme.radius.lg} ${0}`,
                        maxWidth: "500px",
                        wordWrap: "break-word",
                        minWidth: "200px",
                        [theme.fn.smallerThan("sm")]: {
                            minWidth: "auto",
                        },
                    }}
                >
                    <Flex justify="space-between">
                        <Text fz="10px" color="gray.6">
                            {message.senderUsername == store.getState().profile.user.username ? "Me" : message.senderUsername}
                        </Text>
                        <Space h={20} />
                    </Flex>
                    <Text fz="sm">{message.content}</Text>
                </Box>
            </Flex>
        </Flex>
    );
}
