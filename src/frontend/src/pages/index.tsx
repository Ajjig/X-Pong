import { Suspense } from "react";
import { Box, createStyles } from "@mantine/core";

// components
import { Head } from "@/Components/head";
import { Welcome } from "@/Components/welcome";
import { Loading } from "@/Components/loading/loading";

const useStyles = createStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
    },

    dom_content: {
        position: "relative",
        zIndex: -1,
        width: "100%",
        height: "100%",
    },

    animation_apperance: {
        animation: "appear 0.5s ease-in-out",
        animationFillMode: "forwards",

        "@keyframes appear": {
            "0%": {
                opacity: 0,
            },
            "100%": {
                opacity: 1,
            },
        },
    },
}));

export default function Home() {
    const { classes, cx } = useStyles();

    return (
        <Suspense fallback={<Loading />}>
            <Box className={cx(classes.container, classes.animation_apperance)}>
                <Head title="Xpong" description="Xpong" keywords="Xpong" icon="/favicon.ico" />
                <Welcome />
            </Box>
        </Suspense>
    );
}
