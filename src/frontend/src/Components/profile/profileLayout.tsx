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
import React, { useEffect, useState } from "react";
import { useMantineTheme, Flex } from "@mantine/core";
// import Header from "./header";

import { Text } from "@mantine/core";
import HeaderDashboard from "../header";
import store from "@/store/store";
import { IconEdit, IconMessage, IconUserPlus } from "@tabler/icons-react";
import { UserInfo } from "./ProfileUserInfoSection";
import api from "@/api";
import socket from "@/socket";
import { IconSend } from "@tabler/icons-react";
import Message from "./buttons/message";

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
                console.log(res.data);
                // else window.location.href = "/";
            })
            .catch((err: any) => {
                // redirect to login
                // window.location.href = "/";
            });

        store.getState().io.socket?.on("add_friend", (data: any) => {
            console.log("add_friend: ", data);
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

    const addUser = () => {
        console.log("addUser: ", profile.username)
        store.getState().io.socket?.emit("add_friend", {
            friend_username: profile.username,
        });
    };

    const HeaderRef = React.useRef(null);

    return (
        <>
            <HeaderDashboard HeaderRef={HeaderRef} />
            <Container>
                <Box
                    sx={(theme: MantineTheme) => ({
                        // background: `url(${"https://picsum.photos/3000"})`,
                        // backgroundSize: "cover",
                        // backgroundPosition: "center",
                        width: "100%",
                        borderRadius: "0 0 30px 30px",
                        // height: "300px",
                        // [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                        //     height: "150px",
                        // },
                        borderBottom: `5px solid ${theme.colors.gray[4]}`,
                        // position: "relative",
                        // add drop shadow as a gradient
                        boxShadow: `inset 0px -100px 100px -60px ${theme.colors.gray[9]}`,
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "20px",
                        // alignItems: "start",
                        // justifyContent: "end",
                    })}
                >
                     <Box
                        sx={(theme: MantineTheme) => ({
                            // position: "absolute",
                            // bottom: "-10%",
                            // left: "10%",
                            // [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                            //     bottom: "-15%",
                            // },
                        })}
                    >
                        <UserInfo profile={profile} />
                    </Box>
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
                                <ActionIcon variant="filled" p={10} size="xl" color="gray" radius="md" onClick={addUser}>
                                    <IconUserPlus />
                                </ActionIcon>
                                <Message message={message} setMessage={setMessage} profile={profile} sendMessage={sendMessage} />
                            </>
                        )}
                    </Group>
                   
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
