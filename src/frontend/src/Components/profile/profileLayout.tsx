import { Avatar, Box, Button, Container, Grid, MantineTheme, Paper, Space, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useMantineTheme, Flex } from "@mantine/core";
// import Header from "./header";

import { AppShell, Text } from "@mantine/core";
import HeaderDashboard from "../dashboard/header";
import store from "@/store/store";
import { IconEdit } from "@tabler/icons-react";
import { UserInfo } from "./ProfileUserInfoSection";

interface props {}
export function ProfileLayout({}: props) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        setProfile(store.getState().profile.user);
        store.subscribe(() => {
            setProfile(store.getState().profile.user);
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
                    })}
                >
                    <Box>
                        <Flex align="center" justify="right" p={20}>
                            <Button
                                size="xs"
                                color="gray"
                                radius="md"
                                onClick={() => {}}
                                leftIcon={<IconEdit size={20} />}
                                sx={{
                                    color: theme.colors.gray[1],
                                }}
                            >
                                Edit Profile
                            </Button>
                        </Flex>
                    </Box>
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
                        marginTop: "50px"
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
