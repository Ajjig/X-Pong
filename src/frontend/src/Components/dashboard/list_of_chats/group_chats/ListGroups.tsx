import { Box, Divider, Group, MantineTheme, Navbar, PasswordInput, Space, Text, TextInput, Title, Tooltip, useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import store from "@/store/store";
import { Chat } from "../private_chats/Chat";
import { spotlight } from "@mantine/spotlight";
import { IconMessage, IconPlus } from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";

export function ListGroups({}: {}) {
    const [chats, setChats] = useState<any>([]);

    useEffect(() => {
        setChats(store.getState().chats.PrivateChats);
        store.subscribe(() => {
            const chatsFromStore = store.getState().chats.PrivateChats;
            setChats(chatsFromStore);
        });
    }, []);

    return (
        <>
            <Box w={"100%"} h="100%" p="md">
                <Navbar.Section>
                    {chats.length == 0 && (
                        <Box
                            sx={(theme: MantineTheme) => ({
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                height: "30vh",
                                width: "100%",
                                color: theme.colors.gray[6],
                                flexDirection: "column",
                            })}
                        >
                            <IconMessage size={50} />
                            <Space h={5} />
                            <Text>No chats yet</Text>
                        </Box>
                    )}
                    {chats.map((chat: any, index: number) => (
                        <Box key={index}>
                            <Space py={2} />
                            <Chat chat={chat} />
                            <Space py={2} />
                            <Divider />
                        </Box>
                    ))}
                </Navbar.Section>
            </Box>
            {/* floating add button in the buttom */}
            <Box
                sx={(theme: MantineTheme) => ({
                    position: "absolute",
                    bottom: theme.spacing.md,
                    right: theme.spacing.md,
                })}
            >
                <CreateNewGroup>
                    <Tooltip color="gray" label="Create new group" position="top">
                        <Box
                            sx={(theme: MantineTheme) => ({
                                borderRadius: "100%",
                                background: theme.colors.orange[8],
                                width: 50,
                                height: 50,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                color: theme.colors.orange[1],
                            })}
                            onClick={() => {}}
                        >
                            <IconPlus size={25} />
                        </Box>
                    </Tooltip>
                </CreateNewGroup>
            </Box>
        </>
    );
}

import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Modal, Button, SegmentedControl } from "@mantine/core";
import api from "@/api";

function CreateNewGroup({ children }: { children: any }) {
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();
    const [GroupType, setGroupType] = useState("Public");

    const form = useForm({
        initialValues: {
            name: "",
            owner: store.getState()?.profile?.user?.username,
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
                return null;
            },
        },
    });

    const submit = form.onSubmit((values) => {
        const { name, owner, password } = values;
        const group = {
            name,
            owner,
            password: GroupType === "Protected" ? password : "",
            type: GroupType,
        };
        console.log(group);

        api.post("/create_channel", group)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err.response.data);
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
            >
                <Box maw={300} mx="auto" pb={20}>
                    <Title order={3}>CREAT NEW GROUP</Title>
                    <Space py={15} />

                    <form onSubmit={submit}>
                        <SegmentedControl
                            fullWidth
                            data={["Public", "Private", "Protected"]}
                            color="orange"
                            value={GroupType}
                            onChange={setGroupType}
                            radius={15}
                        />
                        <Space py={8} />
                        <TextInput label="Group Name" placeholder="Name" required {...form.getInputProps("name")} />
                        <Space py={5} />
                        <PasswordInput
                            label="Password"
                            placeholder="Password"
                            {...form.getInputProps("password")}
                            disabled={GroupType !== "Protected"}
                            withAsterisk={GroupType === "Protected"}
                        />
                        <Space py={5} />

                        <Group position="right" mt="md">
                            <Button type="submit">Create</Button>
                        </Group>
                    </form>
                </Box>
            </Modal>

            <Box onClick={open}>{children}</Box>
        </>
    );
}
