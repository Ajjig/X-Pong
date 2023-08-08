import React from "react";
import { ActionIcon, Box, Flex, MantineTheme, MediaQuery, Paper, Text, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { spotlight } from "@mantine/spotlight";

export function Search() {
    return (
        <Flex align="center">
            <Paper bg="none" radius={130} shadow="md" withBorder sx={{ overflow: "hidden", cursor: "pointer" }} onClick={() => spotlight.open()}>
                <Flex align="center">
                    <ActionIcon
                        variant="transparent"
                        p={8}
                        color="dark"
                        radius={100}
                        sx={(theme: MantineTheme) => ({
                            width: rem(45),
                            height: rem(45),
                            [theme.fn.smallerThan("sm")]: {
                                width: rem(35),
                                height: rem(35),
                            },
                        })}
                    >
                        <IconSearch size={25} color="white" />
                    </ActionIcon>
                    <Box
                        top="50%"
                        left="50%"
                        p="sx"
                        w="300px"
                        sx={(theme: MantineTheme) => ({
                            [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                                display: "none",
                            },
                        })}
                    >
                        <Text size="sm" weight={"bold"}>
                            Search
                        </Text>
                    </Box>
                </Flex>
            </Paper>
        </Flex>
    );
}
