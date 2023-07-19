import { Box, Grid } from "@mantine/core";
import { DashboardLayout } from "@/Components/dashboard/dashboard_layout";
import { Head } from "@/Components/head";
import { useEffect, useState } from "react";
import api from "@/api";
import store, { setPrivateChats, setProfile } from "@/store/store";
import { Loading } from "@/Components/loading/loading";
// import socket from "@/socket";

export default function Dashboard() {
    // const [loading, setLoading] = useState(true);
    // useEffect(() => {
    //     api.get("/user/profile")
    //         .then((res: any) => {
    //             if (res.status == 200) {
    //                 store.dispatch(setProfile(res.data));
    //                 setLoading(false);
    //             } else {
    //                 window.location.href = "/";
    //             }
    //         })
    //         .catch((err: any) => {
    //             // redirect to login
    //             window.location.href = "/";
    //         });
    // }, []);

    // if (loading) {
    //     return <Loading />;
    // }

    return (
        <>
            <Head title="70sPong - dashboard" description="70sPong" keywords="70sPong" icon="/favicon.svg" />
            <Box w="100%" h={"100vh"}>
                <DashboardLayout />
            </Box>
        </>
    );
}
