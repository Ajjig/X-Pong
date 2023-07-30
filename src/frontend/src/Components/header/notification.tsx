import React, { useEffect } from "react";
import { ActionIcon, Avatar, Button, Flex, Indicator, Popover, Space, Stack, Text, Title } from "@mantine/core";
import { IconBell, IconBellExclamation, IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { Notification } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import store from "@/store/store";

export function NotificationPopover() {
    const [opened, { close, open }] = useDisclosure(false);
    const [notifications, setNotifications] = React.useState<any[]>([]);

    useEffect(() => {
        // subscribe to store to get notifications
        store.subscribe(() => {
            // console.log("@> HERE: ", store.getState().notifications.friend_requests);
            setNotifications(store.getState().notifications.friend_requests ?? []);
        });
    }, []);

    const acceptFriendRequest = (username: string) => {
        console.log("@> Accepting friend request from: ", username);
    }

    return (
        <Popover position="bottom" withArrow shadow="md" arrowPosition="side" arrowSize={15}>
            <Popover.Target>
                <Indicator color="red" offset={7} size={13}>
                    <ActionIcon variant="filled" p={8} color="purple" radius={100} onClick={() => open()} size="45" onMouseEnter={open} onMouseLeave={close}>
                        <IconBell size={25} />
                    </ActionIcon>
                </Indicator>
            </Popover.Target>

            <Popover.Dropdown mr={90} bg={"cos_black.3"}>
                <Stack miw={400}>
                    {
                        // if there are no notifications
                        notifications.length == 0 && (
                            <Flex align="center" h={100} justify='center'>
                                    <IconBellExclamation size={25} />
                                    <Space w={10} />
                                <Title size="sm" weight={700}>
                                    No notifications
                                </Title>
                            </Flex>
                        )
                    }
                    {notifications.map((notification) => (
                        <Notification key={notification.id} withCloseButton={false} bg={"cos_black.2"} sx={{ border: 0 }} radius={"lg"}>
                            <Space h={10} />
                            <Flex align="center">
                                <Avatar size="lg" radius="xl" src={notification.avatar} />
                                <Space w={10} />
                                <Stack spacing={0}>
                                    <Title size="sm" weight={700}>
                                        {notification.from}
                                    </Title>
                                    {/* <Text size="sm">@{notification.from} sent you a friend request</Text> */}
                                    <Text size="sm">{notification.msg}</Text>
                                </Stack>
                            </Flex>
                            {/* button accept/reject */}
                            <Flex justify="flex-end" align="center" py="md">
                                <Button size="xs" color="purple" variant="filled" onClick={() => acceptFriendRequest(notification.from)}>
                                    Accept
                                </Button>
                                <Space w={10} />
                                <Button size="xs" variant="default">
                                    reject
                                </Button>
                            </Flex>
                        </Notification>
                    ))}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
