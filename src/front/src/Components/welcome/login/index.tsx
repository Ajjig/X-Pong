import { Container, Paper, Text, Button, Divider, Flex, createStyles } from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";

import Back_Button from "./components/Back_Button";
import Email_Auth_Method from "./components/Email_Auth_Method";
import Forgot_Password_Link from "./components/Forgot_Password_Link";
import Register_Link from "./components/Register_Link";
import { Third_party_login } from "./components/Third_party_login";
import type { auths } from "./components/Third_party_login";

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
    setRegisterShow: (value: boolean) => void;
}

export default function Login({ setLoginShow, setRegisterShow }: Props) {
    const { classes } = useStyles();

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },

        validate: {
            email: isEmail("Email is not valid"),
            password: (value) => {
                if (value.length < 8) {
                    return "Password must be at least 8 characters long";
                }
            }
        },
    });

    const submit = form.onSubmit((values) => {
        console.log(values);
    });

    const googleAuth = () => {
        console.log("GOOGLE BTN CLICKED!");
    };

    const intraAuth = () => {
        console.log("42 BTN CLICKED!");
    };

    const auths: auths = {
        google: googleAuth,
        intra: intraAuth,
    }

    return (
        <Container className={classes.container}>
            <Container size="400px" className={classes.form}>
                <Back_Button func={setLoginShow} />
                <Paper w="100%" p="xl" radius="md" withBorder component="form" onSubmit={submit}>
                    <Text size="lg" weight={500}>
                        Login with
                    </Text>
                    <Third_party_login auths={auths} />
                    <Divider label="Or continue with email" labelPosition="center" mt="lg" />
                    <Email_Auth_Method form={form} />
                    <Flex mt="lg" justify="space-between" align="center">
                        <Register_Link action={setRegisterShow} />
                        <Button type="submit" color="orange" variant="filled" uppercase radius="lg">
                            Login
                        </Button>
                    </Flex>
                </Paper>
                <Forgot_Password_Link />
            </Container>
        </Container>
    );
}
