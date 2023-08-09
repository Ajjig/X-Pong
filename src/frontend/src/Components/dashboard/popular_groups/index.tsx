import {
    Box,
    Grid,
    Title,
    Text,
    Button,
    MantineTheme,
    Flex,
    Card,
    Image,
    Paper,
    Group,
    Badge,
    Divider,
    Space,
    Avatar,
    PasswordInput,
    useMantineTheme,
} from "@mantine/core";
import { IconLock, IconShieldLock, IconUsersGroup } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import api from "@/api";
import { AxiosError, AxiosResponse } from "axios";
import { joinPublicChannel } from "@/Components/join_group/type";
import { Notifications } from "@mantine/notifications";
import chatSocket from "@/socket/chatSocket";

export default function PublicGroups({ HeaderHeight }: any) {
    const [publicGroups, setPublicGroups] = React.useState<any>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const item = publicGroups.find((item: any) => item.id === selectedId);
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        api.get("/user/public/channels")
            .then((res: AxiosResponse) => {
                setPublicGroups(res.data);
            })
            .catch((err: AxiosError<{ message: string }>) => {
                console.log(err.response?.data);
                Notifications.show({
                    title: "Error",
                    message: err.response?.data.message ?? "Something went wrong",
                    color: "red",
                    autoClose: 5000,
                });
            });
    }, []);

    function Icon(type: string) {
        switch (type) {
            case "private":
                return <IconLock size={30} />;
            case "protected":
                return <IconShieldLock size={30} />;
            default:
                return <IconUsersGroup size={30} />;
        }
    }

    function JoinGroup(id: number) {
        let body: joinPublicChannel = {
            channelID: id,
            password: password == "" ? null : password,
        };
        console.log(body);

        api.post("/user/join_channel", body)
            .then((res: AxiosResponse) => {
                console.log(res.data);
                Notifications.show({
                    title: "Success",
                    message: "You have joined the group",
                    color: "green",
                    autoClose: 5000,
                });
                setSelectedId(null);
                chatSocket.emit("reconnect");
            })
            .catch((err: AxiosError<{ message: string }>) => {
                Notifications.show({
                    title: "Error",
                    message: err.response?.data.message ?? "Something went wrong",
                    color: "red",
                    autoClose: 5000,
                });
            });
    }
    const theme = useMantineTheme();
    const titleRef = React.useRef<HTMLDivElement>(null);

    return (
        <>
            <Title
                ref={titleRef}
                order={3}
                color="gray.2"
                py={20}
                sx={(theme: MantineTheme) => ({
                    fontSize: theme.fontSizes.lg,
                    [theme.fn.smallerThan("sm")]: {
                        fontSize: theme.fontSizes.sm,
                    },
                })}
            >
                Public Groups
                <Divider mt={10} />
            </Title>

            <Grid
                gutter={"30px"}
                sx={{
                    height: `calc(100vh - ${HeaderHeight + titleRef.current?.clientHeight}px)`,
                    overflowY: "scroll",
                    /* ===== Scrollbar CSS ===== */
                    /* Firefox */
                    scrollbarColor: `${theme.colors.gray[8]} transparent`,
                    scrollbarWidth: "thin",
                    /* Chrome, Edge, and Safari */
                    "&::-webkit-scrollbar": {
                        width: "5px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: theme.colors.gray[8],
                        borderRadius: theme.radius.md,
                    },
                }}
            >
                {publicGroups.map((group: any) => (
                    <Grid.Col key={group.id} span={12} md={6} lg={4}>
                        <Group_card group={group} get_icon={Icon} onClick={() => setSelectedId(group.id)} />
                    </Grid.Col>
                ))}

                <AnimatePresence>
                    {selectedId && (
                        <motion.div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: 2,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            data-click-outside
                            onClick={(e: any) => {
                                if (e.target.dataset.clickOutside) {
                                    setSelectedId(null);
                                }
                            }}
                            initial={{
                                opacity: 0,
                                backgroundColor: "rgba(0, 0, 0, 0)",
                                backdropFilter: "blur(0px)",
                            }}
                            animate={{
                                opacity: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                backdropFilter: "blur(5px)",
                            }}
                            exit={{
                                opacity: 0,
                                backgroundColor: "rgba(0, 0, 0, 0)",
                                backdropFilter: "blur(0px)",
                            }}
                        >
                            <Box
                                sx={(theme: MantineTheme) => ({
                                    width: "40%",
                                    [theme.fn.smallerThan("sm")]: {
                                        width: "70%",
                                    },
                                    [theme.fn.smallerThan("xs")]: {
                                        width: "100%",
                                    },
                                })}
                            >
                                <motion.div
                                    layoutId={selectedId}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Card p={10} radius="lg" bg="gray.9" mx={10} pt={50} w={"100%"}>
                                        <Box px="md" pb="lg" bg="gray.9">
                                            <Flex h={50} align="center" justify="start">
                                                <Flex align="start" direction={"column"} p={10}>
                                                    <Title order={3} color="gray.2">
                                                        {item.name}
                                                    </Title>
                                                    <Space h={10} />
                                                    <Badge variant="light" color="blue" radius="xl">
                                                        {item.type}
                                                    </Badge>
                                                </Flex>

                                                <Avatar.Group
                                                    spacing="sm"
                                                    sx={{
                                                        flex: 1,
                                                        justifyContent: "flex-end",
                                                    }}
                                                >
                                                    {item.members.map((member: any, index: number) => {
                                                        if (index > 5) return;
                                                        return <Avatar key={member.id} src={api.getUri() + "user/avatar/" + member.id} radius="xl" />;
                                                    })}
                                                    <Avatar radius="xl">
                                                        {(() => {
                                                            const count = item.members.length - 5;
                                                            if (count > 0) return `+${count}`;
                                                            else return "+0";
                                                        })()}
                                                    </Avatar>
                                                </Avatar.Group>
                                            </Flex>
                                            <Space h={20} />
                                            <Text color="gray.4" weight={500} px={20}>
                                                {item.type.toLowerCase() == "public"
                                                    ? "Anyone can join this group, do you want to join?"
                                                    : item.type.toLowerCase() == "protected"
                                                    ? "Anyone can join this group, but only members can see the messages, do you want to join?"
                                                    : "Only members can join this group, do you want to join?"}
                                                <br />
                                                <br />
                                                After joining, you can leave the group at any time.
                                            </Text>
                                            <Box p={20}>
                                                {item.type.toLowerCase() == "protected" ? (
                                                    <>
                                                        <Space h={20} />
                                                        <PasswordInput
                                                            value={password}
                                                            onChange={(e) => setPassword(e.currentTarget.value)}
                                                            placeholder="Password"
                                                            required
                                                            radius="xl"
                                                            variant="filled"
                                                            size="sm"
                                                            error={false}
                                                            description="Enter the password to join the group"
                                                            icon={<IconLock />}
                                                        />
                                                    </>
                                                ) : null}
                                            </Box>
                                        </Box>
                                        <Group p={20} position="right">
                                            <Button variant="default" color="gray" size="sm" radius="lg" onClick={() => setSelectedId(null)}>
                                                Cancel
                                            </Button>
                                            <Button variant="filled" size="sm" radius="lg" onClick={() => JoinGroup(item.id)}>
                                                Join
                                            </Button>
                                        </Group>
                                    </Card>
                                </motion.div>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Grid>
        </>
    );
}

function Group_card({ group, get_icon, onClick }: { group: any; get_icon: any; onClick: any }) {
    const { id, name, members, type } = group;
    const Icon = get_icon(["public", "private", "protected"][Math.floor(Math.random() * 3)]);

    return (
        <motion.div layoutId={id} onClick={onClick}>
            <Card
                radius="lg"
                sx={() => ({
                    cursor: "pointer",
                    transition: "all 0.2s ease",

                    "&:hover": {
                        transform: "scale(1.03)",
                    },

                    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(/chatBackground.png) center center`,
                    backgroundSize: "cover",
                })}
            >
                <Box>
                    <Badge variant="light" color={type == "public" ? "blue" : "red"} radius="xl">
                        {type}
                    </Badge>
                    <Flex pt={10} align="center" justify="center">
                        <Title fz="xl" order={3} color="gray.2">
                            {name}
                        </Title>
                    </Flex>
                    <Flex h={50} align="center" justify="center">
                        <Avatar.Group spacing="sm">
                            {members.map((member: any, index: number) => {
                                if (index > 5) return;
                                return <Avatar key={member.id} src={api.getUri() + "user/avatar/" + member.id} radius="xl" />;
                            })}
                            <Avatar radius="xl">
                                {(() => {
                                    const count = members.length - 5;
                                    if (count > 0) return `+${count}`;
                                    else return "+0";
                                })()}
                            </Avatar>
                        </Avatar.Group>
                    </Flex>
                </Box>
            </Card>
        </motion.div>
    );
}
