import { Box, Grid } from "@mantine/core";
import { DashboardLayout } from "@/Components/dashboard/dashboard_layout";
import { Head } from "@/Components/head";
import { useEffect } from "react";
import api from "@/api";
import store, { setPrivateChats, setProfile } from "@/store/store";
import { io } from "socket.io-client";

export default function Dashboard() {
    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) store.dispatch(setProfile(res.data));
                else window.location.href = "/";
            })
            .catch((err: any) => {
                // redirect to login
                window.location.href = "/";
            });

        const socket = io("http://localhost:3000/chat", {
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("connected");
        });

        // socket.emit("message", {
        //     receiver: "alo",
        //     msg: "Hello",
        // });

        socket.on("disconnect", () => {
            console.log("disconnected");
        });

        // listen to all events from server
        socket.onAny((event, ...args) => {
            console.log(event, args);
        });

        socket.on("error", (data: any) => {
            console.log(data);
        });

        socket.on("privateChat", (data) => {
            console.log("privateChat: ", data);
            store.dispatch(setPrivateChats(data));
        });

        socket.on("publicChat", (data) => {
            console.log("publicChat: ", data);
        });
    }, []);

    return (
        <>
            <Head title="70sPong - dashboard" description="70sPong" keywords="70sPong" icon="/favicon.svg" />
            <Box w="100%" h={"100vh"}>
                <DashboardLayout />
            </Box>
        </>
    );
}
