import store from "@/store/store";
import { Box, Flex, Paper, Avatar, Text, Title, Stack, Space, MantineTheme, Badge } from "@mantine/core";
import React from "react";

export default function UserInfo() {
    const [profile, setProfile] = React.useState<any>(null);

    React.useEffect(() => {
        setProfile(store.getState().profile.user);
        // console.log(store.getState().profile.user);
        store.subscribe(() => {
            setProfile(store.getState().profile.user);
        });
    }, []);

    return (
        <Paper bg="cos_black.2" h="100%" radius={"lg"} p="md">
                <Badge color="purple" variant="filled">
                    {profile?.username}
                </Badge>
            <Flex align="center" justify="center" direction="column" h="90%">
                {/* add card info home */}
                <Flex align="center" justify="center" direction="column">
                    <Avatar
                        src={profile?.avatarUrl}
                        color="purple"
                        radius="xl"
                        size={100}
                        alt={profile?.username}
                        sx={(theme: MantineTheme) => ({
                            border: `8px solid ${theme.colors.purple[5]}`,
                        })}
                    />
                    <Space h={15} />
                    <Stack align="center" spacing="none">
                        <Title fz="20px" color="gray.0">
                            {profile?.name}
                        </Title>
                        <Text color="gray.3">{profile?.email}</Text>
                    </Stack>
                </Flex>
            </Flex>
        </Paper>
    );
}
