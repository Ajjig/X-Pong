import React from "react";
import { Text, Anchor } from "@mantine/core";

interface Props {
    action: (value: boolean) => void;
}

export default function Register_Link({ action }: Props) {
    return (
        <Text size="xs" weight={500}>
            Don't have an account?
            <Anchor color="orange" ml="xs" onClick={() => action(true)}>
                Register
            </Anchor>
        </Text>
    );
}
