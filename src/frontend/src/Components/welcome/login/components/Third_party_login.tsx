import React from "react";
import { Box, Group } from "@mantine/core";
import { Network42Button } from "@/Components/SocialButtons";

interface auths {
    intra: Function;
}

export type { auths };

export function Third_party_login({ auths }: { auths: auths }) {
    return (
        <Group grow mt="md">
            <Box
                onClick={() => {
                    auths.intra();
                }}
            >
                <Network42Button fullWidth radius={10}>
                    intra
                </Network42Button>
            </Box>
        </Group>
    );
}
