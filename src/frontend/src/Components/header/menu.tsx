import { forwardRef, useEffect, useState } from "react";
import { Icon2fa, IconLogout, IconPacman, IconUser } from "@tabler/icons-react";
import { Group, Avatar, Text, Menu, UnstyledButton, rem } from "@mantine/core";
import Link from "next/link";
import store from "@/store/store";
import { Personalinformation } from "./personal_information";
import { useDisclosure } from "@mantine/hooks";

function ProfileSection({}: {}) {
    const [profile, setProfile] = useState<any>(null);
    const [PersonalinformationOpened, PersonalinformationSettings] = useDisclosure();

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
                        <Avatar src={profile?.avatarUrl} radius="xl" size={43} />
                    </Group>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item icon={<IconUser size={rem(20)} />} miw={"200px"} onClick={PersonalinformationSettings.open}>
                        Personal information
                    </Menu.Item>
                    <Menu.Item icon={<Icon2fa size={rem(20)} />} miw={"200px"}>
                        Two-factor authentication
                    </Menu.Item>

                    <Menu.Label>Account</Menu.Label>
                    <MyAccount profile={profile} />
                    <LogOut />
                </Menu.Dropdown>
            </Menu>

            <Personalinformation opened={PersonalinformationOpened} open={PersonalinformationSettings.open} close={PersonalinformationSettings.close} />
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
