import React, { use } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Box, Group, PasswordInput, Space, Title, Flex, Text, useMantineTheme, Badge, Avatar, LoadingOverlay } from "@mantine/core";
import api from "@/api";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import chatSocket from "@/socket/chatSocket";
import { joinPublicChannel, groupInfoType } from "./type";
import { AxiosError, AxiosResponse } from "axios";

export default function JoinGroup({ show, data, setShowJoinGroup }: { show: boolean; data: any; setShowJoinGroup: any }) {
    const [opened, { open, close }] = useDisclosure();
    const [JoinGroup, setJoinGroup] = useState(false);
    const theme = useMantineTheme();
    const [groupInfo, setGroupInfo] = useState<groupInfoType>({
        id: null,
        name: null,
        type: null,
        membersCount: null,
        is_member: null,
    });
    const [errorPassword, setErrorPassword] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        if (show == true) open();
        if (data?.id) {
            api.get("user/channel_info/" + data?.id)
                .then((res: AxiosResponse<any>) => {
                    if (res?.status == 200) setGroupInfo(res?.data);
                })
                .catch((err: AxiosError) => {
                    console.log(err);
                });
        }

        return () => {
            setShowJoinGroup(false);
            setGroupInfo({
                id: null,
                name: null,
                type: null,
                membersCount: null,
                is_member: null,
            });
            setJoinGroup(false);
            setErrorPassword("");
        };
    }, [show]);

    return (
        <>
            <Modal
                overlayProps={{
                    opacity: 0.55,
                    blur: 8,
                }}
                opened={opened}
                onClose={close}
                centered
                radius={30}
                withCloseButton={groupInfo.id == null ? false : true}
            >
                <LoadingOverlay visible={groupInfo.id !== null ? false : true} overlayBlur={3} />
                <Box maw={300} mx="auto" pb={50} pos={"relative"}>
                    {JoinGroup == true ? (
                        <>
                            <Flex align="center" justify="center" direction="column" mih={100}>
                                <IconCheck size={50} color={theme.colors.green[6]} />
                                <Space py={10} />
                                <Text>Join group successfully</Text>
                                <Space py={20} />
                                <Button onClick={close}>Close</Button>
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Flex align="center" justify="flex-start">
                                <Avatar size="xl" radius={20}>
                                    {groupInfo.name != null ? groupInfo?.name[0] : ""}
                                </Avatar>
                                <Space w={15} />
                                <Flex align="start" justify="center" direction="column" mih={100}>
                                    <Title order={3}>{groupInfo.name}</Title>
                                    <Space py={5} />
                                    <Group position="left" spacing="8px">
                                        <Badge color="cyan" variant="light">
                                            {groupInfo.type}
                                        </Badge>
                                        <Badge color="cyan" variant="light">
                                            {groupInfo.membersCount} members
                                        </Badge>
                                    </Group>
                                </Flex>
                            </Flex>
                            <Space py={6} />

                            {groupInfo.is_member == false || groupInfo.is_member == null ? (
                                <>
                                    {groupInfo?.type != "public" ? (
                                        <>
                                            <Text color="gray.5">This group is protected. Please enter the password to join.</Text>
                                            <Space py={15} />
                                            <PasswordInput
                                                placeholder="Password"
                                                required
                                                error={errorPassword}
                                                value={password}
                                                onChange={(event) => {
                                                    setPassword(event.currentTarget.value);
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <Text color="gray.5">Do you want to join this group?</Text>
                                    )}
                                    <Space py={10} />
                                    <Button
                                        fullWidth
                                        onClick={() => {
                                            let body: joinPublicChannel = {
                                                channelID: data?.id,
                                                password: password == "" ? null : password,
                                            };
                                            api.post("/user/join_channel", body)
                                                .then((res: AxiosResponse) => {
                                                    console.log(res);
                                                    if (res?.status == 201) {
                                                        chatSocket.emit("reconnect");
                                                        setJoinGroup(true);
                                                    }
                                                })
                                                .catch((err: AxiosError<{ message?: string }>) => {
                                                    setErrorPassword(err.response?.data?.message || "An error occurred");
                                                });
                                        }}
                                    >
                                        Join
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Text color="gray.5">You are already a member of this group.</Text>
                                    <Space py={10} />
                                    <Button fullWidth disabled>
                                        Join
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}