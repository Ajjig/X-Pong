import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider, MantineTheme, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { Provider } from "react-redux";

import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import store from "@/Components/socket";

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

    return (
        <Provider store={store}>
            {/* <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}> */}
            <MantineProvider
                theme={{
                    colorScheme: "dark",
                }}
                withGlobalStyles
                withNormalizeCSS
                inherit
            >
                <Component {...pageProps} />
            </MantineProvider>
            {/* </ColorSchemeProvider> */}
        </Provider>
    );
}
