import { DashboardLayout } from "@/layout/dashboard.layout";
import { Head } from "@/Components/head";
import { useEffect, useState } from "react";
import api from "@/api";
import store, { setProfile } from "@/store/store";
import { Loading } from "@/Components/loading/loading";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
                    store.dispatch(setProfile(res.data));
                    setLoading(false);
                } else {
                    window.location.href = "/";
                }
            })
            .catch((err: any) => {
                // redirect to login
                window.location.href = "/";
            });
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Head title="Xpong - dashboard" description="Xpong" keywords="Xpong" icon="/favicon.ico" />
            <DashboardLayout />
        </>
    );
}
