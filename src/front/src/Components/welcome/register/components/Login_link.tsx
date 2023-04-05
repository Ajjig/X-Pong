import React from "react";
import { Text, Anchor } from "@mantine/core";

interface Props {
    action: (value: boolean) => void;
}

export default function Login_Link({ action }: Props) {
    return (
        <Text size="xs" weight={500}>
            Already have an account?
            <Anchor color="orange" ml="xs" onClick={() => action(false)}>
                Login
            </Anchor>
        </Text>
    );
}
