import React from "react";
import { Header, useMantineTheme, Image, Group, Flex, Title, Paper, Space } from "@mantine/core";
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
                                    <Title fw="bolder" color="gray.0" fz="26px" underline={false}>
                                        Xpong
                                    </Title>
                                </Flex>
                            </Link>
                        </Group>

                        <Search />
                        {!isMobile && <LeftMenu />}
                    </Flex>
                    {/* Mobile */}
                    {router.pathname == "/dashboard" && (
                        <>
                            <Space w={theme.spacing.md} />
                            <DrawerMobile />
                        </>
                    )}
                </Flex>
            </Paper>
        </Header>
    );
}

export function LeftMenu({ withUser = true }: { withUser?: boolean }) {
    const theme = useMantineTheme();
    return (
        <Flex align="center">
            <Play />
            <Space w={theme.spacing.md} />
            <NotificationPopover />
            <Space w={theme.spacing.md} />
            {withUser && <ProfileSection />}
        </Flex>
    );
}
