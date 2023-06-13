import { Box, Flex, Paper, Title, Text, Avatar, Space } from "@mantine/core";
import { MantineTheme } from "@mantine/core"

export function UserInfo({ profile }: { profile: any }) {
    return (
        <Paper radius={20} bg={"transparent"} sx={(theme: MantineTheme) => ({
            // add after that take the color of the background 
            '&:after': {
                content: '""',
                position: 'absolute',
                zIndex: -1,
                top: '30%',
                left: '-15%',
                width: '130%',
                height: '80%',
                backgroundColor: `${theme.colors.dark[7]}`,
                borderRadius: '50%',
            },
        })}>
            <Flex direction="column" justify="center" align="center">
                <Box
                    sx={(theme: MantineTheme) => ({
                        border: `8px solid ${theme.colors.gray[2]}`,
                        borderRadius: "100%",
                        width: "fit-content",
                        margin: "0px",
                    })}
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
                        color: theme.colors.gray[4],
                    })}
                >
                    {profile?.name} mohamed ali zribi Dolta
                </Title>
                <Text
                    sx={(theme: MantineTheme) => ({
                        fontSize: "1rem",
                        [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                            fontSize: "0.8rem",
                        },
                        [theme.fn.smallerThan(theme.breakpoints.xs)]: {
                            fontSize: "0.7rem",
                        },
                        color: theme.colors.gray[6],
                    })}
                >
                    @{profile?.username}
                </Text>
            </Flex>
        </Paper>
    );
}
