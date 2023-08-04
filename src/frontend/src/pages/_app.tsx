import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider, MantineTheme, ColorSchemeProvider, ColorScheme, Avatar, CSSObject } from "@mantine/core";
import { Provider } from "react-redux";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import store, { setProfile } from "@/store/store";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { useEffect, useState } from "react";
import { IconLock, IconSearch, IconShieldLock } from "@tabler/icons-react";
import { useRouter } from "next/router";
import SocketComponent from "@/socket/SocketComponent";
import { SpotlightStyles } from "@/Components/spotlight/spotlight.styles";

// import font for title from 'next/font/google'
import { Russo_One, Kanit } from "next/font/google";
import api from "@/api";
import chatSocket from "@/socket/chatSocket";
import { Group } from "@/Components/dashboard/list_of_chats/group_chats/group";
import { IconUsersGroup } from "@tabler/icons-react";

const fontHeadings = Russo_One({ weight: "400", subsets: ["latin"] });
const font = Kanit({ weight: "400", subsets: ["latin"] });

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

    const iconGroup = (chat: {type: "public" | "private" | "protected"}) => {
        if (chat.type == "private") {
            return <IconLock size={30} />;
        } else if (chat.type == "protected") {
            return <IconShieldLock size={30} />;
        }
        return <IconUsersGroup size={30} />;
    };

    useEffect(() => {
        chatSocket.on("search", (data) => {
            let users: [] = [];
            // console.log(data);
            if (data)
                users = data.map((action: any) => {

                    console.table(action);

                    if (action?.type == "public" || action?.type == "private" || action?.type == "protected") {
                        return {
                            // add costum component
                            icon: iconGroup(action),
                            group: "Groups",
                            title: action.name,
                            description: action.type,
                            onTrigger: () => {
                                router.push("/chat/" + action.id);
                            }
                        };
                    }
                    // console.log(action);
                    return {
                        group: "Users",
                        icon: <Avatar size="lg" src={action.avatarUrl} radius={20} />,
                        title: action.name,
                        description: action.username,
                        onTrigger: () => {
                            router.push("/profile/" + action.id);
                        },
                    };
                });
            setActions(users);
        });
    }, []);

    useEffect(() => {
        if (query == "") setActions([]);
        else chatSocket.emit("search", { query: query });
    }, [query]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
                    store.dispatch(setProfile(res.data));
                    setLoading(false);
                } else {
                    // window.location.href = "/";
                }
            })
            .catch((err: any) => {
                // redirect to login
                // window.location.href = "/";
            });
    }, []);

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
                        cos_black: ["#292932", "#242428", "#15151A", "#121214"],
                    },
                    fontFamily: font.style.fontFamily,
                    // add font to theme
                    fontFamilyMonospace: font.style.fontFamily,
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
                                root: {},
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
                    transitionProps={{ duration: 300, transition: 'slide-down' }}
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
