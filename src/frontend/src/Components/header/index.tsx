import React from "react";
import { Box, Header, MediaQuery, Burger, useMantineTheme, Image, Group, Flex, Title, Paper } from "@mantine/core";
import ProfileSection from "./profile_menu";
import Link from "next/link";
import DrawerMobile from "./drawer";

export default function HeaderDashboard({ HeaderRef }: { HeaderRef: any}) {
    const [opened, setOpened] = React.useState(false);
    const theme = useMantineTheme();

    return (
        <Header height="auto" w="100%" p="md" withBorder={false} bg='none' ref={HeaderRef}>
            <Paper px="md" bg="dark.5" radius={"lg"}>
                <Flex w="100%" justify="space-between" align="center">
                    <Flex w="100%" justify="space-between">
                        <Group py="md">
                            <Image src="/favicon.svg" width={40} height={40} />
                            <Link
                                href="/dashboard"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                <Title color="gray.0" fz="xl" underline={false}>
                                    70sPong
                                </Title>
                            </Link>
                        </Group>
                        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                            <Box>
                                <ProfileSection />
                            </Box>
                        </MediaQuery>
                    </Flex>
                    <DrawerMobile />
                </Flex>
            </Paper>
        </Header>
    );
}
