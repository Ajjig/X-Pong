import React, { useEffect } from "react";
import { Modal, Box, LoadingOverlay, Flex, Space, Input, Button, ScrollArea, Text, Avatar, Tabs, SegmentedControl, Menu, Badge } from "@mantine/core";
import { useState } from "react";
import api from "@/api";
import { IconSettings, IconUsersGroup } from "@tabler/icons-react";
import store from "@/store/store";
import { AxiosError, AxiosResponse } from "axios";
import chatSocket from "@/socket/chatSocket";
import { ListMembers } from "./ListMembers";
import { MuteList } from "./MuteList";
import { BanList } from "./BanList";
import { useDisclosure } from "@mantine/hooks";
import { AddMemberChannelDto } from "./type";
import { Notifications } from "@mantine/notifications";

export function SettingGroupChat({ _chat, opened, open, close, children }: { _chat: any; opened: boolean; open: any; close: any; children: any }) {
    const [Loading, setLoading] = useState<boolean>(false);
    const [members, setMembers] = useState<any>([]);
    const [GroupType, setGroupType] = useState<string>(_chat.type);
    const [banList, setBanList] = useState<any>([]);
    const [muteList, setMuteList] = useState<any>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [invitedOpened, invited] = useDisclosure();

    useEffect(() => {
        // console.log("mount");
        invited.close();

        getMembers();
        if (_chat.ownerId == store.getState().profile.user.id || _chat.adminsIds.includes(store.getState().profile.user.id)) {
            getBanList();
            getMuteList();
        }
        chatSocket.emit("reconnect");

        return () => {
            // console.log("unmount");
        };
    }, [refresh]);

    function getMembers() {
        api.get(`/user/channels/userslist/${_chat.id}/`)
            .then((res) => {
                setMembers([...res.data]);
            })
            .catch((err: AxiosError) => {
                console.log(err.response);
            });
    }

    function getBanList() {
        api.get(`/user/channels/banned_users/${_chat.id}/`)
            .then((res: AxiosResponse) => {
                // console.log(res.data);
                setBanList([...res.data]);
            })
            .catch((err: AxiosError) => {
                // console.log(err.response);
            });
    }

    function getMuteList() {
        api.get(`/user/channels/muted_users/${_chat.id}/`)
            .then((res: AxiosResponse) => {
                setMuteList([...res.data]);
            })
            .catch((err: AxiosError) => {
                // console.log(err.response);
            });
    }

    return (
        <>
            <Box
                onClick={() => (chatSocket.emit("reconnect"), setRefresh(!refresh), open())}
                sx={{
                    cursor: "pointer",
                }}
            >
                {children}
            </Box>
            <Modal
                title={_chat.name}
                overlayProps={{
                    opacity: 0.55,
                    blur: 8,
                }}
                opened={opened}
                onClose={close}
                centered
                radius={30}
                withCloseButton={!Loading as boolean | undefined}
                padding={20}
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <LoadingOverlay visible={Loading} overlayBlur={3} />
                {invitedOpened ? (
                    <AddMember id={_chat.id} chat={_chat} members={members} />
                ) : (
                    <Main
                        setInvited={invited}
                        close={close}
                        GroupType={GroupType}
                        setGroupType={setGroupType}
                        getMembers={getMembers}
                        members={members}
                        getBanList={getBanList}
                        getMuteList={getMuteList}
                        banList={banList}
                        muteList={muteList}
                        setLoading={setLoading}
                        Loading={Loading}
                        _chat={_chat}
                    />
                )}
            </Modal>
        </>
    );
}
function AddMember({ chat, members }: any) {
    const [friends, setfriends] = useState<any>([]);

    useEffect(() => {
        getFriends();
    }, []);

    function getFriends() {
        api.get("/user/friends/list")
            .then((res: AxiosResponse) => {
                console.log(res?.data);
                setfriends(res?.data?.filter((friend: {FriendID: number}) => {
                    let found = false;
                    members.forEach((member: any) => {
                        if (member?.id == friend?.FriendID) {
                            found = true;
                        }
                    });
                    return !found;
                }))
                // setfriends(res?.data);
            })
            .catch((err: AxiosError) => {
                console.log(err.response);
            });
    }

    function addFriendToGroup(id: number) {
        let payload: AddMemberChannelDto = {
            channelId: chat.id,
            new_memberID: id,
        };

        console.log(payload);
        api.post("/user/set_user_as_member_of_channel", payload)
            .then((res: AxiosResponse) => {
                setfriends(friends.filter((friend: any) => friend?.friend?.id != id));
                Notifications.show({
                    title: "Success",
                    message: "Member added successfully",
                    color: "green",
                });
            })
            .catch((err: AxiosError<{ message?: string }>) => {
                Notifications.show({
                    title: "Error",
                    message: err.response?.data?.message,
                    color: "red",
                });
            });
    }

    return (
        <>
            <Flex justify="space-between" align="center">
                <Text fz="sm" color="gray.5">
                    Add Member
                </Text>
            </Flex>
            <Space h={10} />
            {friends.map((Friend: any) => {
                return (
                    <Flex justify="space-between" align="center" py={10} px={10} key={Friend?.FriendID}>
                        <Flex align="center" gap={10}>
                            <Avatar size={30} radius="xl" src={Friend?.friend?.avatarUrl} />
                            <Text fz="sm">{Friend?.friend?.username}</Text>
                        </Flex>

                        <Button size="xs" variant="light" color="gray" onClick={() => {addFriendToGroup(Friend?.FriendID)}}>
                            Add
                        </Button>
                    </Flex>
                );
            })}
        </>
    );
}

function Main({ close, GroupType, setGroupType, getMembers, members, getBanList, getMuteList, banList, muteList, setLoading, _chat, setInvited }: any) {
    const [name, setName] = useState<string>("");
    const [chat, setChat] = useState<any>(_chat);

    useEffect(() => {
        setName(chat.name);
        store.subscribe(() => {
            store.getState().chats.GroupChats.forEach((element: any) => {
                if (element.id == chat.id) {
                    setChat(element);
                }
            });
        });
    }, []);

    return (
        <Tabs defaultValue="Members">
            <Tabs.List>
                <Tabs.Tab value="Members" icon={<IconUsersGroup size="0.8rem" />}>
                    Members
                </Tabs.Tab>
                {chat.ownerId == store.getState().profile.user.id && (
                    <Tabs.Tab value="Settings" icon={<IconSettings size="0.8rem" />}>
                        Settings
                    </Tabs.Tab>
                )}
            </Tabs.List>

            <Setting
                close={close}
                GroupType={GroupType}
                setGroupType={setGroupType}
                setLoading={setLoading}
                name={name}
                setName={setName}
            />

            <Memebers
                setInvited={setInvited}
                members={members}
                chat={chat}
                muteList={muteList}
                getMembers={getMembers}
                getMuteList={getMuteList}
                getBanList={getBanList}
                banList={banList}
            />
        </Tabs>
    );
}

function Memebers({ members, chat, muteList, getMembers, getMuteList, getBanList, banList, setInvited }: any) {

    return (
        <Tabs.Panel value="Members" pt="xs">
            <Flex direction="column" p={10} gap={10}>
                <ListMembers
                    members={members}
                    chat={chat}
                    muteList={muteList}
                    getMembers={getMembers}
                    getMuteList={getMuteList}
                    getBanList={getBanList}
                    setInvited={setInvited}
                />
                <Space h={8} />
                <Flex direction="column" gap={10}>
                    <Space h={8} />
                    <MuteList muteList={muteList} getMembers={getMembers} members={members} chat={chat} getMuteList={getMuteList} />
                    <Space h={8} />
                    <BanList banList={banList} chat={chat} getBanList={getBanList} getMembers={getMembers} />
                </Flex>
            </Flex>
        </Tabs.Panel>
    );
}

function Setting({ close, GroupType, setGroupType, setLoading, name, setName}: any) {
    const [password, setPassword] = useState<string>("");
    
    return (
        <Tabs.Panel value="Settings" pt="xs" px={30} pb={20}>
            <SegmentedControl
                my={10}
                fullWidth
                value={GroupType}
                onChange={setGroupType}
                defaultValue={GroupType}
                color="purple"
                data={[
                    { value: "public", label: "Public" },
                    { value: "private", label: "Private" },
                    { value: "protected", label: "Protected" },
                ]}
            />
            <Input.Wrapper label="Group Name">
                <Input size="sm" placeholder="" value={name} variant="filled" w={"100%"} onChange={(e) => setName(e.currentTarget.value)} />
            </Input.Wrapper>
            <Space h={20} />
            <Input.Wrapper label="Password">
                <Input size="sm" placeholder="new password" value={password} variant="filled" w={"100%"} onChange={(e) => setPassword(e.currentTarget.value)} />
            </Input.Wrapper>
            <Space h={20} />
            <Flex justify="flex-end">
                <Button
                    fullWidth
                    size="xs"
                    variant="filled"
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            close();
                        }, 1000);
                    }}
                >
                    Save
                </Button>
            </Flex>
        </Tabs.Panel>
    );
}
