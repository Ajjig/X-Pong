import { GameLayout } from "@/layout/game.layout";
import { useRouter } from "next/router";
import React from "react";

export default function Game() {
    const router = useRouter();
    const { gameID } = router.query;

    if (!gameID) return (<>
        <h1>404</h1>
    </>);

    return <GameLayout gameID={gameID} />;
}
