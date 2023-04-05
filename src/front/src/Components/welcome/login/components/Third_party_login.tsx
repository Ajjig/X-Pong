import React from "react";
import { Box, Group } from "@mantine/core";
import { GoogleButton, Network42Button } from "@/Components/SocialButtons";

interface auths {
    google: Function;
    intra: Function;
}

export type { auths };

export function Third_party_login({ auths }: { auths: auths }) {
    return (
        <Group grow mt="md">
            <Box
                onClick={() => {
                    auths.google();
                }}
            >
                <GoogleButton fullWidth radius={10}>
                    Google
                </GoogleButton>
            </Box>
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
