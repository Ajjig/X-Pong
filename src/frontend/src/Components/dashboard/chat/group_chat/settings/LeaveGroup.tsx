import React from "react";
import { LeaveChannelDto } from "../type";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/api";
import { notifications } from "@mantine/notifications";
import chatSocket from "@/socket/chatSocket";
import store, { setCurrentChatGroup } from "@/store/store";
import { Button } from "@mantine/core";


export function LeaveTheGroup({ chat }: { chat: any }) {
    function LeaveGroup() {
        let body: LeaveChannelDto = {
            channelId: chat.id,
        };

        api.post(`/user/leave_channel/`, body)
            .then((res: AxiosResponse) => {
                console.log(res.data);
                notifications.show({
                    title: "Left",
                    message: res.data.message ?? `You left ${chat.name}`,
                    color: "green",
                    autoClose: 5000,
                });
                chatSocket.emit("reconnect");
                store.dispatch(setCurrentChatGroup(null));
                close();
            })
            .catch((err: AxiosError<{ message: string }>) => {
                // console.log(err.response);
                notifications.show({
                    title: "Error",
                    message: err?.response?.data.message ?? "Something went wrong",
                    color: "red",
                    autoClose: 5000,
                });
            });
    }

    return (
        <Button variant="filled" color="red" size="xs" onClick={() => LeaveGroup()}>
            Leave
        </Button>
    );
}
