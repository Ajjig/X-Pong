import React from "react";
import { Flex, Avatar, Title, Paper, Space } from "@mantine/core";

export function Match_info({ player1, player2, result, children }: any) {
    return (
        <Paper radius={20} bg={"cos_black.3"} p="sm">
            <Flex p={5} align="center" justify="space-between">
                <Flex align="center">
                    <Avatar size={50} radius="xl" src="https://picsum.photos/201" />
                    <Space w={10} />
                    <Title color="gray.4" fz="md">
                        Username
                    </Title>
                </Flex>
                <Flex align="center">
                    <Title color="gray.4" fz="lg">
                        {result}
                    </Title>
                </Flex>
                <Flex align="center">
                    <Title color="gray.4" fz="md">
                        Username
                    </Title>
                    <Space w={10} />
                    <Avatar size={50} radius="xl" src="https://picsum.photos/200" />
                </Flex>
            </Flex>
            {children && (
                <>
                    <Space h={20} />
                    <Flex p={5} align="center" justify="space-between">
                        {children}
                    </Flex>
                </>
            )}
        </Paper>
    );
}
