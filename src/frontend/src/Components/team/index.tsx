import React from "react";
import { Container, Title, Grid, Box, Text, Card, Image, Space } from "@mantine/core";

export default function Team() {
    return (
        <Container size="lg">
            <Title order={2} fz="34px" color="gray.0" sx={{textTransform: 'uppercase'}}>
                Team that made this project possible
            </Title>
            <Space h="40px" />
            <Grid gutter={40}>
                <TeamMember
                    name="Rachid Oudouch"
                    role="Front-end"
                    img="https://cdn.intra.42.fr/users/15beaf14c3ddf394270275669e105d65/roudouch.jpg"
                />
                <TeamMember
                    name="Ilyasse Idkhebbach"
                    role="Back-end"
                    img="https://cdn.intra.42.fr/users/1dba852f7f6d3b906887c37351e6987c/iidkhebb.jpg"
                />
                <TeamMember
                    name="M'hamed Ajjig"
                    role="Back-end"
                    img="https://cdn.intra.42.fr/users/7eaee3ba839e1ab64ad106b91abf56dd/majjig.jpg"
                />
            </Grid>
        </Container>
    );
}

interface TeamMemberProps {
    name: string;
    role: string;
    img: string;
}

function TeamMember({ name, role, img }: TeamMemberProps) {
    return (
        <Grid.Col span={4}>
            <Card
                shadow="sm"
                radius="md"
                padding="xl"
                bg="transparent"
                sx={{
                    transition: "all 0.2s ease-in-out",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(5px)",
                    "-webkit-backdrop-filter": "blur(5px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyItems: "center",
                    }}
                >
                    <Card.Section pt={20}>
                        <Image
                            src={img}
                            width="150px"
                            height="150px"
                            radius={50}
                            sx={{ objectFit: "cover" }}
                        />
                    </Card.Section>
                    <Card.Section p={20}>
                        <Title order={4} fz="17px" color="gray.0">
                            {name}
                        </Title>
                        <Text size="sm" color="gray.4">
                            {role}
                        </Text>
                    </Card.Section>
                </Box>
            </Card>
        </Grid.Col>
    );
}
