import React from "react";
import { Flex, Avatar, Title, Paper, Space } from "@mantine/core";
import store from "@/store/store";

export function Match_info({
    player1,
    player2,
    score,
    result,
    children,
    oppinfo,
}: {
    player1: any;
    player2: any;
    score: { player1: number; player2: number };
    result: any;
    children?: React.ReactNode;
    oppinfo: { roomName: string; player: number; opponentName: string };
}) {
    return (
        <Paper radius={30} bg={"cos_black.1"} p="sm">
            <Flex p={5} align="center" justify="space-between">
                <Flex align="center">
                    <Avatar size={40} radius="xl" src=  {oppinfo?.player === 2 ? oppinfo?.opponentName : store.getState().profile.user.avatarUrl} />
                    <Space w={10} />
                    <Title color="gray.4" fz="sm">
                        {oppinfo?.player === 2 ? oppinfo?.opponentName : "You"}
                    </Title>
                </Flex>
                <Flex align="center">
                    <Title color="gray.4" fz="lg">
                        {score?.player1} - {score?.player2}
                    </Title>
                </Flex>
                <Flex align="center">
                    <Title color="gray.4" fz="sm">
                        {oppinfo?.player === 1 ? oppinfo?.opponentName : "You"}
                    </Title>
                    <Space w={10} />
                    <Avatar size={40} radius="xl" src={
                        oppinfo?.player === 1 ? oppinfo?.opponentName : store.getState().profile.user.avatarUrl
                    } />
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
