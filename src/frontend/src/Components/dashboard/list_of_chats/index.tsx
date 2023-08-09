import { Box, Paper, SegmentedControl } from "@mantine/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { ListChats } from "./private_chats/ListChats";
import { ListGroups } from "./group_chats/ListGroups";
import chatSocket from "@/socket/chatSocket";

export default function List_of_chats({}: {}) {
    const [value, setValue] = useState("Messages");
    const SegRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chatSocket.connected) chatSocket.connect();
        chatSocket.emit("reconnect");
    }, [value]);

    return (
        <Paper
            radius="lg"
            p="md"
            pos="relative"
            h="100%"
            bg={"cos_black.2"}
            sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
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
            />

            {value === "Messages" ? <ListChats SegRef={SegRef} /> : <ListGroups SegRef={SegRef} />}
        </Paper>
    );
}
