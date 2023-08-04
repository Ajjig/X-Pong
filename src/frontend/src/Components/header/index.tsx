import React, { useEffect } from "react";
import { Header, MediaQuery, useMantineTheme, Image, Group, Flex, Title, Paper, Space, Box, Button, Loader, createStyles, ActionIcon } from "@mantine/core";
import ProfileSection from "./profile_menu";
import Link from "next/link";
import DrawerMobile from "./drawer";
import { Search } from "./search";
import { NotificationPopover } from "./notification";
import { useRouter } from "next/router";

export default function HeaderDashboard({ HeaderRef }: { HeaderRef: any }) {
    const theme = useMantineTheme();
    const router = useRouter();

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
                                        Xpong
                                    </Title>
                                </Flex>
                            </Link>
                        </Group>
                        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                            <Flex align="center">
                                <Search />
                            </Flex>
                        </MediaQuery>
                        <Flex align="center">
                            <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
                                <Flex align="center">
                                    <Search />
                                </Flex>
                            </MediaQuery>
                            <Space w={theme.spacing.md} />
                            <Play />
                            <Space w={theme.spacing.md} />
                            <NotificationPopover />
                            <Space w={theme.spacing.md} />
                            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                                <ProfileSection />
                            </MediaQuery>
                        </Flex>
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


import { Menu, Modal } from "@mantine/core";
import { IconUserCircle, IconArrowsRandom, IconDeviceGamepad2 } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import socketGame from "@/socket/gameSocket";
import store, { setOpp } from "@/store/store";

const useModelStyle = createStyles((theme) => ({
    content: {
        backgroundColor: "transparent",
    },
    overlay: {
        backdropFilter: "blur(5px)",
    },
}));

function Play() {
    const [visible, { close, open }] = useDisclosure(false);
    const ModelStyle = useModelStyle();
    const router = useRouter();

    const join = () => {
        open();
        // join request
        socketGame.emit("join", { msg: "join" });
    };

    const cancel = () => {
        close();
        // cancel request
        socketGame.emit("cancel-join", { msg: "cancel" });
    };

    useEffect(() => {
        socketGame.on("match", (data) => {
            console.log(data);
            store.dispatch(setOpp(data));
            router.push(`/game/${data.roomName}`);
        });
    }, []);

    return (
        <>
            <Modal opened={visible} onClose={close} title="" centered withCloseButton={false} closeOnClickOutside={false} classNames={ModelStyle.classes}>
                <Flex direction="column" align="center" justify="center">
                    <Loader />
                    <Space h={50} />
                    <Button variant="outline" onClick={cancel}>
                        Cancel
                    </Button>
                </Flex>
            </Modal>
            <Menu shadow="md" width={200}>
                <Menu.Target>

                    <Button variant="filled" leftIcon={<IconDeviceGamepad2 size={20} />} h={40} >
                         Play
                    </Button>

                </Menu.Target>

                <Menu.Dropdown ml={-15}>
                    <Menu.Label>Play</Menu.Label>
                    <Menu.Item icon={<IconUserCircle size={18} />}>Challenge a friend</Menu.Item>
                    <Menu.Item icon={<IconArrowsRandom size={18} />} onClick={join}>
                        Play with random
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
}
