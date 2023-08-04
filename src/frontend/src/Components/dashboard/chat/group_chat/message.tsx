import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Input, MantineProvider, Text, useMantineTheme, Space } from "@mantine/core";
import store from "@/store/store";

export function Message({ message }: { message: any }) {
    const theme = useMantineTheme();

    return (
        <Flex justify={message.sender == store.getState().profile.user.username ? "flex-end" : "flex-start"}>
            <Box
                m={10}
                p={10}
                bg={message.sender == store.getState().profile.user.username ? "gray.9" : "gray.8"}
                sx={{
                    borderRadius:
                        message.sender == store.getState().profile.user.username
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
                        {message.sender == store.getState().profile.user.username ? "Me" : message.sender}
                    </Text>
                    <Space h={20} />
                </Flex>
                <Text fz="sm">{message.content}</Text>
            </Box>
        </Flex>
    );
}
