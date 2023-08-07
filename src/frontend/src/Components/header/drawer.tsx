import { useDisclosure } from "@mantine/hooks";
import { Drawer, Group, Burger, useMantineTheme, MediaQuery, Space, Box, Flex } from "@mantine/core";
import List_of_chats from "../dashboard/list_of_chats";
import UserInfo from "../dashboard/userInfo";
import { Play } from "./play";
import { NotificationPopover } from "./notification";
import ProfileSection from "./menu";

interface props {}

function DrawerMobile({}: props) {
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();

    return (
        <>
            <Drawer opened={opened} onClose={close} withOverlay position="right">
                {/* Drawer content */}
                <Flex justify={"flex-end"}>
                    <LeftMenu withUser={false} closeDrawer={null} />
                </Flex>
                <Space h="15px" />
                <UserInfo />
                <Space h="15px" />
                <List_of_chats />
            </Drawer>

            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Group position="center">
                    <Burger opened={opened} onClick={opened ? close : open} size="md" color={theme.colors.gray[6]} />
                </Group>
            </MediaQuery>
        </>
    );
}

function LeftMenu({ withUser = true, closeDrawer = null }: { withUser?: boolean; closeDrawer?: any }) {
    const theme = useMantineTheme();

    return (
        <Flex align="center">
            <Play />
            <Space w={theme.spacing.md} />
            <NotificationPopover />
            <Space w={theme.spacing.md} />
            {withUser && <ProfileSection closeDrawer={closeDrawer} />}
        </Flex>
    );
}

export default DrawerMobile;
