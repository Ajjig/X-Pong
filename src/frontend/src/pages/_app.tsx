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
import { Notifications } from "@mantine/notifications";
import Rematch from "@/Components/rematch";
import { AxiosError } from "axios";

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
                    store.dispatch(setProfile(res.data));
                }
            })
            .catch((err: AxiosError<{ message: string }>) => {});
    }, []);

    return (
        <Provider store={store}>
            <MantineProvider theme={default_theme} withGlobalStyles withNormalizeCSS inherit>
                <Notifications position="top-right" />
                <Spotlight />
                <SocketComponent />
                <InviteToGame />
                <Rematch />

                <main>
                    <Component {...pageProps} />
                </main>
            </MantineProvider>
        </Provider>
    );
}
