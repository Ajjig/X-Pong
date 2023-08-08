import { GameLayout } from "@/layout/game.layout";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "@/Components/loading/loading";

export default function Game() {
    const router = useRouter();
    const { gameID } = router.query;

    if (!gameID) return <Loading />;

    return <GameLayout gameID={gameID} />;
}
