
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Modal, Button, SegmentedControl, Box, Group, PasswordInput, Space, TextInput, Title, Flex, Text, useMantineTheme } from "@mantine/core";
import api from "@/api";
import { ChannelCreate } from "./type";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import chatSocket from "@/socket/chatSocket";

export function CreateNewGroup({ children }: { children: any }) {
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();
    const [GroupType, setGroupType] = useState("Public");

    const form = useForm({
        initialValues: {
            name: "",
            password: "",
        },

        validate: {
            name: (value) => {
                if (value.length < 3) {
                    return "Group name must be at least 3 characters long";
                }
                return null;
            },
            password: (value) => {
                if (GroupType === "Protected" && value.length < 8) {
                    return "Password must be at least 8 characters long";
                }
                // check if password has at least one number
                if (GroupType === "Protected" && !/\d/.test(value)) {
                    return "Password must contain at least one number";
                }
                // no spaces
                if (GroupType === "Protected" && /\s/.test(value)) {
                    return "Password must not contain spaces";
                }
                // check if password has at least one uppercase
                if (GroupType === "Protected" && !/[A-Z]/.test(value)) {
                    return "Password must contain at least one uppercase letter";
                }
                // check if password has at least one lowercase
                if (GroupType === "Protected" && !/[a-z]/.test(value)) {
                    return "Password must contain at least one lowercase letter";
                }
                // max lenght 100
                if (GroupType === "Protected" && value.length > 100) {
                    return "Password must be less than 100 characters long";
                }
                // check if password has at least one special character
                if (GroupType === "Protected" && !/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)) {
                    return "Password must contain at least one special character";
                }
                return null;
            },
        },
    });

    const [created, setCreated] = useState(false);

    useEffect(() => {
        if (created == true) {
            setTimeout(() => {
                setCreated(false);
            }, 2000);
        }
    }, [created]);

    const submit = form.onSubmit((values: ChannelCreate) => {
        const { name, password }: ChannelCreate = values;
        const group: ChannelCreate = {
            name,
            password: GroupType === "Protected" ? password : "",
            type: GroupType.toLocaleLowerCase() as "public" | "private" | "protected",
        };

        api.post("/user/create_channel", group)
            .then((res) => {
                if (res.status == 201) {
                    setCreated(true);
                    form.reset();
                    chatSocket.emit("reconnect");
                }
            })
            .catch((err) => {
                form.setFieldError("name", err.response.data.message);
            });
    });

    return (
        <>
            <Modal
                overlayProps={{
                    color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
                    opacity: 0.55,
                    blur: 8,
                }}
                opened={opened}
                onClose={close}
                centered
                radius={30}
            >
                <Box maw={300} mx="auto" pb={20}>
                    {created == true ? (
                        <>
                            <Flex align="center" justify="center" direction="column" mih={100}>
                                <IconCheck size={50} color={theme.colors.green[6]} />
                                <Space py={10} />
                                <Text>Group created successfully</Text>
                                <Space py={20} />
                            <Button onClick={close}>Close</Button>
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Title order={3}>Create new group</Title>
                            <Space py={15} />
                            <form onSubmit={submit} autoComplete="off">
                                <SegmentedControl
                                    fullWidth
                                    data={["Public", "Private", "Protected"]}
                                    color=""
                                    value={GroupType}
                                    onChange={setGroupType}
                                    radius={15}
                                />
                                <Space py={8} />
                                <TextInput label="Group Name" placeholder="Name" required {...form.getInputProps("name")} autoComplete="off" />
                                <Space py={5} />
                                {GroupType === "Protected" && (
                                    <PasswordInput
                                        label="Password"
                                        placeholder="Password"
                                        {...form.getInputProps("password")}
                                        withAsterisk={GroupType === "Protected"}
                                    />
                                )}
                                <Space py={5} />

                                <Group position="right" mt="md">
                                    <Button type="submit">Create</Button>
                                </Group>
                            </form>
                        </>
                    )}
                </Box>
            </Modal>

            <Box onClick={open}>{children}</Box>
        </>
    );
}
