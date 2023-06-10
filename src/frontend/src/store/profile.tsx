import { createSlice } from "@reduxjs/toolkit";

const initialStateProfile = {
    user: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState: initialStateProfile,
    reducers: {
        setProfile: (state, action) => {
            state.user = action.payload;
        }
    },
});

export  {
    profileSlice
};