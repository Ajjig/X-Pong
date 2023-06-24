import {
    ActionIcon,
    Box,
    Button,
    Container,
    Grid,
    Group,
    Input,
    MantineTheme,
    Paper,
    Popover,
    Space,
    Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useMantineTheme, Flex } from "@mantine/core";
// import Header from "./header";

import { Text } from "@mantine/core";
import HeaderDashboard from "../dashboard/header";
import store from "@/store/store";
import { IconEdit, IconMessage, IconUserPlus } from "@tabler/icons-react";
import { UserInfo } from "./ProfileUserInfoSection";
import api from "@/api";
import socket from "@/socket";
import { IconSend } from "@tabler/icons-react";

interface props {
    id: string;
}

export function ProfileLayout({ id }: props) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const user: any = store.getState().profile.user;

    useEffect(() => {
        api.get("/user/id/" + id)
            .then((res: any) => {
                if (res.status == 200) setProfile(res.data);
                // else window.location.href = "/";
            })
            .catch((err: any) => {
                // redirect to login
                // window.location.href = "/";
            });
    }, []);

    const [message, setMessage] = useState<string | null>("");

    const sendMessage = (message: any) => {
        if (!message || message.message === "") return;
        socket.emit("message", {
            receiver: profile.username,
            msg: message.message,
        });
        setMessage(null);
    };

    return (
        <>
            <HeaderDashboard />
            <Container>
                <Box
                    sx={(theme: MantineTheme) => ({
                        background: `url(${"https://picsum.photos/3000"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        borderRadius: "0 0 30px 30px",
                        height: "300px",
                        [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                            height: "150px",
                        },
                        borderBottom: `5px solid ${theme.colors.gray[4]}`,
                        position: "relative",
                        // add drop shadow as a gradient
                        boxShadow: `inset 0px -100px 100px -60px ${theme.colors.gray[9]}`,
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "end",
                    })}
                >
                    {/* buttons */}
                    <Group position="right" spacing="xs" py={"xl"} pr={"xl"}>
                        {profile && profile.username == user.username ? (
                            <ActionIcon
                                variant="filled"
                                p={10}
                                size="xl"
                                color="gray"
                                radius="md"
                                onClick={() => {}}
                                sx={{
                                    color: theme.colors.gray[1],
                                }}
                            >
                                <IconEdit />
                            </ActionIcon>
                        ) : (
                            <>
                                <ActionIcon variant="filled" p={10} size="xl" color="gray" radius="md" onClick={() => {}}>
                                    <IconUserPlus />
                                </ActionIcon>
                                <Popover>
                                    <Popover.Target>
                                        <ActionIcon
                                            variant="filled"
                                            p={10}
                                            size="xl"
                                            color="gray"
                                            radius="md"
                                            onClick={() => {}}
                                            sx={{
                                                color: theme.colors.gray[1],
                                            }}
                                        >
                                            <IconMessage />
                                        </ActionIcon>
                                    </Popover.Target>
                                    {message != null ? (
                                        <Popover.Dropdown>
                                            <Flex align="center" p={10}>
                                                <Text>Say Hi to {profile && profile.name}</Text>
                                            </Flex>
                                            <Space h="xs" />
                                            <Flex justify="center" align="center">
                                                <Input
                                                    sx={(theme: MantineTheme) => ({
                                                        // change outline color on focus
                                                        "&:focus": {
                                                            outline: `1px solid ${theme.colors.orange[6]} !important`,
                                                            outlineOffset: 2,
                                                        },
                                                    })}
                                                    placeholder="Type a message..."
                                                    value={message}
                                                    onChange={(e: any) => setMessage(e.currentTarget.value)}
                                                    onKeyDown={(e: any) => {
                                                        if (e.key === "Enter") {
                                                            sendMessage({
                                                                message: message,
                                                                from: "me",
                                                            });
                                                        }
                                                    }}
                                                    w="100%"
                                                    rightSection={
                                                        <IconSend
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            size={20}
                                                            onClick={() => {
                                                                sendMessage({
                                                                    message: message,
                                                                    from: "me",
                                                                });
                                                            }}
                                                        />
                                                    }
                                                />
                                            </Flex>
                                        </Popover.Dropdown>
                                    ) : (
                                        <Popover.Dropdown>
                                            <Flex direction="column" align="center" p={10}>
                                                <Text>Your message has been sent!</Text>
                                                <Space h="xs" />
                                                <Button variant="filled" onClick={() => setMessage("")}>
                                                    Send another message
                                                </Button>
                                            </Flex>
                                        </Popover.Dropdown>
                                    )}
                                </Popover>
                            </>
                        )}
                    </Group>
                    <Box
                        sx={(theme: MantineTheme) => ({
                            position: "absolute",
                            bottom: "-10%",
                            left: "10%",
                            [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                                bottom: "-15%",
                            },
                        })}
                    >
                        <UserInfo profile={profile} />
                    </Box>
                </Box>

                <Box
                    px={20}
                    sx={(theme: MantineTheme) => ({
                        marginTop: "50px",
                    })}
                >
                    <Paper radius={20} bg={"gray.8"}>
                        <Grid>
                            <Grid.Col span={12}>
                                <Paper radius={20} bg={"transparent"}>
                                    <Box p={20}>
                                        <Title
                                            order={2}
                                            sx={(theme: MantineTheme) => ({
                                                fontSize: "1.3rem",
                                                [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                                                    fontSize: "1.2rem",
                                                },
                                                [theme.fn.smallerThan(theme.breakpoints.xs)]: {
                                                    fontSize: "1rem",
                                                },
                                                color: theme.colors.gray[4],
                                            })}
                                        >
                                            Match History
                                        </Title>
                                    </Box>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                </Box>
            </Container>
        </>
    );
}
