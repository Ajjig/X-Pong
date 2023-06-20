import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider, MantineTheme, ColorSchemeProvider, ColorScheme, Avatar } from "@mantine/core";
import { Provider } from "react-redux";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import store from "@/store/store";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { useEffect, useState } from "react";
import socket from "@/socket";
import { IconSearch } from "@tabler/icons-react";

export default function App({ Component, pageProps }: AppProps) {
    // const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    //     key: "mantine-color-scheme",
    //     defaultValue: "light",
    //     getInitialValueInEffect: true,
    // });

    // const toggleColorScheme = (value?: ColorScheme) => {
    //     setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    // };

    // useHotkeys([["mod+J", () => toggleColorScheme()]]);
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
            let users: [] = [];
            if (data && data[0])
                users = data[0].map((action: any) => ({
                    icon: <Avatar size="lg" src={action.avatarUrl} />,
                    title: action.name,
                    description: action.username,
                    onTrigger: () => {
                        window.location.href = "/profile/" + action.id;
                    },
                }));
            setActions(users);
        });
    }, []);

    useEffect(() => {
        socket.emit("search", { query: query });
    }, [query]);
    return (
        <Provider store={store}>
            {/* <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}> */}
            <MantineProvider
                theme={{
                    colorScheme: "dark",
                    primaryColor: "gray",
                }}
                withGlobalStyles
                withNormalizeCSS
                inherit
            >
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
                    <Component {...pageProps} />
                    {/* </ColorSchemeProvider> */}
                </SpotlightProvider>
            </MantineProvider>
        </Provider>
    );
}
