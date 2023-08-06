import React, { use, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
    Modal,
    Box,
    LoadingOverlay,
    Flex,
    PasswordInput,
    TextInput,
    Space,
    Paper,
    Input,
    Button,
    ScrollArea,
    Text,
    Avatar,
    Tabs,
    SegmentedControl,
    Menu,
    createStyles,
    MantineTheme,
    Badge,
} from "@mantine/core";
import { useState } from "react";
import api from "@/api";
import { IconBan, IconCrown, IconDots, IconKarate, IconSettings, IconSettings2, IconUsersGroup, IconVolume3 } from "@tabler/icons-react";
import store from "@/store/store";
import { SetUserAsAdminDto } from "./type";
import { error } from "console";
import { AxiosError, AxiosResponse } from "axios";
import chatSocket from "@/socket/chatSocket";
import { IconCrownOff } from "@tabler/icons-react";

export function SettingGroupChat({ children, _chat }: { children: React.ReactNode; _chat: any }) {
    const [chat, setChat] = useState<any>(_chat);
    const [opened, { open, close }] = useDisclosure();
    const [Loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [members, setMembers] = useState<any>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [GroupType, setGroupType] = useState<string>(chat.type);

    useEffect(() => {
        setName(chat.name);
        console.log(chat);

        store.subscribe(() => {
            store.getState().chats.GroupChats.forEach((element: any) => {
                if (element.id == chat.id) {
                    setChat(element);
                }
            });
        });

        api.get(`/user/channels/userslist/${chat.id}/`).then((res) => {
            setMembers([...res.data]);
        });

        return () => {
            console.log("unmount");
            // setChat({});
            // setMembers([]);
        };
    }, [chat, refresh]);

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
                setRefresh(!refresh);
            })
            .catch((error: AxiosError) => {
                console.log(error.response);
                setRefresh(!refresh);
            });
    }

    function removeAdmin(id: number) {
        console.log("remove admin");
    }

    return (
        <>
            <Modal
                title={chat.name}
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
                // size="lg"
            >
                <LoadingOverlay visible={Loading} overlayBlur={3} />

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
                            <Input
                                size="sm"
                                placeholder="new password"
                                value={password}
                                variant="filled"
                                w={"100%"}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                            />
                        </Input.Wrapper>
                        <Space h={20} />
                        <Flex justify="flex-end">
                            {/* <Button variant="light" color="gray" onClick={() => close()} size="xs">
                                Cancel
                            </Button> */}
                            {/* <Space w={10} /> */}
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

                    <Tabs.Panel value="Members" pt="xs">
                        <Flex direction="column" p={10} gap={10}>
                            <Flex justify="space-between" align="center">
                                <Text fz="sm" color="gray.5">
                                    <Text fw="bold" fz="sm" component="span">
                                        {members.length}
                                    </Text>{" "}
                                    Members
                                </Text>
                                <Flex>
                                    <Button variant="light" color="gray" size="xs">
                                        invite
                                    </Button>
                                    <Space w={10} />
                                    <Button variant="filled" color="red" size="xs">
                                        leave
                                    </Button>
                                </Flex>
                            </Flex>
                            <Space h={8} />
                            <Flex direction="column" gap={10}>
                                {members.map((member: any) => (
                                    <Flex justify="space-between" align="center" py={5} px={15} key={member.id}>
                                        <Flex align="center" gap={10}>
                                            <Avatar size={30} radius="xl" src={member.avatarUrl} />
                                            <Text fz="sm">{member.name}</Text>

                                            {chat.adminsIds.includes(member.id) && (
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
                                                    {chat.ownerId == member.id ? "Owner" : "Admin"}
                                                </Badge>
                                            )}
                                        </Flex>

                                        <Menu shadow="md" width={200} position="right" withArrow arrowSize={14} arrowOffset={15}>
                                            {/* {((chat.ownerId != member.id && !chat.adminsIds.includes(member.id)) && store.getState().profile.user.id != member.id) && ( */}
                                            {store.getState().profile.user.id != member.id &&
                                                (members.includes(store.getState().profile.user.id) || store.getState().profile.user.id == chat.ownerId) && (
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
                                                <Menu.Item icon={<IconKarate size={18} />}>Kick</Menu.Item>
                                                <Menu.Item icon={<IconBan size={18} />}>Ban</Menu.Item>

                                                <Menu.Item icon={<IconVolume3 size={18} />}>Mute</Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Flex>
                                ))}
                            </Flex>
                        </Flex>
                    </Tabs.Panel>
                </Tabs>
            </Modal>
            <Box
                onClick={() => (open(), setRefresh(!refresh))}
                sx={{
                    cursor: "pointer",
                }}
            >
                {children}
            </Box>
        </>
    );
}
