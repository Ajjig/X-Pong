import React from "react";
import { Popover, ActionIcon, Text, Flex, Input, Button, MantineTheme, Space, useMantineTheme } from "@mantine/core";
import { IconMessage, IconSend } from "@tabler/icons-react";

interface props {message: string | null, setMessage: any, profile: any, sendMessage: any}

export default function Message({message, setMessage, profile, sendMessage}: props) {
    const theme = useMantineTheme();

    return (
        <Popover>
            <Popover.Target>
                <ActionIcon
                    variant="filled"
                    p={10}
                    size="xl"
                    color="gray"
                    radius="md"
                    onClick={() => {}}
                    sx={{
                        color: theme.colors.gray[1],
                    }}
                >
                    <IconMessage />
                </ActionIcon>
            </Popover.Target>
            {message != null ? (
                <Popover.Dropdown>
                    <Flex align="center" p={10}>
                        <Text>Say Hi to {profile && profile.name}</Text>
                    </Flex>
                    <Space h="xs" />
                    <Flex justify="center" align="center">
                        <Input
                            sx={(theme: MantineTheme) => ({
                                // change outline color on focus
                                "&:focus": {
                                    outline: `1px solid ${theme.colors.orange[6]} !important`,
                                    outlineOffset: 2,
                                },
                            })}
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e: any) => setMessage(e.currentTarget.value)}
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter") {
                                    sendMessage({
                                        message: message,
                                        from: "me",
                                    });
                                }
                            }}
                            w="100%"
                            rightSection={
                                <IconSend
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    size={20}
                                    onClick={() => {
                                        sendMessage({
                                            message: message,
                                            from: "me",
                                        });
                                    }}
                                />
                            }
                        />
                    </Flex>
                </Popover.Dropdown>
            ) : (
                <Popover.Dropdown>
                    <Flex direction="column" align="center" p={10}>
                        <Text>Your message has been sent!</Text>
                        <Space h="xs" />
                        <Button variant="filled" onClick={() => setMessage("")}>
                            Send another message
                        </Button>
                    </Flex>
                </Popover.Dropdown>
            )}
        </Popover>
    );
}
