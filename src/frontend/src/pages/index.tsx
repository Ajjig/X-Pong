import { Suspense } from "react";
import { Box, createStyles } from "@mantine/core";
import { useRive } from "@rive-app/react-canvas";

// components
import { Head } from "@/Components/head";
import { Scene } from "@/Components/scene";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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

    container_scene: {
        // position: "absolute",
        // top: 0,
        // left: 0,
        // width: "100%",
        // height: "100%",
        // zIndex: 1,
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

    // useEffect(() => {
    //     api("/user/profile")
    //         .then((res) => {
    //             console.log(res);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }, []);

    return (
        <Suspense fallback={<Loading />}>
            <Box className={cx(classes.container, classes.animation_apperance)}>
                <Head title="70sPong" description="70sPong" keywords="70sPong" icon="/favicon.svg" />
                {/* <Box className={classes.container_scene}> */}
                    {/* <Canvas shadows> */}
                        {/* <Scene /> */}
                        {/* <Html center as="div" position={[0, 1, 0]}> */}
                            <Welcome />
                        {/* </Html> */}
                    {/* </Canvas> */}
                {/* </Box> */}
            </Box>
        </Suspense>
    );
}
