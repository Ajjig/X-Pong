import { Flex, Text, Button, Avatar, Badge, Menu, Space } from "@mantine/core";
import { LeaveTheGroup } from "./LeaveGroup";
import { IconCrown, IconCrownOff, IconKarate, IconSettings2, IconVolume3 } from "@tabler/icons-react";
import { BanMemberChannelDto, KickMemberChannelDto, MuteMemberChannelDto, RemoveAdminDto, SetUserAsAdminDto } from "../type";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/api";
import chatSocket from "@/socket/chatSocket";
import { notifications } from "@mantine/notifications";
import store from "@/store/store";
import { IconBan } from "@tabler/icons-react";

interface propsListMembers {
    members: any;
    chat: any;
    muteList: any;
    getMembers: any;
    getMuteList: any;
    getBanList: any;
    setInvited: any;
}

export function ListMembers({ members, chat, muteList, getMembers, getMuteList, getBanList, setInvited }: propsListMembers) {
    return (
        <>
            <Flex justify="space-between" align="center">
                <Text fz="sm" color="gray.5">
                    <Text fw="bold" fz="sm" component="span">
                        {members.length}
                    </Text>{" "}
                    Members
                </Text>
                <Flex>
                    <Button variant="light" color="gray" size="xs" onClick={() => setInvited.open()}>
                        Add
                    </Button>
                    <Space w={10} />
                    <LeaveTheGroup chat={chat} />
                </Flex>
            </Flex>
            {members.map((member: any) => {
                // dont show it if the member oin in mute list
                if (muteList.find((m: any) => m.id == member.id)) return null;
                return (
                    <Flex justify="space-between" align="center" py={5} px={15} key={member.id}>
                        <Flex align="center" gap={10}>
                            {member?.id && <Avatar size={30} radius="xl" src={api.getUri() + `user/avatar/${member.id}`} />}
                            <Text fz="sm">{member.name}</Text>
                            {(chat.adminsIds.includes(member.id) || chat.ownerId == member.id) && (
                                <Badge
                                    color={chat.ownerId == member.id ? "purple" : "gray"}
                                    variant="filled"
                                    size="xs"
                                    leftSection={
                                        chat.ownerId == member.id ? (
                                            <Flex align="center" gap={5}>
                                                <IconCrown size={15} />
                                            </Flex>
                                        ) : null
                                    }
                                >
                                    {chat.ownerId == member.id ? "Owner" : chat.adminsIds.includes(member.id) ? "Admin" : null}
                                </Badge>
                            )}
                        </Flex>
                        <MemberMenu member={member} chat={chat} getMembers={getMembers} getMuteList={getMuteList} getBanList={getBanList} members={members} />
                    </Flex>
                );
            })}
        </>
    );
}

function MemberMenu({ member, chat, getMembers, getMuteList, getBanList, members }: any) {
    function makeAdmin(id: number) {
        console.log("make admin");
        const body: SetUserAsAdminDto = {
            channelId: chat.id,
            newAdminId: id,
        };
        console.log(body);
        api.post(`/user/set_user_as_admin_of_channel`, body)
            .then((res: AxiosResponse) => {
                console.log(res.data);
                chatSocket.emit("reconnect");
            })
            .catch((error: AxiosError) => {
                // console.log(error.response);
            });
    }

    function removeAdmin(id: number) {
        console.log("remove admin");
        const body: RemoveAdminDto = {
            channelId: chat.id,
            userId: id,
        };
        console.log(body);
        api.post(`/user/remove_admin_from_channel`, body)
            .then((res: AxiosResponse) => {
                console.log(res.data);
                chatSocket.emit("reconnect");
            })
            .catch((error: AxiosError) => {
                // console.log(error.response);
            });
    }

    function KickMember(id: number) {
        let body: KickMemberChannelDto = {
            channelId: chat.id,
            kickedId: id,
        };

        api.post(`/user/set_user_as_kicked_of_channel`, body)
            .then((res: AxiosResponse) => {
                console.log(res.data);
                notifications.show({
                    title: "Kicked",
                    message: res.data.message ?? `You kicked ${members.find((member: any) => member.id == id).name} from ${chat.name}`,
                    color: "green",
                    autoClose: 5000,
                });
                chatSocket.emit("reconnect");
                getMembers();
            })
            .catch((error: AxiosError) => {
                // console.log(error.response);
            });
    }

    function MuteMember(id: number, time: number) {
        let body: MuteMemberChannelDto = {
            channelId: chat.id,
            userId: id,
            timeoutMs: time,
        };
        console.log(body);

        api.post(`/user/set_user_as_muted_of_channel`, body)
            .then((res: AxiosResponse) => {
                chatSocket.emit("reconnect");
                getMembers();
                getMuteList();
                notifications.show({
                    title: "Muted",
                    message: res.data.message ?? `You muted ${members.find((member: any) => member.id == id).name} from ${chat.name}`,
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

    function BanMember(id: number) {
        let body: BanMemberChannelDto = {
            channelId: chat.id,
            BannedId: id,
        };
        console.log(body);
        api.post(`/user/set_user_as_banned_of_channel`, body)
            .then((res: AxiosResponse) => {
                console.log(res.data);
                chatSocket.emit("reconnect");
                getMembers();
                getBanList();
                notifications.show({
                    title: "Banned",
                    message: res.data.message ?? `You banned ${members.find((member: any) => member.id == id).name} from ${chat.name}`,
                    color: "green",
                    autoClose: 5000,
                });
            })
            .catch((error: AxiosError) => {
                // console.log(error.response);
            });
    }

    return (
        <Menu shadow="md" width={200} position="right" withArrow arrowSize={14} arrowOffset={15}>
            {store.getState().profile.user.id != member.id &&
                (chat.adminsIds.includes(store.getState().profile.user.id) || store.getState().profile.user.id == chat.ownerId) && (
                    <Menu.Target>
                        <Button variant="light" color="gray" size="xs">
                            <IconSettings2 size={15} />
                        </Button>
                    </Menu.Target>
                )}

            <Menu.Dropdown>
                {chat.adminsIds.includes(member.id) && (
                    <Menu.Item
                        icon={<IconCrownOff size={18} />}
                        onClick={() => {
                            removeAdmin(member.id);
                        }}
                    >
                        Remove Admin
                    </Menu.Item>
                )}
                {!chat.adminsIds.includes(member.id) && (
                    <Menu.Item
                        icon={<IconCrown size={18} />}
                        onClick={() => {
                            makeAdmin(member.id);
                        }}
                    >
                        Make Admin
                    </Menu.Item>
                )}
                <Menu.Item icon={<IconKarate size={18} />} onClick={() => KickMember(member.id)}>
                    Kick
                </Menu.Item>
                <Menu.Item icon={<IconBan size={18} />} onClick={() => BanMember(member.id)}>
                    Ban
                </Menu.Item>

                <Menu.Item icon={<IconVolume3 size={18} />} closeMenuOnClick={false}>
                    <Menu shadow="md" position="top" withArrow arrowSize={14} arrowOffset={15}>
                        <Menu.Target>
                            <Text>Mute</Text>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item onClick={() => MuteMember(member.id, 86400000)}>1 day</Menu.Item>
                            <Menu.Item onClick={() => MuteMember(member.id, 3600000)}>1 hour</Menu.Item>
                            <Menu.Item onClick={() => MuteMember(member.id, 300000)}>5 minutes</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
