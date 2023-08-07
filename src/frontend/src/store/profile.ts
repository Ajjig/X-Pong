import { createSlice } from "@reduxjs/toolkit";

interface UserType {
    id: number;
    email: string;
    name: string;
    username: string;
    avatarUrl: string;
    oauthId: null | string;
    istwoFactor: boolean;
    twoFactorAuthSecret: null | string;
    onlineStatus: string;
    blockedIds: number[];
    createdAt: string;
    updatedAt: string;
    confirmed: boolean;
    onlineAt: string;
    isBanned: boolean;
    socketId: null | string;
    privateChannels: any[];
    Userstats: {
        id: number;
        wins: number;
        losses: number;
        ladder: string;
        createdAt: string;
        updatedAt: string;
        userId: number;
    };
    Matchs: any[];
    Friends: any[];
    channels: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
        type: string;
        password: null | string;
        salt: null | string;
        ownerId: number;
        adminsIds: number[];
    }[];
    AdminOf: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
        type: string;
        password: null | string;
        salt: null | string;
        ownerId: number;
        adminsIds: number[];
    }[];
}

const initialStateProfile: { user: UserType } = {
    user: {
        // Initialize with default values for the user object here
        id: 0,
        email: "",
        name: "",
        username: "",
        avatarUrl: "",
        oauthId: null,
        istwoFactor: false,
        twoFactorAuthSecret: null,
        onlineStatus: "offline",
        blockedIds: [],
        createdAt: "",
        updatedAt: "",
        confirmed: false,
        onlineAt: "",
        isBanned: false,
        socketId: null,
        privateChannels: [],
        Userstats: {
            id: 0,
            wins: 0,
            losses: 0,
            ladder: "",
            createdAt: "",
            updatedAt: "",
            userId: 0,
        },
        Matchs: [],
        Friends: [],
        channels: [
            {
                id: 0,
                name: "",
                createdAt: "",
                updatedAt: "",
                type: "",
                password: null,
                salt: null,
                ownerId: 0,
                adminsIds: [],
            },
        ],
        AdminOf: [
            {
                id: 0,
                name: "",
                createdAt: "",
                updatedAt: "",
                type: "",
                password: null,
                salt: null,
                ownerId: 0,
                adminsIds: [],
            },
        ],
    },
};

const profileSlice = createSlice({
    name: "profile",
    initialState: initialStateProfile,
    reducers: {
        setProfile: (state, action) => {
            state.user = action.payload;
        },
        updateAvatar: (state, action) => {
            state.user.avatarUrl = action.payload.avatarUrl;
        },
        set2fa: (state, action) => {
            state.user.istwoFactor = action.payload;
        },
    },
});

export { profileSlice };
