import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    Group,
    Image as MantineImage,
    Input,
    MantineTheme,
    Paper,
    Popover,
    Space,
    Title,
    createStyles,
    Divider,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useMantineTheme, Flex } from "@mantine/core";
// import Header from "./header";

import { Text } from "@mantine/core";
import HeaderDashboard from "../Components/header";
import store from "@/store/store";
import { IconEdit, IconMessage, IconUserPlus } from "@tabler/icons-react";
import { UserInfo } from "../Components/profile/ProfileUserInfoSection";
import api from "@/api";
import { IconSend } from "@tabler/icons-react";
import Message from "../Components/profile/buttons/message";
import chatSocket from "@/socket/chatSocket";
import { AddFriendRequest } from "./addUser";
import { notifications } from "@mantine/notifications";
import { AxiosError, AxiosResponse } from "axios";

type ladder = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Master" | "Legend" | "The Chosen One";

interface props {
    id: string;
}

export function ProfileLayout({ id }: props) {
    const [profile, setProfile] = useState<any>(null);
    const user: any = store.getState().profile.user;

    const [userState, setUserState] = useState<any>(null);

    useEffect(() => {
        api.get("/user/id/" + id)
            .then((res: any) => {
                if (res.status == 200) setProfile(res.data);
                console.log(res.data);
            })
            .catch((err: any) => {
                notifications.show({
                    title: "Error",
                    message: err.response?.data.message,
                    color: "red",
                });
            });
        api.get("/user/get_stats/" + id)
            .then((res: AxiosResponse) => {
                console.log(res.data);
                setUserState(res.data);
            })
            .catch((err: AxiosError<{ message: string }>) => {
                notifications.show({
                    title: "Error",
                    message: err.response?.data.message,
                    color: "red",
                });
            });
    }, []);

    const [message, setMessage] = useState<string | null>("");

    const sendMessage = (message: any) => {
        if (!message || message.message === "") return;
        chatSocket.emit("message", {
            receiver: profile.username,
            msg: message.message,
        });
        setMessage(null);
        chatSocket.emit("reconnect");
    };

    const addUser = () => {
        console.log("addUser: ", profile.username);
        const payload: AddFriendRequest = {
            id: profile.id,
        };
        store.getState().io.socket?.emit("add_friend", payload);
    };

    const HeaderRef = React.useRef(null);

    if (!profile) return <></>;

    return (
        <>
            <HeaderDashboard HeaderRef={HeaderRef} />
            <Container>
                <Box
                    sx={(theme: MantineTheme) => ({
                        width: "100%",
                        borderRadius: "0 0 30px 30px",
                        borderBottom: `5px solid ${theme.colors.gray[4]}`,
                        boxShadow: `inset 0px -100px 100px -60px ${theme.colors.gray[9]}`,
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "20px",
                    })}
                >
                    <Box>
                        <UserInfo profile={profile} />
                    </Box>
                    {/* buttons */}
                    <Group position="right" spacing="xs" py={"xl"} pr={"xl"}>
                        {profile && profile.username == user.username ? null : ( // </ActionIcon> //     <IconEdit /> // > //     }} //         color: theme.colors.gray[1], //     sx={{ //     onClick={() => {}} //     radius="md" //     color="gray" //     size="xl" //     p={10} //     variant="filled" // <ActionIcon
                            <>
                                <ActionIcon variant="filled" p={10} size="xl" color="gray" radius="md" onClick={addUser}>
                                    <IconUserPlus />
                                </ActionIcon>
                                <Message message={message} setMessage={setMessage} profile={profile} sendMessage={sendMessage} />
                            </>
                        )}
                    </Group>
                </Box>

                {/* archivments */}
                <Achivments userState={userState} />

                <Box px={20}>
                    <Paper radius={20} bg="cos_black.2">
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
                                        <Space h={20} />
                                        <Grid>
                                            {userState?.matchs?.map((match: any) => {
                                                console.log(match);
                                                return (
                                                    <Grid.Col span={12} key={match.id}>
                                                        <Match_info result={match.result} player1={store.getState().profile.user.name} />
                                                    </Grid.Col>
                                                );
                                            })}
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                    <Space h={30} />
                </Box>
            </Container>
        </>
    );
}

const useStyles = createStyles((theme: MantineTheme) => ({
    image: {
        width: "80px",
        [theme.fn.smallerThan("md")]: {
            width: "60px",
        },
        [theme.fn.smallerThan("sm")]: {
            width: "50px",
        },
    },
    title: {
        fontSize: "1.5rem",
        [theme.fn.smallerThan("md")]: {
            fontSize: "1.1rem",
        },
    },
    Text: {
        fontSize: "1.4rem",
        [theme.fn.smallerThan("md")]: {
            fontSize: "1rem",
        },
    },
}));

function Achivments({ userState }: any) {
    const { classes } = useStyles();

    return (
        <Box px={15} mt={20}>
            <Paper radius={20} bg="cos_black.2" p={30}>
                <Flex align="center">
                    <img src={`/levels/${(userState?.stats?.ladder as string).toLowerCase().replaceAll(" ", "_")}.svg`} className={classes.image} />
                    <Space w={10} />
                    <Title order={2} className={classes.title}>
                        {(userState?.stats?.ladder as string).toUpperCase()}
                    </Title>
                </Flex>
                <Space h={20} />
                <Flex align="center" justify={"space-evenly"}>
                    <Flex align="center" direction={"column"}>
                        <Text className={classes.Text}>Wins</Text>
                        <Space h={10} />
                        <Text size="lg" weight={500}>
                            {userState?.stats?.wins}
                        </Text>
                    </Flex>

                    <Divider orientation="vertical" />
                    <Flex align="center" direction={"column"}>
                        <Text className={classes.Text}>Losses</Text>
                        <Space h={10} />
                        <Text size="lg" weight={500}>
                            {userState?.stats?.losses}
                        </Text>
                    </Flex>
                </Flex>
            </Paper>
            <Space h={30} />
        </Box>
    );
}

export function Match_info({
    result,
    score,
    children,
    oppinfo,
}: {
    result: any;
    player1: any;
    player2: any;
    score: { player1: number; player2: number };
    result: any;
    children?: React.ReactNode;
    oppinfo: { roomName: string; player: number; opponentName: string };
}) {
    return (
        <Paper radius={30} bg={"cos_black.1"} p="sm">
            <Flex
                p={5}
                align="center"
                justify="space-between"
                sx={(theme: MantineTheme) => ({
                    [theme.fn.smallerThan("sm")]: {
                        flexDirection: "column",
                    },
                })}
            >
                <Flex align="center">
                    <Avatar
                        size={40}
                        radius="xl"
                        src={oppinfo?.player === 2 ? oppinfo?.opponentName : api.getUri() + "user/avatar/" + store.getState().profile.user.id}
                    />
                    <Space w={10} />
                    <Title color="gray.4" fz="sm">
                        {oppinfo?.player === 2 ? oppinfo?.opponentName : store.getState().profile.user.name}
                    </Title>
                </Flex>
                <Flex align="center">
                    <Title color="gray.4" fz="lg">
                        {result.playerScore}
                    </Title>
                </Flex>
                <Flex align="center">
                    <Title color="gray.4" fz="sm">
                        {oppinfo?.player === 1 ? oppinfo?.opponentName : store.getState().profile.user.name}
                    </Title>
                    <Space w={10} />
                    <Avatar
                        size={40}
                        radius="xl"
                        src={oppinfo?.player === 1 ? oppinfo?.opponentName : api.getUri() + "user/avatar/" + store.getState().profile.user.id}
                    />
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
