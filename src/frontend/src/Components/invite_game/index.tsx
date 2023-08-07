import React, { use, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Box, LoadingOverlay, Button, Divider, Flex, Text, Space, Avatar } from "@mantine/core";
import { useState } from "react";
import socketGame from "@/socket/gameSocket";
import api from "@/api";

type InviteInfoType = {
    username: string;
    id: number;
};

export function InviteToGame() {
    const [opened, { open, close }] = useDisclosure(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [inviteInfo, setInviteInfo] = useState<InviteInfoType>({
        username: "",
        id: 0,
    });

    useEffect(() => {
        if (!socketGame.connected) socketGame.connect();
        socketGame.on("invite", (data: InviteInfoType) => {
            setInviteInfo(data);
            open();
        });

        socketGame.on("invite-accepted", () => {
            console.log("invite-accepted");
            setLoading(false);
            close();
        });

        socketGame.on("invite-canceled", () => {
            console.log("invite-canceled");
            setLoading(false);
            close();
        });

        return () => {
            setLoading(false);
            setInviteInfo({
                username: "",
                id: 0,
            });
        };
    }, []);

    return (
        <>
            <Modal
                overlayProps={{
                    opacity: 0.55,
                    blur: 8,
                }}
                opened={opened}
                onClose={close}
                centered
                radius={30}
                withCloseButton={false}
                closeOnClickOutside={false}
            >
                <LoadingOverlay visible={Loading} overlayBlur={3} />
                <Flex maw={300} mx="auto" py={20} pos={"relative"} direction="column" align="center">
                    <Avatar size="80px" radius={"100%"} src={api.getUri() + "user/avatar/" + inviteInfo.id} mb={0} />
                    <Space h={10} />
                    <Flex>
                        <Space w={10} />
                        <Text size="lg">{inviteInfo.username} invited you to play a game</Text>
                    </Flex>
                    <Space h={30} />
                    <Flex w="80%" justify="space-between" mt={10}>
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={() => {
                                socketGame.emit("reject-invite", inviteInfo);
                                close();
                            }}
                        >
                            Cancel
                        </Button>
                        <Divider orientation="vertical" />
                        <Button
                            color="green.8"
                            variant="subtle"
                            onClick={() => {
                                socketGame.emit("accept-invite", inviteInfo);
                                setLoading(true);
                            }}
                        >
                            Accept
                        </Button>
                    </Flex>
                </Flex>
            </Modal>
        </>
    );
}
