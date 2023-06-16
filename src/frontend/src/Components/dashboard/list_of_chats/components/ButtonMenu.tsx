import {
    IconSettings,
    IconSearch,
    IconPhoto,
    IconMessageCircle,
    IconTrash,
    IconArrowsLeftRight,
    IconPlus,
} from "@tabler/icons-react";
import store from "@/store/store";
import { Menu, Box, Text, MantineTheme } from "@mantine/core";

export function ButtonMenu() {
    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Box
                    sx={(theme: MantineTheme) => ({
                        borderRadius: "100%",
                        background: theme.colors.orange[8],
                        width: 50,
                        height: 50,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                    })}
                >
                    <IconPlus size={25} color="white" />
                </Box>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
                <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
                <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
                <Menu.Item
                    icon={<IconSearch size={14} />}
                    rightSection={
                        <Text size="xs" color="dimmed">
                            ⌘K
                        </Text>
                    }
                >
                    Search
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
                <Menu.Item color="red" icon={<IconTrash size={14} />}>
                    Delete my account
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}