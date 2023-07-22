import { Box, Navbar, Paper, SegmentedControl } from "@mantine/core";
import React from "react";
import { useState } from "react";
import { ListChats } from "./private_chats/ListChats";
import { ListGroups } from "./group_chats/ListGroups";

export default function List_of_chats({}: {}) {
    const [value, setValue] = useState("Messages");

    return (
        <Box w={"100%"} h="100%">
            <Paper radius="lg" p="md" bg="dark.5">
                <SegmentedControl
                    radius={"lg"}
                    fullWidth
                    value={value}
                    onChange={setValue}
                    color="orange"
                    data={[
                        { value: "Messages", label: "Messages" },
                        { value: "Groups", label: "Groups" },
                    ]}
                ></SegmentedControl>

                {value === "Messages" ? <ListChats /> : <ListGroups />}
            </Paper>
        </Box>
    );
}
