import React from "react";
import { Box, Avatar, Center, Space, Flex, Button, ActionIcon, Text } from "@mantine/core";
import { IconBan, IconUser } from "@tabler/icons-react";

function AsideChatInfo({user}: any) {
    console.log("user", user);
    return (
        <Box p="md" mt={50}>
            <Center>
                <Avatar
                    size={"100px"}
                    radius={"100%"}
                    src={user.avatar}
                />
            </Center>
            <Space h={20} />
            <Center>
                <Flex direction="column" align="center">
                    <Text fw="bold" fz="lg">
                        {user.name}
                    </Text>
                </Flex>
            </Center>
            {/* menu Ban-profile */}
            <Space h={20} />
            <Center>
                <Flex align="center" gap='20px'>
                    {/* button with icon */}

                    <Flex direction={'column'} justify='center' align='center'>
                        <ActionIcon variant="filled" radius="xl" size="lg">
                            <IconUser size={20} />
                        </ActionIcon>
                        <Space h={8} />
                        <Text fz="sm">Profile</Text>
                    </Flex>
                    <Flex direction={'column'} justify='center' align='center'>
                        <ActionIcon color="red" variant="filled" radius="xl" size="lg">
                            <IconBan size={20} />
                        </ActionIcon>
                        <Space h={8} />
                        <Text fz="sm">Ban</Text>
                    </Flex>
                </Flex>
            </Center>
        </Box>
    );
}

export default AsideChatInfo;
