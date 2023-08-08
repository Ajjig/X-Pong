import { Box, Button, Flex, Loader, Menu, Modal, Paper, Space, Text, Title, createStyles } from "@mantine/core";
import { IconUserCircle, IconArrowsRandom, IconDeviceGamepad2 } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import socketGame from "@/socket/gameSocket";
import store, { setOpp } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useModelStyle = createStyles((theme) => ({
    content: {
        backgroundColor: "transparent",
    },
    overlay: {
        backdropFilter: "blur(5px)",
    },
}));

export function Play() {
    const [visible, { close, open }] = useDisclosure(false);
    const ModelStyle = useModelStyle();
    const router = useRouter();

    const join = () => {
        open();
        // join request
        socketGame.emit("join", { msg: "join" });
    };

    const cancel = () => {
        close();
        // cancel request
        socketGame.emit("cancel-join", { msg: "cancel" });
    };

    useEffect(() => {
        socketGame.on("match", (data) => {
            store.dispatch(setOpp(data));
            router.push(`/game/${data.roomName}`);
        });

        socketGame.on("cancel-join", () => {
            console.log("cancel-join");
            close();
        });
    }, []);

    return (
        <>
            <Modal opened={visible} onClose={close} title="" centered withCloseButton={false} closeOnClickOutside={false} classNames={ModelStyle.classes}>
                <Paper radius={20} shadow="md" p={30}>
                    <Flex direction="column" align="center" justify="center">
                        <Title fz={"md"} my={20}>
                            Waiting for opponent
                        </Title>
                        <Loader variant="dots" my={20} />
                        <Button variant="default" onClick={cancel} color="gray" my={20}>
                            Cancel
                        </Button>
                    </Flex>
                </Paper>
            </Modal>
            <Menu shadow="md" width={200} withArrow arrowSize={15} position="bottom-end" arrowOffset={42}>
                <Menu.Target>
                    <Box>
                        <Button variant="filled" leftIcon={<IconDeviceGamepad2 size={20} />} h={40}>
                            Play
                        </Button>
                    </Box>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Play</Menu.Label>
                    <Menu.Item icon={<IconUserCircle size={18} />}>Challenge a friend</Menu.Item>
                    <Menu.Item icon={<IconArrowsRandom size={18} />} onClick={join}>
                        Play with random
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
}
