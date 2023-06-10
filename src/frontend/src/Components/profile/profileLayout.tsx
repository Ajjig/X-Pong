import { Avatar, Box, Button, Container, MantineTheme, Paper, Space, Title } from "@mantine/core";
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
        <AppShell
            styles={{
                main: {
                    margin: 0,
                    padding: 0,
                    background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            header={<HeaderDashboard />}
        >
            <Container mt={70}>
                <Box
                    sx={{
                        background: `linear-gradient(180deg, ${theme.colors.orange[8]} 0%, ${theme.colors.red[9]} 100%)`,
                        width: "100%",
                        borderRadius: "0 0 50px 50px",
                        height: "150px",
                        borderBottom: "10px solid #fff",
                    }}
                >
                    <Box>
                        <Flex align="center" justify="right" p={20}>
                            <Button size="xs" color="gray" radius="md" onClick={() => {}} leftIcon={<IconEdit size={20} />}>
                                Edit Profile
                            </Button>
                        </Flex>
                    </Box>
                    <Box
                        // sx={{
                        //     transform: "translateY(62%)",
                        // }}
                    >
                        <UserInfo profile={profile} />
                    </Box>
                </Box>
                {/* <Grid.Col
                        xs={12}
                        md={6}
                        sx={(Theme: MantineTheme) => {
                            return {
                                // transform: "translateY(-40%)",
                            };
                        }}
                    >
                        <Box
                            style={{
                                height: 200,
                                background:
                                    theme.colorScheme === "dark"
                                        ? theme.colors.dark[7]
                                        : theme.colors.gray[0],
                            }}
                        />
                    </Grid.Col> */}
                {/* <Grid.Col
                        xs={12}
                        md={6}
                        sx={(Theme: MantineTheme) => {
                            return {
                                // transform: "translateY(-40%)",
                            };
                        }}
                    >
                        <Box
                            style={{
                                height: 200,
                                background:
                                    theme.colorScheme === "dark"
                                        ? theme.colors.dark[7]
                                        : theme.colors.gray[0],
                            }}
                        />
                    </Grid.Col> */}
            </Container>
        </AppShell>
    );
}

