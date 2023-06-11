import { Box, Grid } from "@mantine/core";
import { DashboardLayout } from "@/Components/dashboard/dashboard_layout";
import { Head } from "@/Components/head";
import { useEffect } from "react";
import api from "@/api";
import store, { setProfile } from "@/store/store";

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
