import { Title, Box, Flex, Loader } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "@/api";

export default function callback() {
    const [error, setError] = useState<string>("");

    useEffect(() => {
        api.get("/user/profile")
            .then((res) => {
                if (res.status === 200) {
                    window.location.href = "/dashboard";
                } else {
                    setError(res.data.message);
                }
            })
            .catch((err) => {
                setError(err?.response?.data?.message);
            });
    }, []);

    return (
        <Flex w={"100%"} h={"100vh"} justify={"center"} align={"center"}>
            {error ? (
                <Box>
                    <Title>{error}</Title>
                </Box>
            ) : (
                <Loader size="lg" variant="bars" color="orange" />
            )}
        </Flex>
    );
}
