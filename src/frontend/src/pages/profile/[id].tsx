import { ProfileLayout } from "@/Components/profile/profileLayout";
import React, { use, useEffect, useState } from "react";
import store, { setProfile } from "@/store/store";
import api from "@/api";
import { Head } from "@/Components/head";
import { useRouter } from "next/router";
import { Loading } from "@/Components/loading/loading";

export default function Profile() {
    const router = useRouter();
    const [id, setId] = useState<string>("");

    useEffect(() => {
        if (router.query.id) setId(router.query.id as string);
    }, [router]);

    useEffect(() => {
        // get id nextjs router
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

    if (id == "") return <Loading />;

    return (
        <>
            <Head title="Profile" description="Profile" keywords="Profile" icon="/favicon.ico" />
            <ProfileLayout id={id} />
        </>
    );
}
