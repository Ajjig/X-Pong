import React, { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Box, LoadingOverlay, Flex, Text, Switch, Title, Image, Space, Group, PinInput } from "@mantine/core";

import { useState } from "react";
import store, { set2fa } from "@/store/store";
import api from "@/api";
import { AxiosError, AxiosResponse } from "axios";
import { notifications } from "@mantine/notifications";

export function Two_factor_authentication({ opened, open, close }: { opened: boolean; open: any; close: any }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);
    const [image, setImage] = useState<any>();
    const [pinCode, setPinCode] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    function Setup2FA() {
        setLoading(true);
        api.post("/user/setup_2fa")
            .then((res: AxiosResponse) => {
                // console.log(res.data);
                setImage(res.data);
                setLoading(false);
                // store.dispatch(set2fa(true));
            })
            .catch((err: AxiosError<{ message: string }>) => {
                notifications.show({
                    title: "Error",
                    message: err.response?.data.message,
                    color: "red",
                });
                setLoading(false);
                setActive(false);
            });
    }

    function Disable2FA() {
        api.post("/user/disable_2fa")
            .then((res: AxiosResponse) => {
                notifications.show({
                    title: "Success",
                    message: "Two-factor authentication disabled",
                    color: "green",
                });
                setActive(false);
                store.dispatch(set2fa(false));
            })
            .catch((err: AxiosError<{ message: string }>) => {
                notifications.show({
                    title: "Error",
                    message: err.response?.data.message,
                    color: "red",
                });
                setActive(true);
            });
    }

    function verify(e: string) {
        api.post("/user/verify_2fa", { code: e })
            .then((res: AxiosResponse) => {
                notifications.show({
                    title: "Success",
                    message: "Two-factor authentication enabled",
                    color: "green",
                });
                setLoading(false);
                store.dispatch(set2fa(true));
                close();
            })
            .catch((err: AxiosError<{ message: string }>) => {
                notifications.show({
                    title: "Error",
                    message: err.response?.data.message,
                    color: "red",
                });
                setError(err.response?.data.message ?? "Something went wrong");
            });
    }

    useEffect(() => {
        setActive(store.getState().profile.user.istwoFactor);
        setImage(undefined);
        setPinCode("");
    }, [opened]);

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
                <Box mx="auto" p={20} pb={50}>
                    <Flex direction="row" align="center" justify="space-between" m="auto" pb={20}>
                        <Title size="lg" weight={700} align="center">
                            Two-factor authentication
                        </Title>

                        <Switch checked={active} onChange={() => setActive(!active)} onClick={active ? Disable2FA : Setup2FA} />
                    </Flex>

                    <Text size="sm" weight={500} color="dummy">
                        Two-factor authentication adds an extra layer of security to your account by requiring an additional code from your phone.
                    </Text>
                    <Flex direction="column" align="center" justify="center">
                        {image && (
                            <>
                                <Space h={20} />
                                <Image src={image} alt="QR code" maw={200} />
                                <Text size="sm" color="dummy" align="center" pt={20}>
                                    Scan the QR code with your <br /> authenticator app.
                                </Text>
                                <Box>
                                    <Space h={20} />
                                    <Title size="sm" weight={700} align="center">
                                        Enter the 6-digit code from your authenticator app
                                    </Title>
                                    <Group position="center" mt={20}>
                                        <PinInput
                                            size="lg"
                                            radius="xl"
                                            variant="filled"
                                            color="purple"
                                            length={6}
                                            value={pinCode}
                                            onChange={(e) => {
                                                setError(null);
                                                setPinCode(e);
                                                if (pinCode.length === 5) verify(e);
                                            }}
                                            error={error != null}
                                        />
                                    </Group>
                                </Box>
                            </>
                        )}
                    </Flex>
                </Box>
            </Modal>
        </>
    );
}
