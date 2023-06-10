import { Box, Flex, Paper, Title, Text, Avatar, Space } from "@mantine/core";
import { MantineTheme } from "@mantine/core"

export function UserInfo({ profile }: { profile: any }) {
    return (
        <Paper radius={20} bg={"transparent"}>
            <Flex direction="column" justify="center" align="center">
                <Box
                    sx={{
                        border: "8px solid #fff",
                        borderRadius: "100%",
                        width: "fit-content",
                        margin: "0px",
                    }}
                >
                    <Avatar
                        src={profile?.avatarUrl}
                        alt={profile?.name}
                        radius="100%"
                        bg={'gray'}
                        sx={(theme: MantineTheme) => ({
                            width: "130px !important",
                            height: "130px !important",
                            [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                                width: "100px !important",
                                height: "100px !important",
                            },
                            [theme.fn.smallerThan(theme.breakpoints.xs)]: {
                                width: "100px !important",
                                height: "100px !important",
                            },
                        })}
                    />
                </Box>

                <Space h={15} />
                <Title
                    color="gray.0"
                    order={2}
                    sx={(theme: MantineTheme) => ({
                        fontSize: "1.3rem",
                        [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                            fontSize: "1.2rem",
                        },
                        [theme.fn.smallerThan(theme.breakpoints.xs)]: {
                            fontSize: "1rem",
                        },
                    })}
                >
                    {profile?.name}
                </Title>
                <Text
                    color="gray.4"
                    sx={(theme: MantineTheme) => ({
                        fontSize: "1rem",
                        [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                            fontSize: "0.8rem",
                        },
                        [theme.fn.smallerThan(theme.breakpoints.xs)]: {
                            fontSize: "0.7rem",
                        },
                    })}
                >
                    @{profile?.username}
                </Text>
            </Flex>
        </Paper>
    );
}
