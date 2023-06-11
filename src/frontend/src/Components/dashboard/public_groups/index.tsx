import {
    Box,
    Grid,
    Title,
    Text,
    Button,
    MantineTheme,
    Flex,
    Space,
    Card,
    Image,
    Paper,
    Group,
} from "@mantine/core";
import { IconAdjustmentsQuestion, IconLock, IconShieldLock, IconUsersGroup } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

export default function PublicGroups() {
    const [publicGroups, setPublicGroups] = React.useState<any>([]);

    const getLatestPublicGroups = () => {
        setPublicGroups([
            {
                id: 1,
                name: "THE GREATEST",
                description: "In literary theory, a text is any object that can be, whether this object is a work of literature, a street sign, an arrangement of buildings on a city block, or styles of clothing. It is a coherent set of signs that transmits some kind of informative message.",
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
                image: "https://picsum.photos/2003",
            },
        ]);
    };

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

    // const items = [
    //     { id: "1", title: "Item 1", subtitle: "Subtitle 1" },
    //     { id: "2", title: "Item 2", subtitle: "Subtitle 2" },
    //     { id: "3", title: "Item 3", subtitle: "Subtitle 3" },
    // ];
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const item = publicGroups.find((item: any) => item.id === selectedId);

    // return (
    //     <>
    //         {items.map((item) => (
    //             <motion.div layoutId={item.id} onClick={() => setSelectedId(item.id)} style={{
    //                 cursor: "pointer",
    //                 transition: "all 0.2s ease",
    //                 backgroundColor: "red",
    //             }}>
    //                 <motion.h5>{item.subtitle}</motion.h5>
    //                 <motion.h2>{item.title}</motion.h2>
    //             </motion.div>
    //         ))}

    //         <AnimatePresence>
    //             {selectedId && (
    //                 <motion.div layoutId={selectedId}>
    //                     <motion.h5>{item.subtitle}</motion.h5>
    //                     <motion.h2>{item.title}</motion.h2>
    //                     <motion.button onClick={() => setSelectedId(null)} />
    //                 </motion.div>
    //             )}
    //         </AnimatePresence>
    //     </>
    // );

    return (
        <Grid gutter={"30px"}>
            {publicGroups.map((group: any) => (
                <Grid.Col key={group.id} span={12} md={6} lg={4}>
                    <Group_card group={group} get_icon={Icon} onClick={() => setSelectedId(group.id)} />
                </Grid.Col>
            ))}

            <AnimatePresence>
                {selectedId && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 999,
                            width: "100%",
                            height: "100%",
                            //animtion enter
                            animation: "fadeIn 0.3s ease-in-out forwards",

                            "@keyframes fadeIn": {
                                "0%": {
                                    backgroundColor: "rgba(0, 0, 0, 0)",
                                    opacity: 0,
                                },
                                "100%": {
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    opacity: 1,
                                },
                            },
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
                    >
                        <motion.div layoutId={selectedId} >
                            <Card p={0} radius="lg" bg="gray.9" maw='500px'>
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
                                            {Icon(
                                                ["public", "private", "protected"][
                                                    Math.floor(Math.random() * 3)
                                                ]
                                            )}
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
                                    <Text color="dummy" fz={"sm"}>
                                        {item.members} members
                                    </Text>
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
                    </Box>
                )}
            </AnimatePresence>
        </Grid>
    );
}

function Group_card({ group, get_icon, onClick }: { group: any; get_icon: any; onClick: any }) {
    return (
        <motion.div layoutId={group.id} onClick={onClick}>
            <Card
                p={0}
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
                <Card.Section>
                    <Image src={group.image} alt="Group image" height={200} />
                </Card.Section>
                <Box
                    sx={{
                        transform: "translateY(-40%)",
                    }}
                    px={"lg"}
                >
                    <Flex w={50} h={50} align="center" justify="center">
                        <Paper radius="xl" p={10} bg="gray.9">
                            {get_icon(["public", "private", "protected"][Math.floor(Math.random() * 3)])}
                        </Paper>
                    </Flex>
                </Box>
                <Box
                    px="md"
                    pb="lg"
                    bg="gray.9"
                    sx={(theme: MantineTheme) => ({
                        marginTop: "-20px",
                    })}
                >
                    <Title order={3} color="gray.2">
                        {group.name}
                    </Title>
                    <Text my="xs" lineClamp={2} color="dummy" fz={"sm"}>
                        {group.description}
                    </Text>
                    <Text color="dummy" fz={"sm"}>
                        {group.members} members
                    </Text>
                </Box>
            </Card>
        </motion.div>
    );
}
