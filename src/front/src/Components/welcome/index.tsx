import React, { useState } from "react";
import { Box, Flex, Text, Button, createStyles, Title, Input, Container } from "@mantine/core";
import { useFrame } from "@react-three/fiber";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import Login from "./login";
import Register from "./register";

const useStyles = createStyles((theme) => ({
    container: {
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        height: "100vh",
        width: "100vw",
        // background: "url('/images/background.jpg')",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
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

    title: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    text: {
        fontFamily: `valorax`,
        fontSize: 150,
        color: "white",

        /* mobile */
        "@media (max-width: 768px)": {
            fontSize: 50,
        },
    },

    span: {
        color: theme.colors.orange[7],
        fontFamily: `valorax`,
        fontSize: 90,

        /* mobile */
        "@media (max-width: 768px)": {
            fontSize: 30,
        },
    },

    play_now_button: {
        // marginTop: 10,
        padding: "0px 50px",
        border: "2px solid white",
        fontFamily: "GrandGalaxy",

        "@keyframes btn": {
            "0%": {
                boxShadow: "0px 0px 15px 0px " + theme.colors.orange[1],
            },
            "50%": {
                boxShadow: "0px 0px 15px 8px " + theme.colors.orange[1],
            },
            "100%": {
                boxShadow: "0px 0px 15px 0px " + theme.colors.orange[1],
            },
        },

        "&:hover": {
            animation: "btn 1s infinite",
        },

        /* mobile */
        "@media (max-width: 500px)": {
            // marginTop: -5,
            padding: "0px 20px",

            border: "2px solid white",
        },
    },
}));

export function Welcome({}: {}) {
    const [loginShow, setLoginShow] = useState(false);
    const [registerShow, setRegisterShow] = useState(false);

    return (
        <>
            {loginShow ? (
                registerShow ? (
                    <Register setRegisterShow={setRegisterShow} />
                ) : (
                    <Login setLoginShow={setLoginShow} setRegisterShow={setRegisterShow} />
                )
            ) : (
                <HeroSection setLoginShow={setLoginShow} />
            )}
        </>
    );
}

export default function HeroSection({ setLoginShow }: { setLoginShow: (value: boolean) => void }) {
    const { classes } = useStyles();
    const isMid = useMediaQuery("(max-width: 768px)");
    return (
        <Flex
            className={classes.animation_apperance}
            direction="column"
            align="center"
            justify="center"
            mih="90vh"
        >
            <Box className={classes.title}>
                <Title className={classes.text}>
                    70
                    <Text inherit component="span" className={classes.span}>
                        s
                    </Text>
                    Pong
                </Title>
            </Box>
            <Button
                className={classes.play_now_button}
                variant="outline"
                color="gray.0"
                uppercase
                radius={10}
                size={isMid ? "sm" : "lg"}
                onClick={() => {
                    setLoginShow(true);
                }}
            >
                Play Now
            </Button>
        </Flex>
    );
}

// const links = [
//     { label: "ABOUT", link: "/#about" },
//     { label: "TEAM", link: "/#Team" },
// ];

// function Menu() {
//     return (
//         <Box>
//             <Container size='xl' bg='red'>
//                 <Flex>
//                     {links.map((link) => (
//                         <Link href={link.link} style={{
//                             textDecoration: "none",
//                         }}>
//                             <Box mr={10}>
//                                 <Text color="white" >{link.label}</Text>
//                             </Box>
//                         </Link>
//                     ))}
//                 </Flex>
//             </Container>
//         </Box>
//     )
// }
