import chatSocket from "@/socket/chatSocket";
import { Avatar } from "@mantine/core";
import { IconLock, IconSearch, IconShieldLock, IconUsersGroup } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { SpotlightStyles } from "./spotlight.styles";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import JoinGroup from "../join_group";
import { SearchQuery } from "./type";
import api from "@/api";

export default function Spotlight() {
    const [actions, setActions] = useState<SpotlightAction[]>([]);
    const [query, setQuery] = useState<string>("");
    const useSpotlightStyles = SpotlightStyles();
    const router = useRouter();
    const [showJoinGroup, setShowJoinGroup] = useState<boolean>(false);
    const [selectedGroup, setSelectedGroup] = useState<any>({});

    const iconGroup = (chat: { type: "public" | "private" | "protected" }) => {
        if (chat.type == "private") {
            return <IconLock size={30} />;
        } else if (chat.type == "protected") {
            return <IconShieldLock size={30} />;
        }
        return <IconUsersGroup size={30} />;
    };

    useEffect(() => {
        chatSocket.on("search", (data) => {
            let result: [] = [];
            if (data)
                result = data.map((action: any) => {
                    if (action?.type == "public" || action?.type == "private" || action?.type == "protected") {
                        return {
                            group: "Groups",
                            icon: iconGroup(action),
                            title: action.name,
                            description: action.type,
                            onTrigger: () => {
                                setShowJoinGroup(true);
                                setSelectedGroup(action);
                            },
                        };
                    }
                    return {
                        group: "Users",
                        icon: <>{action?.id && <Avatar size="lg" src={api.getUri() + "user/avatar/" + action.id} radius={20} />}</>,
                        title: action.name,
                        description: action.username,
                        onTrigger: () => {
                            router.push("/profile/" + action.id);
                        },
                    };
                });
            setActions(result);
        });
    }, []);

    useEffect(() => {
        if (query == "") setActions([]);
        else {
            let body: SearchQuery = { query: query };
            chatSocket.emit("search", body);
        }
    }, [query]);
    return (
        <>
            <SpotlightProvider
                transitionProps={{ duration: 300, transition: "slide-down", timingFunction: "ease" }}
                actions={actions}
                query={query}
                onQueryChange={setQuery}
                searchIcon={<IconSearch size="1.2rem" />}
                searchPlaceholder="Search..."
                shortcut="shift+space"
                nothingFoundMessage="Nothing found..."
                closeOnEscape
                closeOnClickOutside
                radius={20}
                classNames={useSpotlightStyles.classes}
            />
            <JoinGroup show={showJoinGroup} data={selectedGroup} setShowJoinGroup={setShowJoinGroup} />
        </>
    );
}
