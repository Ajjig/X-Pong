import { ActionIcon, Avatar, Box, Button, Container, Grid, Group, MantineTheme, Paper, Space, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useMantineTheme, Flex } from "@mantine/core";
// import Header from "./header";

import { AppShell, Text } from "@mantine/core";
import HeaderDashboard from "../dashboard/header";
import store from "@/store/store";
import { IconEdit, IconFriends, IconMessage, IconUserPlus } from "@tabler/icons-react";
import { UserInfo } from "./ProfileUserInfoSection";
import { useRouter } from "next/router";
import api from "@/api";

interface props {
    id: string;
}

export function ProfileLayout({ id }: props) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const user: any = store.getState().profile.user;

    useEffect(() => {
        // console.log("Here", id);
        // setProfile(store.getState().profile.user);
        // store.subscribe(() => {
        //     setProfile(store.getState().profile.user);
        // });
        api.get("/user/id/" + id)
            .then((res: any) => {
                console.log("Here", res.data);
                if (res.status == 200) setProfile(res.data);
                // else window.location.href = "/";
            })
            .catch((err: any) => {
                // redirect to login
                // window.location.href = "/";
            });
    }, []);

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
                        alignItems: "end",
                        justifyContent: "end",
                    })}
                >
                    {/* buttons */}
                    <Group position="right" spacing="xs" py={"xl"} pr={"xl"}>
                        {
                            // check if the profile is the current user
                            // if so, show edit button
                            // else, show add friend button
                            profile && profile.id == user.id ? (
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
                                    <Button
                                        size="xs"
                                        color="gray"
                                        radius="md"
                                        onClick={() => {}}
                                        sx={{
                                            color: theme.colors.gray[1],
                                        }}
                                    >
                                        <IconUserPlus />
                                    </Button>
                                    <Button
                                        size="xs"
                                        color="gray"
                                        radius="md"
                                        onClick={() => {}}
                                        sx={{
                                            color: theme.colors.gray[1],
                                        }}
                                    >
                                        <IconMessage />
                                    </Button>
                                </>
                            )
                        }
                        {/* <Button
                            size="xs"
                            color="gray"
                            radius="md"
                            onClick={() => {}}
                            sx={{
                                color: theme.colors.gray[1],
                            }}
                        >
                            Add Friend
                        </Button>
                        <Button
                            size="xs"
                            color="gray"
                            radius="md"
                            onClick={() => {}}
                            sx={{
                                color: theme.colors.gray[1],
                            }}
                        >
                            Send Message
                        </Button> */}
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
