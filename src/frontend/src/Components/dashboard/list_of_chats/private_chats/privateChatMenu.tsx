import { Avatar, Button, Divider, Flex, Loader, Menu, Modal, Space, Title, useMantineTheme } from "@mantine/core";
import React, { use, useEffect } from "react";
import { IconDeviceGamepad2, IconUser } from "@tabler/icons-react";
import { Text, Box } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { IconBan } from "@tabler/icons-react";
import { useRouter } from "next/router";
import api from "@/api";
import { BlockFriend } from "./type";
import { AxiosError, AxiosResponse } from "axios";
import { useDisclosure } from "@mantine/hooks";
import socketGame from "@/socket/gameSocket";

export function PrivateChatMenu({ user }: any) {
    const router = useRouter();
    const ModelAlert = useDisclosure();
    const ModelWaitingAcceptChallenge = useDisclosure();
    const theme = useMantineTheme();
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [successMessage, setSuccessMessage] = React.useState<string>("");

    const ButtonProfile = () => {
        router.push(`/profile/${user.id}`);
    };

    useEffect(() => {
        if (socketGame.connected == false) socketGame.connect();

        socketGame.on("invite-canceled", () => {
            ModelWaitingAcceptChallenge[1].close();
        });

        return () => {
            setErrorMessage("");
            setSuccessMessage("");
            ModelWaitingAcceptChallenge[1].close();
        };
    }, []);

    const ButtonBan = () => {
        ModelAlert[1].open();
    };

    const inviteToGame = () => {
        ModelWaitingAcceptChallenge[1].open();
        socketGame.emit("invite", {
            username: user.username,
        });
    };

    return (
        <>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 30,
                            cursor: "pointer",
                        }}
                    >
                        <IconDots />
                    </Box>
                </Menu.Target>

                <Menu.Dropdown>
                    <Flex direction="column" mih="180px" justify="center" align="center">
                        <Avatar size="xl" src={user.avatarUrl} radius="xl" />
                        <Flex direction={"column"} align="center">
                            <Text fw="bold" fz="md">
                                {user.name}
                            </Text>
                            {/* username */}
                            <Text fz="sm" color="gray.4">
                                @{user.username}
                            </Text>
                        </Flex>
                    </Flex>

                    <Menu.Item icon={<IconUser size={20} />} onClick={ButtonProfile}>
                        Profile
                    </Menu.Item>
                    <Menu.Item icon={<IconDeviceGamepad2 size={20} />} onClick={inviteToGame}>
                        Challenge
                    </Menu.Item>
                    <Menu.Item color="red" icon={<IconBan size={20} />} onClick={ButtonBan}>
                        Ban
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            {/* Modal for ban user */}
            <Modal
                overlayProps={{
                    opacity: 0.55,
                    blur: 8,
                }}
                opened={ModelAlert[0]}
                onClose={ModelAlert[1].close}
                centered
                radius={30}
            >
                <Box mx="auto" p={20} pt={0} pb={20} pos={"relative"}>
                    <Flex align="center" justify="center" direction="column">
                        <Flex align="center" justify="center">
                            <IconBan size={70} color={theme.colors.red[9]} />
                            <Space w={12} />
                            <Title fz={"lg"}>Are you sure you want to ban this user?</Title>
                        </Flex>
                        <Space py={8} />
                        <Text fz="sm" color="gray.5">
                            After you ban this user, you will not be able to receive messages from this user
                        </Text>
                        <Space py={20} />
                        <Flex w="80%" justify="space-around" pr={15}>
                            {errorMessage != "" ? <Text color="red">{errorMessage}</Text> : null}
                            {successMessage != "" ? <Text color="green">{successMessage}</Text> : null}
                            {errorMessage == "" && successMessage == "" ? (
                                <>
                                    <Button
                                        variant="subtle"
                                        color="gray"
                                        onClick={() => {
                                            ModelAlert[1].close();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Divider orientation="vertical" />
                                    <Button
                                        color="red.8"
                                        variant="subtle"
                                        onClick={() => {
                                            let body: BlockFriend = {
                                                friendID: user.id,
                                            };

                                            api.post("/user/block_friend", body)
                                                .then((res: AxiosResponse) => {
                                                    console.log(res.data);
                                                    setSuccessMessage("Ban successfully");
                                                })
                                                .catch((err: AxiosError<{ message?: string }>) => {
                                                    console.log(err.response?.data?.message);
                                                    setErrorMessage(err.response?.data?.message ?? "");
                                                });
                                        }}
                                    >
                                        Ban
                                    </Button>
                                </>
                            ) : null}
                        </Flex>
                    </Flex>
                </Box>
            </Modal>

            {/* Modal waiting other user to accept challenge */}
            <Modal
                overlayProps={{
                    opacity: 0.55,
                    blur: 8,
                }}
                opened={ModelWaitingAcceptChallenge[0]}
                onClose={ModelWaitingAcceptChallenge[1].close}
                centered
                radius={30}
                closeOnClickOutside={false}
                withCloseButton={false}
            >
                <Box mx="auto" p={20} pt={0} pb={20} pos={"relative"}>
                    <Flex align="center" justify="center" direction="column">
                        <Avatar size="xl" src={user.avatarUrl} radius="xl" my={15} />
                        <Space w={12} />
                        <Title fz={"lg"} align="center">
                            Waiting {user.name} to accept your challenge
                        </Title>
                        <Space py={12} />
                        <Loader color="purple" variant="dots" />
                        <Space py={12} />
                        <Flex w="100%" justify="center">
                            <>
                                <Button
                                    variant="default"
                                    color="gray"
                                    onClick={() => {
                                        socketGame.emit("cancel-invite", {
                                            username: user.username,
                                        });
                                        ModelWaitingAcceptChallenge[1].close();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        </Flex>
                    </Flex>
                </Box>
            </Modal>
        </>
    );
}
