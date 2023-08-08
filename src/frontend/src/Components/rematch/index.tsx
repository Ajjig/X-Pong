import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Box, Title, Flex, Text, LoadingOverlay, Divider } from "@mantine/core";
import { useEffect, useState } from "react";
import store, { setOpp } from "@/store/store";
import socketGame from "@/socket/gameSocket";
import { useRouter } from "next/router";

export default function Rematch({}: {}) {
    const [opened, { open, close }] = useDisclosure();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!socketGame.connected) socketGame.connect();
        socketGame.on("re-match", (data) => {
            store.dispatch(setOpp(data));
            open();
        });
    }, []);

    function cancel() {
        socketGame.emit("leave");
        close();
    }

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
                withCloseButton={!loading}
            >
                <LoadingOverlay visible={loading} overlayBlur={3} />
                <Box maw={300} mx="auto" pb={40} pos={"relative"}>
                    <Flex direction="column" align="center" justify="center">
                        <Title fz={"lg"} my={20}>
                            Rematch
                        </Title>
                        <Text align="center">Do you want to return to previous game?</Text>
                        <Flex direction="row" align="center" justify="space-evenly" mb={20} mt={40} w="100%">
                            <Button
                                onClick={() => {
                                    close();
                                    router.push(`/game/${store.getState().game.opp.roomName}`);
                                }}
                                variant="filled"
                                color="purple"
                                loading={loading}
                                disabled={loading}
                            >
                                Yes
                            </Button>
                            <Divider orientation="vertical" />
                            <Button onClick={cancel} variant="light" color="red" loading={loading} disabled={loading}>
                                No
                            </Button>
                        </Flex>
                    </Flex>
                </Box>
            </Modal>
        </>
    );
}
