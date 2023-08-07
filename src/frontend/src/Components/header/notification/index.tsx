import React, { useEffect } from "react";
import { ActionIcon, Avatar, Button, Flex, Indicator, Popover, Space, Stack, Text, Title } from "@mantine/core";
import { IconBell, IconBellExclamation, IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { Notification } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import store, { removeFriendRequest } from "@/store/store";
import { NotificationType } from "@/socket/types";
import chatSocket from "@/socket/chatSocket";
import api from "@/api";
import { AcceptFriendRequest } from "./type";
import { SocketResponse } from "@/Components/type";
import { Notifications } from "@mantine/notifications";

export function NotificationPopover() {
    const [, { close, open }] = useDisclosure(false);
    const [notifications, setNotifications] = React.useState<any[]>([]);
    const [numberOfNewNotifications, setNumberOfNewNotifications] = React.useState<number>(0);

    useEffect(() => {
        // subscribe to store to get notifications
        store.subscribe(() => {
            setNotifications(store.getState().notifications.friend_requests ?? []);
        });
        chatSocket.on("notification", () => {
            setNumberOfNewNotifications((prev) => prev + 1);
        });
    }, []);

    const acceptFriendRequest = (id: number, notificationID: number) => {
        let payload: AcceptFriendRequest = { id: id };
        chatSocket.emit("accept_friend_request", payload);

        chatSocket.on("accept_friend_request", (data: SocketResponse | any) => {
            if (data == null) return;
            if (data && data?.status == 200) {
                store.dispatch(removeFriendRequest(notificationID));
                chatSocket.emit("reconnect");
            } else {
                if (data?.status) {
                    Notifications.show({
                        title: "Error",
                        message: data.message,
                        color: "red",
                    });
                }
            }
        });
    };

    const rejectFriendRequest = (username: string, id: number) => {
        api.post("/user/reject_friend_request", {
            friend_username: username,
        })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err.response);
            });

        store.dispatch(removeFriendRequest(id));
    };

    return (
        <Popover position="bottom-end" arrowOffset={15} withArrow shadow="md" arrowPosition="side" arrowSize={15}>
            <Popover.Target>
                <Indicator color="red" offset={7} size={17} disabled={numberOfNewNotifications == 0} label={numberOfNewNotifications}>
                    <ActionIcon variant="filled" p={8} color="purple" radius={100} onClick={() => (open(), setNumberOfNewNotifications(0))} size="45" onMouseEnter={open} onMouseLeave={close}>
                        <IconBell size={25} />
                    </ActionIcon>
                </Indicator>
            </Popover.Target>

            <Popover.Dropdown mr={90}>
                <Text size="xs" weight={500} color="dimmed">
                    Notifications
                </Text>
                <Space h={10} />
                <Stack>
                    {
                        // if there are no notifications
                        notifications.length == 0 && (
                            <Flex align="center" h={150} w={300} justify="center" direction="column">
                                <IconBellExclamation size={40} />
                                <Space h={10} />
                                <Title size="sm" weight={700}>
                                    No notifications
                                </Title>
                            </Flex>
                        )
                    }
                    {notifications.map((notification: NotificationType) => (
                        <Notification key={notification.id} withCloseButton={false} bg={"cos_black.2"} sx={{ border: 0 }} radius={"lg"}>
                            <Space h={10} />
                            <Flex align="center">
                                <Avatar size="lg" radius="xl" src={notification.avatarUrl} />
                                <Space w={10} />
                                <Stack spacing={0}>
                                    <Title size="sm" weight={700}>
                                        {notification.from}
                                    </Title>
                                    <Text size="sm">{notification.msg}</Text>
                                </Stack>
                            </Flex>
                            {/* button accept/reject */}
                            {notification.type == "friendRequest" && (
                                <Flex justify="flex-end" align="center" py="md">
                                    <Button
                                        size="xs"
                                        color="purple"
                                        variant="filled"
                                        onClick={() => (acceptFriendRequest(notification.friendId, notification.id))}
                                    >
                                        Accept
                                    </Button>
                                    <Space w={10} />
                                    <Button size="xs" variant="default" onClick={() => rejectFriendRequest(notification.from, notification.id)}>
                                        reject
                                    </Button>
                                </Flex>
                            )}
                        </Notification>
                    ))}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
