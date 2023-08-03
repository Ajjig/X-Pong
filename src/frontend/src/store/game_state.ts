import { gameState, oppType } from "@/Components/game/types.d";
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
    opp: {
        roomName: "",
        player: 0,
        opponentName: "",
    },
};

const gameStateSlice = createSlice({
    name: "gameState",
    initialState: initialStateProfile as { gameState: gameState, opp: oppType},
    reducers: {
        setGameState: (state, action) => {
            state.gameState = action.payload;
        },
        setOpp: (state, action) => {
            state.opp = action.payload;
        }
    },
});

export { gameStateSlice };
