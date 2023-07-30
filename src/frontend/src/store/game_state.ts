import { gameState } from "@/Components/game/types.d";
import { createSlice } from "@reduxjs/toolkit";

const initialStateProfile = {
    gameState: {
        ball: {
            x: 0,
            y: 0,
        },
        player1: {
            x: 0,
            y: 0,
        },
        player2: {
            x: 0,
            y: 0,
        },
    },
};

const gameStateSlice = createSlice({
    name: "gameState",
    initialState: initialStateProfile as { gameState: gameState },
    reducers: {
        setGameState: (state, action) => {
            state.gameState = action.payload;
        },
    },
});

export { gameStateSlice };
