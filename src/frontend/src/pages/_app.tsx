import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider, MantineTheme, ColorSchemeProvider, ColorScheme, Avatar, CSSObject } from "@mantine/core";
import { Provider } from "react-redux";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import store from "@/store/store";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { useEffect, useState } from "react";
import socket from "@/socket";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";
import SocketComponent from "@/socket/SocketComponent";
import { SpotlightStyles } from "@/Components/spotlight/spotlight.styles";

// import font for title from 'next/font/google'
import { Russo_One, Kanit } from 'next/font/google';

const fontHeadings = Russo_One({ weight: "400", subsets: ["latin"] })
const font = Kanit({ weight: "400", subsets: ["latin"] })

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
    const useSpotlightStyles = SpotlightStyles();

    useEffect(() => {
        socket.on("search", (data) => {
            let users: [] = [];
            if (data && data[0])
                users = data[0].map((action: any) => ({
                    icon: <Avatar size="lg" src={action.avatarUrl} radius={20} />,
                    title: action.name,
                    description: action.username,
                    onTrigger: () => {
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
                    primaryColor: "purple",
                    // change background color
                    colors: {
                        purple: ["#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA"],
                        cos_black: ["#292932", "#242428", "#15151A", "#121214"]
                    },
                    fontFamily: font.style.fontFamily,
                    headings: {
                        fontFamily: fontHeadings.style.fontFamily,
                    },
                    components: {
                        SegmentedControl: {
                            styles: {   
                                root: {
                                    borderRadius: 40,
                                    background: "#000000",
                                },
                                indicator: {
                                    borderRadius: 40,
                                },
                            },
                        },
                        Input: {
                            styles: {
                                input: {
                                    borderRadius: 40,
                                },
                            },
                        },
                        Button: {
                            styles: {
                                root: {
                                    borderRadius: 40,
                                },
                            },
                        },
                        Paper: {
                            styles: {
                                root: {
                                    
                                },
                            },
                        },
                        Popover: {
                            styles: {
                                body: {
                                    borderRadius: 40,
                                },
                            },
                        },
                        Select: {
                            styles: {
                                root: {
                                    borderRadius: 40,
                                },
                            },
                        },
                    },
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
                    radius={20}
                    classNames={useSpotlightStyles.classes}
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
