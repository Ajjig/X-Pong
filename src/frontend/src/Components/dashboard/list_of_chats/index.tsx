import { Box, Navbar, Paper, SegmentedControl } from "@mantine/core";
import React from "react";
import { useState } from "react";
import { ListChats } from "./private_chats/ListChats";
import { ListGroups } from "./group_chats/ListGroups";

export default function List_of_chats({}: {}) {
    const [value, setValue] = useState("Messages");
    const SegRef = React.useRef<HTMLDivElement>(null);

    return (
        <Box w="100%" h="100%">
            <Paper radius="lg" p="md" bg="cos_black.2" h="100%">
                <SegmentedControl
                    ref={SegRef}
                    fullWidth
                    value={value}
                    onChange={setValue}
                    color="purple"
                    data={[
                        { value: "Messages", label: "Messages" },
                        { value: "Groups", label: "Groups" },
                    ]}
                ></SegmentedControl>

                {value === "Messages" ? <ListChats SegRef={SegRef} /> : <ListGroups />}
            </Paper>
        </Box>
    );
}
