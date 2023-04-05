import React from "react";
import { TextInput, Group } from "@mantine/core";

export default function Full_Name_Input({ form }: { form: any }) {
    return (
        <Group grow>
            <TextInput
                placeholder="John"
                label="First name"
                radius="md"
                withAsterisk
                {...form.getInputProps("firstName")}
            />
            <TextInput
                placeholder="Doe"
                label="Last name"
                radius="md"
                withAsterisk
                {...form.getInputProps("lastName")}
            />
        </Group>
    );
}
