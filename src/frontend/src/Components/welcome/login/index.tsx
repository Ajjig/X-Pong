import { Avatar, Container, Flex, Paper, Space, Text, createStyles, Anchor, Box, Button, MantineTheme } from "@mantine/core";

import Back_Button from "./components/Back_Button";
import { Third_party_login } from "./components/Third_party_login";
import type { auths } from "./components/Third_party_login";
import { useRouter } from "next/router";
import api from "@/api";
import store from "@/store/store";
import Link from "next/link";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
        width: "100vw",
        // add animation of the login form
        animation: "appear 0.2s ease-in-out",
    },
    "@keyframes appear": {
        "0%": {
            opacity: 0,
        },
        "100%": {
            opacity: 1,
        },
    },
    form: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
    },
}));

interface Props {
    setLoginShow: (value: boolean) => void;
}

export default function Login({ setLoginShow }: Props) {
    const { classes } = useStyles();
    const [logoutState, setLogout] = useState(false);

    const intraAuth = () => {
        console.log("42 BTN CLICKED!");
        // implement the 42 login here open small window with 42 login and auth the user
        // poisition the window in the middle of the screen
        window.location.href = api.getUri() + "auth/42";
    };

    const auths: auths = {
        intra: intraAuth,
    };

    const logout = () => {
        setLogout(true);
        
    }

    return (
        <Container className={classes.container}>
            <Container size="400px" className={classes.form}>
                <Back_Button func={setLoginShow} />
                <Paper w="100%" p="xl" radius="md" withBorder>
                    {store.getState().profile?.user?.username && logoutState == false ? (
                        <Flex direction="column">
                            <Text size="lg" weight={500}>
                                Continue as
                            </Text>
                            <Space h="md" />
                            <Anchor underline={false} href={"/dashboard"}>
                                <Paper w="100%" p="md" radius="md" withBorder>
                                    <Flex align="center" gap="md">
                                        <Avatar size="lg" radius="xl" src={store.getState().profile.user.avatarUrl} />
                                        <Flex direction="column">
                                            <Text size="lg" weight={500}>
                                                {store.getState().profile.user.name}
                                            </Text>
                                            <Text size="sm" weight={500} color="gray">
                                                @{store.getState().profile.user.username}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                </Paper>
                            </Anchor>
                            <Space h="md" />
                            {/* logout */}
                            <Flex w="100%" justify='center'>
                                <Button onClick={logout} bg="#5951BA" radius="lg" sx={(theme: MantineTheme) => ({
                                    [`&:hover`]: {
                                        backgroundColor: theme.colors.grape[9],
                                    },
                                })}>
                                    Logout
                                </Button>
                            </Flex>
                        </Flex>
                    ) : (
                        <>
                            <Text size="lg" weight={500}>
                                Start using
                            </Text>
                            <Third_party_login auths={auths} />
                        </>
                    )}
                </Paper>
            </Container>
        </Container>
    );
}
