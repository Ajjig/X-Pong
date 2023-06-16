import { Avatar, Flex, Menu } from "@mantine/core";
import React from "react";
import { IconSettings, IconUser } from "@tabler/icons-react";
import { Button, Text, Box, Center } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { IconBan } from "@tabler/icons-react";

export function PrivateChatMenu({ user }: any) {
    return (
        <Menu shadow="md" width={200} withArrow>
            <Menu.Target>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        cursor: "pointer",
                    }}
                >
                    <IconDots />
                </Box>
            </Menu.Target>

            <Menu.Dropdown>
                <Flex direction='column' mih="150px" justify='center' align='center'>
                    <Avatar size="xl" src={user.avatar} radius="xl" />
                    <Box mt={10}>
                        <Text fw="bold" fz="md">
                            {user.name}
                        </Text>
                    </Box>
                </Flex>

                <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item>
                <Menu.Item color="red" icon={<IconBan size={14} />}>
                    Ban
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
