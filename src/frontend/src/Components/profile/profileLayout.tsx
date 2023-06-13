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
                        borderRadius: "0 0 50px 50px",
                        height: "300px",
                        [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                            height: "150px",
                        },
                        borderBottom: `10px solid ${theme.colors.gray[4]}`,
                        position: "relative",
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
                            bottom: "-50%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                                bottom: "-85%",
                            },
                        })}
                    >
                        <UserInfo profile={profile} />
                    </Box>
                </Box>
                <Box mt={100}>
                    <Grid bg={'gray.9'}>
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
                </Box>
            </Container>
        </>
    );
}
