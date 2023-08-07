import React from "react";
import { Modal, Box, LoadingOverlay, rem, Avatar, Flex, TextInput, Space, Button, ActionIcon, FileButton, Group } from "@mantine/core";

import { useEffect, useState } from "react";
import { IconPencil } from "@tabler/icons-react";
import store, { setProfile, updateAvatar } from "@/store/store";
import api from "@/api";
import { AxiosError, AxiosResponse } from "axios";
import { notifications } from "@mantine/notifications";
import { UpdateUserProfileDto } from "./type";

export function Personalinformation({ opened, open, close }: { opened: boolean; open: any; close: any }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<any>();
    const [file, setFile] = useState<File | null>(null);
    const [username, setUsername] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");

    useEffect(() => {
        if (file) setProfileImage(URL.createObjectURL(file));
        else setProfileImage(store.getState().profile.user.avatarUrl);
        setDisplayName(store.getState().profile.user.name);
        setUsername(store.getState().profile.user.username);
    }, [file, opened]);

    function uploadAvatar() {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file as File);

        api.post("/user/upload", formData)
            .then((res: AxiosResponse) => {
                console.log(res);
                setLoading(false);
                notifications.show({
                    title: "Success",
                    message: "Avatar updated",
                    color: "green",
                });

                // update avatar in store
                let prevProfile = store.getState().profile.user;
                store.dispatch(setProfile({ ...prevProfile, avatarUrl: res.data.path }));
                setFile(null);
            })
            .catch((err: AxiosError<{ message: string }>) => {
                console.log(err.response?.data);
                notifications.show({
                    title: "Error",
                    message: err.response?.data.message,
                    color: "red",
                });
                setLoading(false);
            });
    }

    function updateProfile() {
        let _username = username.trim();
        let _displayName = displayName.trim();

        if (_username === store.getState().profile.user.username && _displayName === store.getState().profile.user.name) return;
        setLoading(true);
        let body: UpdateUserProfileDto = {
            username: _username,
            name: _displayName,
            avatarUrl: null,
        };
        api.post("/user/update_user_profile", body)
            .then((res: AxiosResponse) => {
                console.log(res.data);
                setLoading(false);
                notifications.show({
                    title: "Success",
                    message: "Profile updated",
                    color: "green",
                });

                const prevProfile = store.getState().profile.user;
                store.dispatch(setProfile({ ...prevProfile, username: _username, name: _displayName }));
            })
            .catch((err: AxiosError<{ message: string }>) => {
                console.log(err.response?.data);
                notifications.show({
                    title: "Error",
                    message: err.response?.data.message,
                    color: "red",
                });
                setLoading(false);
            });
    }

    return (
        <>
            <Modal
                overlayProps={{
                    opacity: 0.55,
                    blur: 8,
                }}
                opened={opened}
                onClose={close}
                centered
                radius={30}
                withCloseButton={!loading}
            >
                <LoadingOverlay visible={loading} overlayBlur={3} />
                <Box maw={300} mx="auto" pb={50}>
                    <Flex align="center" justify="center">
                        <Box pos="relative">
                            <Avatar src={file ? URL.createObjectURL(file) : profileImage} radius="lg" size={90} />
                            <Group position="center">
                                <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                    {(props) => (
                                        <ActionIcon
                                            {...props}
                                            variant="filled"
                                            color="purple"
                                            w={30}
                                            h={30}
                                            radius="xl"
                                            sx={{
                                                position: "absolute",
                                                cursor: "pointer",
                                                zIndex: 1,
                                                bottom: -10,
                                                right: -10,
                                            }}
                                        >
                                            <IconPencil size={rem(20)} />
                                        </ActionIcon>
                                    )}
                                </FileButton>
                            </Group>
                        </Box>
                    </Flex>
                    <Space h={15} />
                    <TextInput
                        label="Username"
                        placeholder="Username"
                        sx={{ width: "100%" }}
                        value={username}
                        onChange={(e) => setUsername(e.currentTarget.value)}
                    />
                    <Space h={15} />
                    <TextInput
                        label="Display name"
                        placeholder="Display name"
                        sx={{ width: "100%" }}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.currentTarget.value)}
                    />
                    <Space h={30} />
                    <Button
                        variant="filled"
                        color="purple"
                        fullWidth
                        onClick={() => {
                            uploadAvatar();
                            updateProfile();
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
