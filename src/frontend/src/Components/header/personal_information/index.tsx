import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Box, LoadingOverlay, Menu, rem, Avatar, Flex, TextInput, Space, Button, ActionIcon, FileInput, FileButton, Group } from "@mantine/core";

import { useEffect, useState } from "react";
import { IconPencil, IconUser } from "@tabler/icons-react";
import store, { updateAvatar } from "@/store/store";
import api from "@/api";
import { AxiosError, AxiosResponse } from "axios";
import { notifications } from "@mantine/notifications";

export function Personalinformation({ opened, open, close }: { opened: boolean; open: any; close: any }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<any>();

    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (file) setProfileImage(URL.createObjectURL(file));
        else setProfileImage(store.getState().profile.user.avatarUrl);
        console.log(file);
    }, [file]);

    function uploadAvatar() {
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
                store.dispatch(updateAvatar(res.data.path));


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
                    <TextInput label="Username" placeholder="Username" sx={{ width: "100%" }} value={store.getState().profile.user.username} />
                    <Space h={15} />
                    <TextInput label="Display name" placeholder="Display name" sx={{ width: "100%" }} value={store.getState().profile.user.name} />
                    <Space h={30} />
                    <Button variant="filled" color="purple" fullWidth onClick={uploadAvatar}>
                        Save
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
