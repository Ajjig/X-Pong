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
import { useRouter } from "next/router";
import SocketComponent from "@/socket/SocketComponent";

import { Prompt } from "next/font/google";

const font = Prompt({
    subsets: ["latin"],
    weight: "400",
});

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
    const [actions, setActions] = useState<SpotlightAction[]>([]);
    const router = useRouter();

    useEffect(() => {
        socket.on("search", (data) => {
            let users: [] = [];
            if (data && data[0])
                users = data[0].map((action: any) => ({
                    icon: <Avatar size="lg" src={action.avatarUrl} />,
                    title: action.name,
                    description: action.username,
                    onTrigger: () => {
                        console.log("/profile/" + action.id);
                        router.push("/profile/" + action.id);
                    },
                }));
            setActions(users);
        });
    }, []);

    useEffect(() => {
        if (query == "") setActions([]);
        else socket.emit("search", { query: query });
    }, [query]);

    return (
        <Provider store={store}>
            {/* <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}> */}
            <MantineProvider
                theme={{
                    colorScheme: "dark",
                    primaryColor: "orange",
                    // change background color
                    colors: {
                        "ocean-blue": ["#7AD1DD", "#5FCCDB", "#44CADC", "#2AC9DE", "#1AC2D9", "#11B7CD", "#09ADC3", "#0E99AC", "#128797", "#147885"],
                        "bright-pink": ["#F0BBDD", "#ED9BCF", "#EC7CC3", "#ED5DB8", "#F13EAF", "#F71FA7", "#FF00A1", "#E00890", "#C50E82", "#AD1374"],
                    },
                    // fontFamily: font.className,
                    // headings: {
                    //     fontFamily: font.className,
                    // },
                }}
                withGlobalStyles
                withNormalizeCSS
                inherit
            >
                <SocketComponent />
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
                    <main className={font.className}>
                        <Component {...pageProps} />
                    </main>
                    {/* </ColorSchemeProvider> */}
                </SpotlightProvider>
            </MantineProvider>
        </Provider>
    );
}
