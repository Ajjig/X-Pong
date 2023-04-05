import { GoogleButton, Network42Button } from "@/Components/SocialButtons";
import {
    Box,
    Container,
    Group,
    Paper,
    Text,
    Title,
    Button,
    Divider,
    TextInput,
    PasswordInput,
    Flex,
    Anchor,
    Space,
} from "@mantine/core";
import { createStyles } from "@mantine/core";
import Back_Button from "../login/components/Back_Button";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import Email_Auth_Method from "../login/components/Email_Auth_Method";
import { auths, Third_party_login } from "../login/components/Third_party_login";
import Full_Name_Input from "./components/Full_Name_Input";
import Login_Link from "./components/Login_link";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
        width: "100vw",
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

export default function Register({ setRegisterShow }: { setRegisterShow: (value: boolean) => void }) {
    const { classes } = useStyles();

    const form = useForm({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },

        validate: {
            email: isEmail("Email is not valid"),
            password: (value) => {
                if (value.length < 8) {
                    return "Password must be at least 8 characters long";
                }
            },
            firstName: isNotEmpty("First name is required"),
            lastName: isNotEmpty("Last name is required"),
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
    };

    return (
        <Container className={classes.container}>
            <Container size="400px" className={classes.form}>
                <Back_Button func={setRegisterShow} />
                <Paper w="100%" p="xl" radius="md" withBorder component="form" onSubmit={submit}>
                    <Text size="lg" weight={500}>
                        Register with
                    </Text>
                    <Third_party_login auths={auths} />
                    <Divider label="Or continue with email" labelPosition="center" my="lg" />
                    <Email_Auth_Method form={form}>
                        <Full_Name_Input form={form} />
                    </Email_Auth_Method>
                    <Flex mt="lg" justify="space-between" align="center">
                        <Login_Link action={setRegisterShow} />
                        <Button type="submit" color="orange" variant="filled" uppercase radius="lg">
                            Register
                        </Button>
                    </Flex>
                </Paper>
            </Container>
        </Container>
    );
}
