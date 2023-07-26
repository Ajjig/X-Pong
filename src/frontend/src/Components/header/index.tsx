import React from "react";
import { Header, MediaQuery, useMantineTheme, Image, Group, Flex, Title, Paper, Space } from "@mantine/core";
import ProfileSection from "./profile_menu";
import Link from "next/link";
import DrawerMobile from "./drawer";
import { Search } from "./search";
import { NotificationPopover } from "./notification";
import store from "@/store/store";

export default function HeaderDashboard({ HeaderRef }: { HeaderRef: any }) {
    const theme = useMantineTheme();

    return (
        <Header height="auto" w="100%" withBorder={false} bg="none" ref={HeaderRef} pb="md">
            <Paper px="md" bg="cos_black.2">
                <Flex w="100%" justify="space-between" align="center">
                    <Flex w="100%" justify="space-between">
                        <Group py="md">
                            <Link
                                href="/dashboard"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                <Flex align="center" justify="center">
                                    <Image src="/logo.svg" width={40} height={40} />
                                    <Space w={theme.spacing.xs} />
                                    <Title fw="bolder" color="gray.0" fz="26px" underline={false}>
                                        Xping
                                    </Title>
                                </Flex>
                            </Link>
                        </Group>
                        <Flex align="center">
                            <Search />
                        </Flex>
                        <Flex align="center">
                            <NotificationPopover />
                            <Space w={theme.spacing.md} />
                            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                                <ProfileSection />
                            </MediaQuery>
                        </Flex>
                    </Flex>
                    <DrawerMobile />
                </Flex>
            </Paper>
        </Header>
    );
}
