import { Container, Paper, Text, createStyles } from "@mantine/core";

import Back_Button from "./components/Back_Button";
import { Third_party_login } from "./components/Third_party_login";
import type { auths } from "./components/Third_party_login";
import { useRouter } from "next/router";
import api from "@/api";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
        width: "100vw",
        // add animation of the login form
        animation: "appear 0.2s ease-in-out",
    },
    "@keyframes appear": {
        "0%": {
            opacity: 0,
        },
        "100%": {
            opacity: 1,
        },
    },
    form: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
    },
}));

interface Props {
    setLoginShow: (value: boolean) => void;
}

export default function Login({ setLoginShow }: Props) {
    const { classes } = useStyles();

    const intraAuth = () => {
        console.log("42 BTN CLICKED!");
        // implement the 42 login here open small window with 42 login and auth the user
        // poisition the window in the middle of the screen
        window.location.href = api.getUri() + "auth/42";
        
    };

    const auths: auths = {
        intra: intraAuth,
    }

    return (
        <Container className={classes.container}>
            <Container size="400px" className={classes.form}>
                <Back_Button func={setLoginShow} />
                <Paper w="100%" p="xl" radius="md" withBorder>
                    <Text size="lg" weight={500}>
                        Start using
                    </Text>
                    <Third_party_login auths={auths} />
                </Paper>
            </Container>
        </Container>
    );
}
