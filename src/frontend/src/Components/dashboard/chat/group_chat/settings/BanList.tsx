import React from "react";
import { Flex, Text, Avatar, Button, Space } from "@mantine/core";
import { BanMemberChannelDto } from "../type";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/api";
import { notifications } from "@mantine/notifications";
import { imageUrl } from "@/Components/imageUrl";

export function BanList({ banList, chat, getBanList, getMembers }: any) {
    function unbanMember(member: { id: number; name: string; avatarUrl: string }, chat: { id: number; name: string }) {
        let body: BanMemberChannelDto = {
            channelId: chat.id,
            BannedId: member.id,
        };
        // console.log(body);

        api.post(`/user/set_user_as_unbanned_of_channel/`, body)
            .then((res: AxiosResponse) => {
                // console.log(res.data);
                getBanList();
                getMembers();
                notifications.show({
                    title: "Unbanned",
                    message: res.data.message ?? `You unbanned ${member.name} from ${chat.name}`,
                    color: "green",
                    autoClose: 5000,
                });
            })
            .catch((err: AxiosError<{ message: string }>) => {
                notifications.show({
                    title: "Error",
                    message: err?.response?.data.message ?? "Something went wrong",
                    color: "red",
                    autoClose: 5000,
                });
            });
    }

    return (
        <>
            <Text fz="sm" color="gray.5">
                <Text fw="bold" fz="sm" component="span">
                    {banList.length}
                </Text>{" "}
                Banned
            </Text>
            <Space h={8} />
            {banList.map((member: any) => (
                <Flex justify="space-between" align="center" py={5} px={15} key={member.id}>
                    <Flex align="center" gap={10}>
                        {member?.id && <Avatar size={30} radius="xl" src={api.getUri() + `user/avatar/${member?.id}`} />}
                        <Text fz="sm">{member.name}</Text>
                    </Flex>

                    <Button
                        variant="light"
                        color="gray"
                        size="xs"
                        onClick={() => {
                            unbanMember(member, chat);
                        }}
                    >
                        Unban
                    </Button>
                </Flex>
            ))}
        </>
    );
}
