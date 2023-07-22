import React from "react";
import { Box, Header, MediaQuery, Burger, useMantineTheme, Image, Group, Flex, Title } from "@mantine/core";
import UserButtonMenu from "./profile_menu";
import Link from "next/link";

export default function HeaderDashboard() {
    const [opened, setOpened] = React.useState(false);
    const theme = useMantineTheme();

    return (
        <Header height={{ base: 60, md: 70 }} p="md">
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                    <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" color={theme.colors.gray[6]} mr="xl" />
                </MediaQuery>

                <Flex w="100%" justify="space-between">
                    <Group>
                        <Image src="/favicon.svg" width={40} height={40} />
                        <Link
                            href="/dashboard"
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <Title color="gray.0" fz="xl" underline={false}>
                                70sPong
                            </Title>
                        </Link>
                    </Group>
                    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                        <Box>
                            <UserButtonMenu />
                        </Box>
                    </MediaQuery>
                </Flex>
            </div>
        </Header>
    );
}
