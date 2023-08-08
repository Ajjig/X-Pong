import { forwardRef, useEffect, useState } from "react";
import { Icon2fa, IconLogout, IconPacman, IconUser } from "@tabler/icons-react";
import { Group, Avatar, Text, Menu, UnstyledButton, rem } from "@mantine/core";
import Link from "next/link";
import store from "@/store/store";
import { Personalinformation } from "./personal_information";
import { useDisclosure } from "@mantine/hooks";
import { Two_factor_authentication } from "./Two-factor-authentication";
import api from "@/api";

function ProfileSection({ closeDrawer }: { closeDrawer: any }) {
    const [profile, setProfile] = useState<any>(null);
    const [PersonalinformationOpened, PersonalinformationSettings] = useDisclosure();
    const [TwoFactorAuthenticationOpened, TwoFactorAuthenticationSettings] = useDisclosure();

    useEffect(() => {
        setProfile(store.getState().profile.user);
        store.subscribe(() => {
            setProfile(store.getState().profile.user);
        });
    }, []);

    return (
        <Group position="center">
            <Menu withArrow shadow="md" arrowPosition="side" arrowSize={15} position="bottom-end" arrowOffset={15}>
                <Menu.Target>
                    <Group sx={{ cursor: "pointer" }}>
                        {profile?.id && <Avatar src={api.getUri() + `user/avatar/${profile?.id}`} radius="xl" size={43} />}
                    </Group>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item
                        icon={<IconUser size={rem(20)} />}
                        miw={"200px"}
                        onClick={() => (closeDrawer && closeDrawer(), PersonalinformationSettings.open())}
                    >
                        Personal information
                    </Menu.Item>
                    <Menu.Item
                        icon={<Icon2fa size={rem(20)} />}
                        miw={"200px"}
                        onClick={() => (TwoFactorAuthenticationSettings.open(), closeDrawer && closeDrawer())}
                    >
                        Two-factor authentication
                    </Menu.Item>

                    <Menu.Label>Account</Menu.Label>
                    <MyAccount profile={profile} />
                    <LogOut />
                </Menu.Dropdown>
            </Menu>

            <Personalinformation opened={PersonalinformationOpened} open={PersonalinformationSettings.open} close={PersonalinformationSettings.close} />
            <Two_factor_authentication
                opened={TwoFactorAuthenticationOpened}
                open={TwoFactorAuthenticationSettings.open}
                close={TwoFactorAuthenticationSettings.close}
            />
        </Group>
    );
}

function MyAccount({ profile }: { profile: any }) {
    return (
        <Link
            href={"/profile/" + profile?.id}
            style={{
                textDecoration: "none",
            }}
        >
            <Menu.Item icon={<IconPacman size={rem(20)} />} miw={"200px"}>
                My account
            </Menu.Item>
        </Link>
    );
}

function LogOut() {
    return (
        <Menu.Item
            onClick={() => {
                // clear the jwt token from the cookies and redirect to the login page
                document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/";
            }}
            icon={<IconLogout size={rem(20)} />}
            color="red"
        >
            Log out
        </Menu.Item>
    );
}

export default ProfileSection;
