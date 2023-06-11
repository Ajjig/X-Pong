import { ProfileLayout } from "@/Components/profile/profileLayout";
import React, { useEffect } from "react";
import store, { setProfile } from "@/store/store";
import api from "@/api";
import { Head } from "@/Components/head";

export default function Profile() {
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
            <Head title="Profile" description="Profile" keywords="Profile" icon="/favicon.ico" />
            <ProfileLayout />;
        </>
    );
}
