import { use, useEffect, useState } from "react";
import { Avatar, Button, Group } from "@mantine/core";
import { SpotlightProvider, spotlight, SpotlightAction } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import socket from "@/socket";

function SpotlightControl() {
    return (
        <Group position="center">
            <Button onClick={spotlight.open}>Open spotlight</Button>
        </Group>
    );
}

export default function Search() {
    const [query, setQuery] = useState("");
    const [actions, setActions] = useState<SpotlightAction[]>([]); // [
    // const actions: SpotlightAction[] =
    //     query !== "%%secret%%"
    //         ? [
    //               {
    //                   title: "Reveal secret actions",
    //                   description: "Click this action to reveal secret actions",
    //                   onTrigger: () => setQuery("%%secret%%"),
    //                   closeOnTrigger: false,
    //               },
    //           ]
    //         : [
    //               { title: "Super secret action", keywords: "%%secret%%", onTrigger: () => {} },
    //               {
    //                   title: "Rick roll",
    //                   description: "Do not click",
    //                   keywords: "%%secret%%",
    //                   onTrigger: () => {
    //                       window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    //                   },
    //               },
    //           ];

    useEffect(() => {
        socket.on("search", (data) => {
            console.log(data);

            const users = data[0].map((action: any) => ({
                icon: <Avatar size="lg" src={action.avatarUrl} />,
                title: action.name,
                description: action.username,
                onTrigger: () => {
                    window.location.href = "/profile/" + action.id;
                },
            }));

            if (users && users.length > 0) setActions(users);
        });
    }, []);

    useEffect(() => {
        socket.emit("search", { query: query });
    }, [query]);

    return (
        <SpotlightProvider
            actions={actions}
            query={query}
            onQueryChange={setQuery}
            searchIcon={<IconSearch size="1.2rem" />}
            searchPlaceholder="Search..."
            shortcut="mod + s"
            nothingFoundMessage="Nothing found..."
            closeOnEscape
            closeOnClickOutside
        >
            <SpotlightControl />
        </SpotlightProvider>
    );
}
