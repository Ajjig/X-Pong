import { Box, Navbar, SegmentedControl } from "@mantine/core";
import React, { ReactElement, useEffect } from "react";
import { useState } from "react";
import { ListChats } from "./components/ListChats";

export default function Chats({ setChat }: { setChat: (chat: ReactElement) => void }) {
    const [value, setValue] = useState("Messages");

    useEffect(() => {
        console.log(value);
    }, [value]);

    return (
        <Box w={"100%"} h="100%" p="md">
            <Navbar.Section>
                <SegmentedControl
                    fullWidth
                    value={value}
                    onChange={setValue}
                    data={[
                        { value: "Messages", label: "Messages" },
                        { value: "Groups", label: "Groups" },
                    ]}
                ></SegmentedControl>

                {value === "Messages" ? <ListChats /> : <ListGroups />}
            </Navbar.Section>
        </Box>
    );
}

function ListGroups() {
    return (
        <Box w={"100%"} h="100%" p="md">
            <Navbar.Section>Groups</Navbar.Section>
        </Box>
    );
}
