import React, { useEffect } from "react";
import {
    Header,
    MediaQuery,
    useMantineTheme,
    Image,
    Group,
    Flex,
    Title,
    Paper,
    Space,
    Box,
    Button,
    Loader,
    createStyles,
    ActionIcon,
    UnstyledButton,
    MantineTheme,
} from "@mantine/core";
import ProfileSection from "./profile_menu";
import Link from "next/link";
import DrawerMobile from "./drawer";
import { Search } from "./search";
import { NotificationPopover } from "./notification";
import { useRouter } from "next/router";

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

import { Menu, Modal } from "@mantine/core";
import { IconUserCircle, IconArrowsRandom, IconDeviceGamepad2 } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
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
            <Menu shadow="md" width={200} withArrow arrowSize={15} position="bottom-end" arrowOffset={42}>
                <Menu.Target>
                    <Box>
                        <Button variant="filled" leftIcon={<IconDeviceGamepad2 size={20} />} h={40}>
                            Play
                        </Button>
                    </Box>
                </Menu.Target>

                <Menu.Dropdown>
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
