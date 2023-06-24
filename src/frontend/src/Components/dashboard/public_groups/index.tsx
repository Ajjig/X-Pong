import { Box, Grid, Title, Text, Button, MantineTheme, Flex, Card, Image, Paper, Group, Badge } from "@mantine/core";
import { IconLock, IconShieldLock, IconUsersGroup } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function PublicGroups() {
    const [publicGroups, setPublicGroups] = React.useState<any>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const getLatestPublicGroups = () => {
        setPublicGroups([
            {
                id: 1,
                name: "THE GREATEST",
                description:
                    "In literary theory, a text is any object that can be, whether this object is a work of literature, a street sign, an arrangement of buildings on a city block, or styles of clothing. It is a coherent set of signs that transmits some kind of informative message.",
                members: 10,
                image: "https://picsum.photos/2000",
            },
            {
                id: 2,
                name: "1337",
                description: `In literary theory, a text is any object that can be "read", whether this object is a work of literature, a street sign, an arrangement of buildings on a city block, or styles of clothing. It is a coherent set of signs that transmits some kind of informative message.`,
                members: 50,
                image: "https://picsum.photos/2001",
            },
            {
                id: 3,
                name: "TRS-THEAM",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2063",
            },
            {
                id: 4144,
                name: "THE GREATEST",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2094",
            },
            {
                id: 4564,
                name: "THE GREATEST",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2034",
            },
            {
                id: 4556,
                name: "THE GREATEST",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2994",
            },
            {
                id: 4963,
                name: "THE GREATEST",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2104",
            },
            {
                id: 488,
                name: "THE GREATEST",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2904",
            },
            {
                id: 99,
                name: "THE GREATEST",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2904",
            },
            {
                id: 43,
                name: "THE GREATEST",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2084",
            },
            {
                id: 47,
                name: "THE GREATEST",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2004",
            },
            {
                id: 45,
                name: "THE GREATEST",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                members: 10,
                image: "https://picsum.photos/2004",
            },
        ]);
    };
    const item = publicGroups.find((item: any) => item.id === selectedId);

    useEffect(() => {
        getLatestPublicGroups();
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

    return (
        <Grid gutter={"30px"}>
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
                            zIndex: 999,
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
                        <motion.div layoutId={selectedId}>
                            <Card p={0} radius="lg" bg="gray.9" maw="500px" mx={10}>
                                <Card.Section>
                                    <Image src={item.image} alt="item image" height={90} />
                                </Card.Section>
                                <Box
                                    sx={{
                                        transform: "translateY(-40%)",
                                    }}
                                    px={"lg"}
                                >
                                    <Flex w={50} h={50} align="center" justify="center">
                                        <Paper
                                            radius="xl"
                                            p={10}
                                            bg="gray.9"
                                            w={50}
                                            h={50}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            withBorder
                                        >
                                            {Icon(["public", "private", "protected"][Math.floor(Math.random() * 3)])}
                                        </Paper>
                                    </Flex>
                                </Box>
                                <Box
                                    px="md"
                                    pb="lg"
                                    bg="gray.9"
                                    sx={(theme: MantineTheme) => ({
                                        marginTop: "-10px",
                                    })}
                                >
                                    <Title order={3} color="gray.2">
                                        {item.name}
                                    </Title>
                                    <Text my="xs" lineClamp={20} color="dummy" fz={"sm"}>
                                        {item.description}
                                    </Text>
                                    <Badge variant="light" color="orange" radius="xl">
                                        {item.members} members
                                    </Badge>
                                </Box>
                                <Group p={20} position="right">
                                    <Button
                                        variant="outline"
                                        color="gray"
                                        size="sm"
                                        radius="lg"
                                        onClick={() => setSelectedId(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="filled" color="orange" size="sm" radius="lg">
                                        Join
                                    </Button>
                                </Group>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Grid>
    );
}

function Group_card({ group, get_icon, onClick }: { group: any; get_icon: any; onClick: any }) {
    const { id, name, description, members, image } = group;
    const Icon = get_icon(["public", "private", "protected"][Math.floor(Math.random() * 3)]);

    return (
        <motion.div layoutId={id} onClick={onClick}>
            <Card
                radius="lg"
                bg="gray.9"
                sx={(theme: MantineTheme) => ({
                    cursor: "pointer",
                    transition: "all 0.2s ease",

                    "&:hover": {
                        // boxShadow: `0 8px 0px 0 ${theme.colors.orange[8]}, 0 -8px 0px 0 ${theme.colors.orange[8]}`,
                        transform: "scale(1.03)",
                    },
                })}
            >
                <Box bg="gray.9">
                    <Flex h={50} align="center" justify="center">
                        <Title fz="xl" order={3} color="gray.2">
                            {name}
                        </Title>
                    </Flex>
                    <Group position="center">
                        <Badge variant="light" color="orange" radius="xl">
                            {members} members
                        </Badge>
                        <Badge variant="light" color="orange" radius="xl">
                            Public
                        </Badge>
                    </Group>
                </Box>
            </Card>
        </motion.div>
    );
}
