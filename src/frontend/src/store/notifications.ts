import { createSlice } from "@reduxjs/toolkit";

const initialNotifications = {
    friend_requests: null,
};

const NotificationsSlice = createSlice({
    name: "notifications",
    initialState: initialNotifications,
    reducers: {
        setNotifications: (state, action) => {
            state.friend_requests = action.payload;
        },
    },
});

export { NotificationsSlice };
