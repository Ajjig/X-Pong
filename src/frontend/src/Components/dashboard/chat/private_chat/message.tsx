import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Input, MantineProvider, Text, useMantineTheme, Space } from "@mantine/core";

export function Message({ message, friend }: { message: any; friend: any }) {
    const theme = useMantineTheme();

    return (
        <Flex justify={friend.id !== message.senderId ? "flex-end" : "flex-start"}>
            <Box
                m={10}
                p={10}
                bg={friend.id !== message.senderId ? "gray.9" : "gray.8"}
                sx={{
                    borderRadius:
                        friend.id !== message.senderId
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
                {/* name and message */}
                <Flex justify="space-between">
                    <Text fz="10px" color="gray.6">
                        {friend.id !== message.senderId ? "Me" : friend.name}
                    </Text>
                    <Space h={20} />
                </Flex>
                <Text fz="sm">{message.text}</Text>
            </Box>
        </Flex>
    );
}