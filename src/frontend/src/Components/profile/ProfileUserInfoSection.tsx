import api from "@/api";
import { Box, Flex, Paper, Title, Text, Avatar, Space, Indicator, createStyles } from "@mantine/core";
import { MantineTheme } from "@mantine/core";

const useStyleIndicator = createStyles((theme) => ({
    indicator: {
        border: "3px solid " + theme.colors.gray[3],
    },
}));

export function UserInfo({ profile }: { profile: any }) {
    const StyleIndicator = useStyleIndicator();

    return (
        <Paper radius={20} bg={"transparent"}>
            <Flex direction="row" justify="center" align="center">
                <Indicator
                    color={profile?.onlineStatus == "online" ? "green" : "red"}
                    size="25px"
                    position="bottom-end"
                    offset={10}
                    processing
                    withBorder
                    classNames={StyleIndicator.classes}
                >
                    {profile?.id && (
                        <Avatar
                            src={api.getUri() + `user/avatar/${profile?.id}`}
                            alt={profile?.name}
                            radius={"xl"}
                            bg={"gray"}
                            sx={(theme: MantineTheme) => ({
                                width: "130px !important",
                                height: "130px !important",
                                [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                                    width: "100px !important",
                                    height: "100px !important",
                                },
                                [theme.fn.smallerThan(theme.breakpoints.xs)]: {
                                    width: "90px !important",
                                    height: "90px !important",
                                },
                                border: "5px solid " + theme.colors.gray[3],
                            })}
                        />
                    )}
                </Indicator>

                <Space w={15} />
                <Box>
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
                        {profile?.name}
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
                </Box>
            </Flex>
        </Paper>
    );
}
