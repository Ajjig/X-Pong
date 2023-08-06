import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import store, { setProfile } from "@/store/store";
import { useEffect, useState } from "react";
import SocketComponent from "@/socket/SocketComponent";
import { Loading } from "@/Components/loading/loading";
import { default_theme } from "@/theme/default";
import Spotlight from "@/Components/spotlight";
import api from "@/api";
import { InviteToGame } from "@/Components/invite_game";

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

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
                    store.dispatch(setProfile(res.data));
                } else {
                    // window.location.href = "/";
                }
            })
            .catch((err: any) => {
                // redirect to login
                console.log(err);
            });
    }, []);

    return (
        <Provider store={store}>
            {/* <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}> */}
            <MantineProvider theme={default_theme} withGlobalStyles withNormalizeCSS inherit>
                <Spotlight />
                <SocketComponent />
                <InviteToGame />

                <main>
                    <Component {...pageProps} />
                </main>
                {/* </ColorSchemeProvider> */}
            </MantineProvider>
        </Provider>
    );
}
