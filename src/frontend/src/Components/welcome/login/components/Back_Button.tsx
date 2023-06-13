import React from "react";
import { Box, Button } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";

export default function Back_Button({func}: { func: (value: boolean) => void }) {
    return (
        <Box>
            <Button
                my="md"
                variant="none"
                sx={{
                    color: "white",
                }}
                leftIcon={<IconArrowBackUp />}
                onClick={() => func(false)}
            >
                Back
            </Button>
        </Box>
    );
}
