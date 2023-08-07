import React from "react";
import { Flex, Text, Avatar, Button } from "@mantine/core";
import { MuteMemberChannelDto } from "../type";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/api";
import chatSocket from "@/socket/chatSocket";
import { notifications } from "@mantine/notifications";

interface propsMuteList {
    muteList: any;
    getMembers: any;
    members: any;
    chat: any;
    getMuteList: any;
}

export function MuteList({ muteList, getMembers, members, chat, getMuteList }: propsMuteList) {
    function unMuteMember(id: number) {
        let body: MuteMemberChannelDto = {
            channelId: chat.id,
            userId: id,
            timeoutMs: 1,
        };
        console.log(body);

        api.post(`/user/set_user_as_unmuted_of_channel`, body)
            .then((res: AxiosResponse) => {
                chatSocket.emit("reconnect");
                getMembers();
                getMuteList();
                notifications.show({
                    title: "Unmuted",
                    message: res.data.message ?? `You unmuted ${members.find((member: any) => member.id == id).name} from ${chat.name}`,
                    color: "green",
                    autoClose: 5000,
                });
            })
            .catch((error: AxiosError<{ message: string }>) => {
                notifications.show({
                    title: "Error",
                    message: error?.response?.data.message ?? "Something went wrong",
                    color: "red",
                    autoClose: 5000,
                });
            });
    }

    return (
        <>
            <Text fz="sm" color="gray.5">
                <Text fw="bold" fz="sm" component="span">
                    {muteList.length}
                </Text>{" "}
                Muted
            </Text>
            {muteList.map((member: any) => (
                <Flex justify="space-between" align="center" py={5} px={15} key={member.id}>
                    <Flex align="center" gap={10}>
                        <Avatar size={30} radius="xl" src={member.avatarUrl} />
                        <Text fz="sm">{member.name}</Text>
                    </Flex>
                    <Button
                        variant="light"
                        color="gray"
                        size="xs"
                        onClick={() => {
                            unMuteMember(member.id);
                        }}
                    >
                        Unmute
                    </Button>
                </Flex>
            ))}
        </>
    );
}
