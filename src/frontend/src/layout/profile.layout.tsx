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
    Tooltip,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Flex } from "@mantine/core";
// import Header from "./header";

import { Text } from "@mantine/core";
import HeaderDashboard from "../Components/header";
import store from "@/store/store";
import { IconEdit, IconMessage, IconUserCancel, IconUserPlus, IconUserShare } from "@tabler/icons-react";
import { UserInfo } from "../Components/profile/ProfileUserInfoSection";
import api from "@/api";
import { IconSend } from "@tabler/icons-react";
import Message from "../Components/profile/buttons/message";
import chatSocket from "@/socket/chatSocket";
import { AddFriendRequest } from "./addUser";
import { notifications } from "@mantine/notifications";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";

type ladder = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Master" | "Legend" | "The Chosen One";

interface props {
    id: string;
}

type Match = {
    id: number;
    result: "WIN" | "LOSE";
    playerScore: number;
    opponentScore: number;
    playerUsername: string;
    opponentUsername: string;
    mode: string;
    opponenId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
};

type Stats = {
    wins: number;
    losses: number;
    ladder: string;
    // ... other properties
};

type MatchData = {
    stats: Stats;
    matchs: Match[];
};

export function ProfileLayout({ id }: props) {
    const [profile, setProfile] = useState<any>(null);
    const user: any = store.getState().profile.user;
    const [userState, setUserState] = useState<any>(null);
    const [FriendStatus, setFriendStatus] = useState<"friend" | "not_friend" | "pending">("not_friend");
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!chatSocket.connected) chatSocket.connect();
        api.get("/user/id/" + id)
            .then((res: any) => {
                if (res.status == 200) {
                    setProfile(res?.data);
                    res?.data?.Friends?.find((friend: any) => {
                        if (friend.friendId == user.id) {
                            setFriendStatus(friend.friendshipStatus.toLowerCase());
                        }
                    });
                }
            })
            .catch((err: any) => {
                setError(true);
            });
        api.get("/user/get_stats/" + id)
            .then((res: AxiosResponse<MatchData>) => {
                setUserState(res.data);
            })
            .catch((err: AxiosError<{ message: string }>) => {});
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
        const payload: AddFriendRequest = {
            id: profile.id,
        };
        chatSocket.emit("add_friend", payload);

        chatSocket.on("add_friend", (data: any) => {
            if (data && data.status == 400) {
                notifications.show({
                    title: "Error",
                    message: data.message,
                    color: "red",
                });
                return;
            }
            if (data.status == 201) {
                setFriendStatus("pending");
                notifications.show({
                    title: "Success",
                    message: data.message,
                    color: "green",
                });
            }
        });
    };

    const HeaderRef = React.useRef(null);

    if (error)
        return (
            <Flex justify={"center"} align={"center"} direction={"column"} h={"100vh"}>
                <IconUserCancel size={100} />
                <Title order={1}>User not found</Title>
            </Flex>
        );

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
                        marginTop: "-16px",
                    })}
                >
                    <Box>
                        <UserInfo profile={profile} />
                    </Box>
                    {/* buttons */}
                    <Group position="right" spacing="xs" py={"xl"} pr={"xl"}>
                        {profile && profile?.username == user?.username ? null : (
                            <>
                                {FriendStatus === "not_friend" ? (
                                    <Tooltip label="Add Friend" position="top">
                                        <ActionIcon variant="filled" p={10} size="xl" color="gray" radius="md" onClick={addUser}>
                                            <IconUserPlus />
                                        </ActionIcon>
                                    </Tooltip>
                                ) : FriendStatus === "pending" ? (
                                    <Tooltip label="Pending" position="top">
                                        <ActionIcon variant="filled" p={10} size="xl" color="gray" radius="md">
                                            <IconUserShare />
                                        </ActionIcon>
                                    </Tooltip>
                                ) : (
                                    <Message message={message} setMessage={setMessage} profile={profile} sendMessage={sendMessage} />
                                )}
                            </>
                        )}
                    </Group>
                </Box>

                {/* archivments */}
                {userState && userState?.stats && <Achivments userState={userState} />}
                {userState?.matchs?.length > 0 && (
                    <Box px={0}>
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
                                                    return (
                                                        <Grid.Col span={12} key={match.id}>
                                                            <Match_info match={match} />
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
                )}
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
    titleAchiv: {
        fontSize: "1.2rem",
        [theme.fn.smallerThan("md")]: {
            fontSize: "1rem",
        },
    },
    textAchiv: {
        fontSize: "1rem",
        [theme.fn.smallerThan("md")]: {
            fontSize: "0.8rem",
        },
    },
}));

function Achivments({ userState }: any) {
    const { classes } = useStyles();

    return (
        <Box px={0} mt={20}>
            <Paper radius={20} bg="cos_black.2" p={20}>
                <Flex align="center">
                    {userState?.stats?.ladder && (
                        <img src={`/levels/${(userState?.stats?.ladder as string).toLowerCase().replaceAll(" ", "_")}.svg`} className={classes.image} />
                    )}
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
                <Space h={50} />
                {userState?.stats?.achievements?.map(
                    (achivment: { id: number; createdAt: string; updatedAt: string; name: string; description: string; iconUrl: string; userId: number }) => {
                        return (
                            <Paper radius={20} bg="dark.9" p={10} py={20} key={achivment.id} shadow="lg" mb={10}>
                                <Flex align="center">
                                    <Space w={10} />
                                    <MantineImage src={api.getUri() + achivment.iconUrl} width={70} radius={20} />
                                    <Space w={10} />
                                    <Box ml={20}>
                                        <Title className={classes.titleAchiv}>{achivment.name}</Title>
                                        <Text className={classes.textAchiv}>{achivment.description}</Text>
                                    </Box>
                                </Flex>
                            </Paper>
                        );
                    }
                )}
            </Paper>
            <Space h={30} />
        </Box>
    );
}

export function Match_info({ match }: { match: Match }) {
    function date(time: string): string {
        let date = new Date(time);
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let hours = Math.floor(diff / (1000 * 60 * 60));
        let minutes = Math.floor((diff / (1000 * 60)) % 60);
        let seconds = Math.floor((diff / 1000) % 60);

        if (hours > 0) {
            return hours + "h ago";
        } else if (minutes > 0) {
            return minutes + "m ago";
        } else if (seconds > 0) {
            return seconds + "s ago";
        } else {
            return "now";
        }
    }

    return (
        <Paper radius={30} bg={"cos_black.3"}>
            <Flex
                p={20}
                align="center"
                justify="space-between"
                sx={(theme: MantineTheme) => ({
                    [theme.fn.smallerThan("sm")]: {
                        flexDirection: "column",
                        justifyContent: "space-between",
                    },
                })}
            >
                <Flex align="center" w="100%">
                    <Avatar size={40} radius="xl" src={api.getUri() + "user/avatar/" + match.userId} />
                    <Space w={10} />
                    <Title color="gray.4" fz="sm">
                        {match?.playerUsername}
                    </Title>
                </Flex>

                <Flex align="center" w="100%" justify="center" py={0}>
                    <Paper
                        radius={20}
                        bg={match?.result.toLowerCase() == "win" ? "green.9" : match?.result.toLowerCase() == "lose" ? "red.9" : "yellow"}
                        p={10}
                    >
                        {/* add time */}
                        <Flex align="center" justify="center" pb={3}>
                            <Text color="gray.4" fz="xs">
                                {date(match.createdAt)}
                            </Text>
                        </Flex>
                        <Title color="gray.4" fz="lg">
                            {match?.playerScore} - {match?.opponentScore}
                        </Title>
                    </Paper>
                </Flex>

                <Flex align="center" w="100%" justify="flex-end">
                    <Title color="gray.4" fz="sm">
                        {match?.opponentUsername}
                    </Title>
                    <Space w={10} />
                    <Avatar size={40} radius="xl" src={api.getUri() + "user/avatar/" + match.opponenId} />
                </Flex>
            </Flex>
        </Paper>
    );
}
