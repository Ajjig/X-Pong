import { Title, Box, Flex, Loader, Paper, Group, PinInput, Space, Button } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "@/api";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";

export default function callback() {
    const [error, setError] = useState<string | null>(null);
    const [pinCode, setPinCode] = useState<string>("");
    const router = useRouter();

    function verify() {
        api.post("/user/verify_2fa", { code: pinCode })
            .then((res: AxiosResponse) => {
                console.log(res.data);
                router.push("/dashboard");
            })
            .catch((err: AxiosError<{message: string}>) => {
                console.log(err.response?.data);
                setError(err.response?.data.message ?? "Something went wrong");
            });
    }

    useEffect(() => {}, []);

    return (
        <Flex w={"100%"} h={"100vh"} justify={"center"} align={"center"}>
            <Paper shadow="md" radius={20} bg={"cos_black.2"} p={50}>
                <Title>Two-factor authentication</Title>
                <Box>
                    <Title size="sm" weight={700} align="center">
                        Please enter the code from your authenticator app
                    </Title>
                    <Space h={20} />
                    <Group position="center">
                        <PinInput length={6} radius={0} value={pinCode} onChange={setPinCode} error={error != null} size="lg" />
                    </Group>

                    <Space h={20} />
                    <Button variant="light" color="purple" fullWidth onClick={verify}>
                        Verify
                    </Button>
                </Box>
            </Paper>
        </Flex>
    );
}
