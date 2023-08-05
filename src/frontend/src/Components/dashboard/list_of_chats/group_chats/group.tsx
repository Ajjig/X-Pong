import { Avatar, Box, Flex, useMantineTheme, Text, Badge } from "@mantine/core";
import React, { useEffect } from "react";
import store, { setCurrentChat, setCurrentChatGroup } from "@/store/store";
import { IconLock, IconShieldLock, IconUsersGroup } from "@tabler/icons-react";

export function Group({ groupInfo }: { groupInfo: any }) {
    const theme = useMantineTheme();

    const icon = () => {
        if (groupInfo.type == "private") {
            return <IconLock size={30} />;
        } else if (groupInfo.type == "protected") {
            return <IconShieldLock size={30} />;
        }
        return <IconUsersGroup size={30} />;
    };

    const color = () => {
        if (groupInfo.type == "private") {
            return "red";
        } else if (groupInfo.type == "protected") {
            return "yellow";
        }
        return "purple";
    };

    return (
        <Box
            bg={"gray.9"}
            sx={{
                borderRadius: theme.radius.lg,
                "&:hover": {
                    bg: "gray.8",
                },
            }}
            onClick={() => {
                store.dispatch(setCurrentChatGroup(groupInfo));
                store.dispatch(setCurrentChat(null));
            }}
        >
            <Flex p="sm" align="center" sx={{ cursor: "pointer" }}>
                <Avatar size="45px" radius="xl" color="purple" variant="outline">
                    {icon()}
                </Avatar>
                <Flex justify="space-between" w="100%">
                    <Box ml={15}>
                        <Text fz="md" fw="bold" color="gray.1" lineClamp={1}>
                            {groupInfo.name}
                        </Text>
                        <Badge color={color()} variant="dot" size="xs">
                            <Text fz="10px" color="gray.5" lineClamp={1}>
                                {groupInfo.type}
                            </Text>
                        </Badge>
                    </Box>
                    <Box color="gray" fz="10px">
                        <Text lineClamp={1}>{groupInfo.messages.length} Messages</Text>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
}
