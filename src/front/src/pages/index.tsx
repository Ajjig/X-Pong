import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import styles from "@/styles/Home.module.css";
import { Inter } from "@next/font/google";
import { Box, Button, createStyles, Title, Text, Flex } from "@mantine/core";
import { useRive } from "@rive-app/react-canvas";
import { Head } from "@/Components/head";

// const inter = Inter({ subsets: ["latin"] });

// const nav_bar_links = [
//     {
//         link: "/",
//         label: "Home",
//     },
//     {
//         link: "/about",
//         label: "About",
//     },
//     {
//         link: "/team",
//         label: "Team",
//     },
// ];

const useStyles = createStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        // background: "url('/images/background.jpg')",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
    },

    container_scene: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        // background: ''
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

import { Scene } from "@/Components/scene";
import { Canvas } from "@react-three/fiber";

function LoadingIcon() {
    const { classes, cx } = useStyles();
    const { RiveComponent } = useRive({
        src: "/loading.riv",
        autoplay: true,
    });

    return (
        <Box className={classes.container}>
            <Box w="150px" h="150px">
                <RiveComponent />
            </Box>
        </Box>
    );
}
import { Html } from "@react-three/drei";
import { Welcome } from "@/Components/welcome";

export default function Home() {
    const { classes, cx } = useStyles();

    return (
        <Suspense fallback={<LoadingIcon />}>
            <Box className={cx(classes.container, classes.animation_apperance)}>
                <Head title="70sPong" description="70sPong" keywords="70sPong" icon="/favicon.svg" />
                <Box className={classes.container_scene}>
                    <Canvas shadows>
                        <Scene />
                        <Html center as="div" position={[0, 1, 0]}>
                            <Welcome />
                        </Html>
                    </Canvas>
                </Box>
            </Box>
        </Suspense>
    );
}
