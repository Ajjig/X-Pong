import React, { useEffect } from "react";
import {
    Box,
    Header,
    MediaQuery,
    useMantineTheme,
    Image,
    Group,
    Flex,
    Title,
    Paper,
    ActionIcon,
    Stack,
    Popover,
    Text,
    Notification,
    Space,
} from "@mantine/core";
import ProfileSection from "./profile_menu";
import Link from "next/link";
import DrawerMobile from "./drawer";
import { IconBell, IconBellFilled, IconNotification, IconSearch } from "@tabler/icons-react";
import store from "@/store/store";
import { useDisclosure } from "@mantine/hooks";
import socket from "@/socket";
import { useRouter } from "next/router";
import { spotlight } from "@mantine/spotlight";
// import font for title from 'next/font/google'
import { Russo_One } from "next/font/google";

const titleFont = Russo_One({ weight: "400", subsets: ["latin"] });

export default function HeaderDashboard({ HeaderRef }: { HeaderRef: any }) {
    const [opened, setOpened] = React.useState(false);
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

function Search() {
    return (
        <Paper bg="none" radius={130} shadow="md" withBorder sx={{ overflow: "hidden", cursor: "pointer" }} onClick={() => spotlight.open()}>
            <Flex align="center">
                <ActionIcon variant="transparent" p={8} color="dark" radius={100} size="45">
                    <IconSearch size={23} />
                </ActionIcon>
                <Box top="50%" left="50%" p="sx" w={"300px"}>
                    <Text size="sm" weight={"bold"}>
                        Search
                    </Text>
                </Box>
            </Flex>
        </Paper>
    );
}

function NotificationPopover() {
    const [opened, { close, open }] = useDisclosure(false);

    useEffect(() => {
        // subscribe to store to get notifications
        store.subscribe(() => {
            console.log("Store updated: ", store.getState());
        });
    }, []);

    return (
        <Popover position="bottom" withArrow shadow="md" arrowPosition="side">
            <Popover.Target>
                <ActionIcon variant="filled" p={8} color="purple" radius={100} onClick={() => open()} size="45" onMouseEnter={open} onMouseLeave={close}>
                    <IconBell size={25} />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack spacing="xs" p="sm" miw={300}>
                    <Notification title="New message">
                        <Text size="sm">
                            You have new message from <Text weight={700}>@johndoe</Text>
                        </Text>
                    </Notification>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
