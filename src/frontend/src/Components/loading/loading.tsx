import { Flex, Loader } from "@mantine/core";
import React from "react";

export function Loading() {
    return (
        <Flex w={"100%"} h={"100vh"} justify={"center"} align={"center"}>
            <Loader size="lg" variant="bars" color="orange" />
        </Flex>
    );
}
