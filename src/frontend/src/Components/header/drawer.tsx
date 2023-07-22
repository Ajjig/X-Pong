import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button, Group, Burger, useMantineTheme, MediaQuery, List } from "@mantine/core";
import ProfileSection from "./profile_menu";
import List_of_chats from "../dashboard/list_of_chats";

interface props {}

function DrawerMobile({}: props) {
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();

    return (
        <>
            <Drawer opened={opened} onClose={close}>
                {/* Drawer content */}
                <ProfileSection />
                <List_of_chats />
            </Drawer>

            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Group position="center">
                    <Burger opened={opened} onClick={opened ? close : open} size="sm" color={theme.colors.gray[6]} />
                </Group>
            </MediaQuery>
        </>
    );
}

export default DrawerMobile;
