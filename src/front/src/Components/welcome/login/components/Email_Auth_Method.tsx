import React, { ReactNode } from "react";
import { Flex, TextInput, PasswordInput } from "@mantine/core";

interface Props {
    form: any;
    children?: ReactNode;
}

export default function Email_Auth_Method({ form, children }: Props) {
    return (
        <Flex justify="center" direction="column">
            {children}
            <TextInput
                placeholder="you@example.com"
                label="Email"
                radius="md"
                mt="md"
                withAsterisk
                {...form.getInputProps("email")}
            />
            <PasswordInput
                placeholder="********"
                label="Password"
                radius="md"
                mt="md"
                withAsterisk
                {...form.getInputProps("password")}
            />
        </Flex>
    );
}
