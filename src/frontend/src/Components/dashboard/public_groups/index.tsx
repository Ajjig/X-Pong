import { Box, Grid, Title, Text, Button, MantineTheme, Flex, Space } from "@mantine/core";
import { IconUsersGroup } from "@tabler/icons-react";
import React, { useEffect } from "react";

export default function PublicGroups() {
    const [publicGroups, setPublicGroups] = React.useState<any>([]);

    const getLatestPublicGroups = () => {
        setPublicGroups([
            {
                id: 1,
                name: "Public Group 1",
                description: "This is a public group",
                members: 10,
            },
            {
                id: 2,
                name: "Public Group 2",
                description: "This is a public group",
                members: 50,
            },
            {
                id: 3,
                name: "Public Group 3",
                description: "This is a public group",
                members: 10,
            },
        ]);
    };

    useEffect(() => {
        getLatestPublicGroups();
    }, []);

    return (
        <Grid>
            {/* list the public groups */}
            {publicGroups.map((group: any) => (
                <Grid.Col key={group.id} span={12} md={6} lg={4}>
                    <Box
                        p="md"
                        bg="gray"
                        sx={(theme: MantineTheme) => ({
                            borderRadius: theme.radius.md,
                        })}
                    >
                        <Flex p={5}>
                            <IconUsersGroup size={30} />
                            <Space w={10} />
                            <Title order={4}>{group.name}</Title>
                        </Flex>
                        <Text>{group.description}</Text>
                        <Text>{group.members} members</Text>
                        <Button variant="filled" color="gray.7" mt={30} fullWidth sx={(theme: MantineTheme) => ({
                            transition: "background-color 200ms ease",
                            "&:hover": {
                                backgroundColor: theme.colors.gray[9],
                            },
                        })}>
                            Join
                        </Button>
                    </Box>
                </Grid.Col>
            ))}
        </Grid>
    );
}
