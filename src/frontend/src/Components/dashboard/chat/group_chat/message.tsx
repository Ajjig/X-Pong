import React from "react";
import { Box, Flex, Text, useMantineTheme, Space, Avatar } from "@mantine/core";
import store from "@/store/store";
import api from "@/api";

export function Message({ message }: { message: any }) {
    const theme = useMantineTheme();

    console.log(message);

    return (
        <Flex justify={message?.user?.username == store.getState().profile?.user?.username ? "flex-end" : "flex-start"}>
            <Flex align="flex-end" direction={message?.user?.username == store.getState().profile.user.username ? "row-reverse" : "row"}>
                {message?.senderId && (
                    <Avatar
                        size={25}
                        radius="xl"
                        m={4}
                        src={api.getUri() + `user/avatar/${message?.senderId}`}
                        mr={message?.user?.username == store.getState().profile.user.username ? 0 : -10}
                    />
                )}
                <Box
                    mr={message?.user?.username == store.getState().profile.user.username ? -10 : 0}
                    mb={20}
                    m={5}
                    p={10}
                    bg={message?.user?.username == store.getState().profile.user.username ? "gray.9" : "gray.8"}
                    sx={{
                        borderRadius:
                            message?.user?.username == store.getState().profile.user.username
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
                            {message.user.username == store.getState().profile.user.username ? "Me" : message?.user?.username}
                        </Text>
                        <Space h={20} />
                    </Flex>
                    <Text fz="sm">{message.content}</Text>
                </Box>
            </Flex>
        </Flex>
    );
}
