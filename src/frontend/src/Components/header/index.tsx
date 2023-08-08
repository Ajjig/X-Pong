import React from "react";
import { Header, useMantineTheme, Image, Group, Flex, Title, Paper, Space, MantineTheme, rem } from "@mantine/core";
import ProfileSection from "./menu";
import Link from "next/link";
import DrawerMobile from "./drawer";
import { Search } from "./search";
import { NotificationPopover } from "./notification";
import { useRouter } from "next/router";
import { Play } from "./play";
import { useMediaQuery } from "@mantine/hooks";

export default function HeaderDashboard({ HeaderRef }: { HeaderRef: any }) {
    const theme = useMantineTheme();
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    return (
        <Header height="auto" w="100%" withBorder={false} bg="none" ref={HeaderRef} pb="md">
            <Paper px="md" bg="cos_black.2">
                <Flex w="100%" justify="space-between" align="center">
                    <Flex w="100%" justify="space-between">
                        <Group py="md">
                            <Link href="/dashboard" style={{ textDecoration: "none" }}>
                                <Flex align="center" justify="center">
                                    <Image src="/logo.svg" width={40} height={40} mr={theme.spacing.xs} />
                                    <Title
                                        fw="bolder"
                                        color="gray.0"
                                        sx={(theme: MantineTheme) => ({
                                            fontSize: rem(25),
                                            [theme.fn.smallerThan("sm")]: {
                                                fontSize: rem(20),
                                            },
                                        })}
                                        underline={false}
                                    >
                                        Xpong
                                    </Title>
                                </Flex>
                            </Link>
                        </Group>
                        <Group spacing={8}>
                            <Search />
                            {isMobile && <NotificationPopover />}
                            {!isMobile && <LeftMenu />}
                            {isMobile && <ProfileSection closeDrawer={null} />}
                        </Group>
                    </Flex>
                    {/* Mobile */}
                    {router.pathname == "/dashboard" && (
                        <>
                            <Space w={5} />
                            <DrawerMobile />
                        </>
                    )}
                </Flex>
            </Paper>
        </Header>
    );
}

export function LeftMenu({ withUser = true, closeDrawer = null }: { withUser?: boolean; closeDrawer?: any }) {
    const theme = useMantineTheme();
    const router = useRouter();

    return (
        <Flex align="center">
            {router.pathname != "/game/[gameID]" && <Play />}
            <Space w={5} />
            <NotificationPopover />
            <Space w={5} />
            {withUser && <ProfileSection closeDrawer={closeDrawer} />}
        </Flex>
    );
}
