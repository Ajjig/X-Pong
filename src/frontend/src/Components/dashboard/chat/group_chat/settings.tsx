import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Box, LoadingOverlay } from "@mantine/core";
import { useState } from "react";

export function SettingGroupChat({children}: {children: React.ReactNode}) {
    const [opened, { open, close }] = useDisclosure();
    const [Loading, setLoading] = useState<boolean>(false);

    return (
        <>
            <Modal
                overlayProps={{
                    opacity: 0.55,
                    blur: 8,
                }}
                opened={opened}
                onClose={close}
                centered
                radius={30}
                withCloseButton={Loading as boolean | undefined}
            >
                <LoadingOverlay visible={Loading} overlayBlur={3} />
                <Box maw={300} mx="auto" pb={50} pos={"relative"}>
                    hello
                </Box>
            </Modal>
            <Box onClick={() => open()}>{children}</Box>
        </>
    );
}
