import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Box, LoadingOverlay, Menu, rem } from "@mantine/core";

import { useEffect, useState } from "react";
import { IconUser } from "@tabler/icons-react";

export function Personalinformation({opened, open, close}: {opened: boolean, open: any, close: any}) {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
    }, []);


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
                withCloseButton={!loading}
            >
                <LoadingOverlay visible={loading} overlayBlur={3} />
                <Box maw={300} mx="auto" pb={50} pos={"relative"}>
                    
                    

                </Box>
            </Modal>
        </>
    );
}
